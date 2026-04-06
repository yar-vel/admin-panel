import { describe, it, expect } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import {
  admin,
  adminCookies,
  app,
  queue,
  ROUTES,
  user,
  userCookies,
  wrongValue,
} from './app.setup';
import {
  IForgotPassword,
  IResetPassword,
  ISignIn,
  IUser,
  IVerifyUser,
  TSignUp,
} from '@workspace/shared';

export const runAuthTests = () => {
  describe('Auth', () => {
    describe('Sign Up', () => {
      it('Incorrect (admin)', async () => {
        const signUpRes1 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.sighUp,
          payload: { ...admin, name: wrongValue } satisfies SignUpDto,
        });
        expect(signUpRes1.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const signUpRes2 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.sighUp,
          payload: { ...admin, email: wrongValue } satisfies SignUpDto,
        });
        expect(signUpRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const signUpRes3 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.sighUp,
          payload: { ...admin, password: wrongValue } satisfies SignUpDto,
        });
        expect(signUpRes3.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const signUpRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.sighUp,
          payload: admin,
        });
        expect(signUpRes.statusCode).toEqual(HttpStatus.CREATED);
        const element: IUser = signUpRes.json();
        expect(element).toHaveProperty('name', admin.name);
        expect(element).toHaveProperty('email', admin.email);
        expect(element).toHaveProperty('enabled', true);
        expect(element).toHaveProperty('verified', false);
        expect(element).toHaveProperty('roles');
        expect(element.roles![0]).toHaveProperty('admin', true);
      });

      it('Incorrect (user)', async () => {
        const signUpRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.sighUp,
          payload: { ...user, email: admin.email } satisfies TSignUp,
        });
        expect(signUpRes.statusCode).toEqual(HttpStatus.CONFLICT);
      });

      it('Correct (user)', async () => {
        const signUpRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.sighUp,
          payload: user,
        });
        expect(signUpRes.statusCode).toEqual(HttpStatus.CREATED);
        const element: IUser = signUpRes.json();
        expect(element).toHaveProperty('name', user.name);
        expect(element).toHaveProperty('email', user.email);
        expect(element).toHaveProperty('enabled', true);
        expect(element).toHaveProperty('verified', false);
        expect(element).toHaveProperty('roles');
        expect(element.roles![0]).toHaveProperty('admin', false);
      });
    });

    describe('Verify User Request', () => {
      it('Incorrect', async () => {
        const verifyReqRes1 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: wrongValue,
            password: admin.password,
          } satisfies ISignIn,
        });
        expect(verifyReqRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const verifyReqRes2 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: admin.email,
            password: wrongValue,
          } satisfies ISignIn,
        });
        expect(verifyReqRes2.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const verifyReqRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: admin.email,
            password: admin.password,
          } satisfies ISignIn,
        });
        expect(verifyReqRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
        expect(queue.at(-1)).toHaveProperty('code');
        expect(queue.at(-1)).toHaveProperty('email', admin.email);
      });

      it('Correct (user)', async () => {
        const verifyReqRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: user.email,
            password: user.password,
          } satisfies ISignIn,
        });
        expect(verifyReqRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
        expect(queue.at(-1)).toHaveProperty('code');
        expect(queue.at(-1)).toHaveProperty('email', user.email);
      });
    });

    describe('Verify User Confirm', () => {
      it('Incorrect', async () => {
        const verifyConfRes1 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.verifyUser,
          payload: {
            code: wrongValue,
            email: queue.at(-1)!.email,
          } satisfies IVerifyUser,
        });
        expect(verifyConfRes1.statusCode).toEqual(HttpStatus.NOT_FOUND);

        const verifyConfRes2 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.verifyUser,
          payload: {
            code: queue.at(-1)!.code,
            email: wrongValue,
          } satisfies IVerifyUser,
        });
        expect(verifyConfRes2.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const verifyConfRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.verifyUser,
          payload: {
            code: queue.at(-2)!.code,
            email: queue.at(-2)!.email,
          } satisfies IVerifyUser,
        });
        expect(verifyConfRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
      });

      it('Correct (user)', async () => {
        const verifyConfRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.verifyUser,
          payload: {
            code: queue.at(-1)!.code,
            email: queue.at(-1)!.email,
          } satisfies IVerifyUser,
        });
        expect(verifyConfRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
      });
    });

    describe('Forgot Password', () => {
      it('Incorrect', async () => {
        const forgotRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.forgotPassword,
          payload: { email: wrongValue } satisfies IForgotPassword,
        });
        expect(forgotRes.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const forgotRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.forgotPassword,
          payload: { email: admin.email } satisfies IForgotPassword,
        });
        expect(forgotRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        expect(queue.at(-1)).toHaveProperty('email', admin.email);
      });

      it('Correct (user)', async () => {
        const forgotRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.forgotPassword,
          payload: { email: user.email } satisfies IForgotPassword,
        });
        expect(forgotRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        expect(queue.at(-1)).toHaveProperty('email', user.email);
      });
    });

    describe('Reset Password', () => {
      it('Incorrect', async () => {
        const resetRes1 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.resetPassword,
          payload: {
            code: wrongValue,
            email: queue.at(-2)!.email,
            password: admin.password + admin.password,
          } satisfies IResetPassword,
        });
        expect(resetRes1.statusCode).toEqual(HttpStatus.NOT_FOUND);

        const resetRes2 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.resetPassword,
          payload: {
            code: queue.at(-2)!.code,
            email: wrongValue,
            password: admin.password + admin.password,
          } satisfies IResetPassword,
        });
        expect(resetRes2.statusCode).toEqual(HttpStatus.NOT_FOUND);

        const resetRes3 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.resetPassword,
          payload: {
            code: queue.at(-2)!.code,
            email: queue.at(-2)!.email,
            password: wrongValue,
          } satisfies IResetPassword,
        });
        expect(resetRes3.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        admin.password = admin.password + admin.password;
        const resetRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.resetPassword,
          payload: {
            code: queue.at(-2)!.code,
            email: queue.at(-2)!.email,
            password: admin.password,
          } satisfies IResetPassword,
        });
        expect(resetRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
      });

      it('Correct (user)', async () => {
        user.password = user.password + user.password;
        const resetRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.resetPassword,
          payload: {
            code: queue.at(-1)!.code,
            email: queue.at(-1)!.email,
            password: user.password,
          } satisfies IResetPassword,
        });
        expect(resetRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
      });
    });

    describe('Sign In', () => {
      it('Incorrect', async () => {
        const signInRes1 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: wrongValue,
            password: admin.password,
          } satisfies ISignIn,
        });
        expect(signInRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const signInRes2 = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: admin.email,
            password: wrongValue,
          } satisfies ISignIn,
        });
        expect(signInRes2.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const signInRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: admin.email,
            password: admin.password,
          } satisfies ISignIn,
        });
        expect(signInRes.statusCode).toEqual(HttpStatus.CREATED);
        expect(signInRes.headers).toHaveProperty('set-cookie');

        const element: IUser = signInRes.json();
        expect(element).toHaveProperty('id');
        expect(element).toHaveProperty('name', admin.name);
        expect(element).toHaveProperty('email', admin.email);
        expect(element).not.toHaveProperty('password');

        if (Array.isArray(signInRes.headers['set-cookie'])) {
          adminCookies.value = signInRes.headers['set-cookie'].join('; ');
        }
      });

      it('Correct (user)', async () => {
        const signInRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: user.email,
            password: user.password,
          } satisfies ISignIn,
        });
        expect(signInRes.statusCode).toEqual(HttpStatus.CREATED);

        const element: IUser = signInRes.json();
        expect(element).toHaveProperty('id');
        expect(element).toHaveProperty('name', user.name);
        expect(element).toHaveProperty('email', user.email);
        expect(element).not.toHaveProperty('password');
        expect(signInRes.headers).toHaveProperty('set-cookie');

        if (Array.isArray(signInRes.headers['set-cookie'])) {
          userCookies.value = signInRes.headers['set-cookie'].join('; ');
        }
      });
    });

    describe('Refresh', () => {
      it('Incorrect', async () => {
        const refreshRes = await app.inject({
          method: 'GET',
          url: ROUTES.auth.refresh,
        });
        expect(refreshRes.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const refreshRes = await app.inject({
          method: 'GET',
          url: ROUTES.auth.refresh,
          headers: { cookie: adminCookies.value },
        });
        expect(refreshRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        expect(refreshRes.headers).toHaveProperty('set-cookie');

        if (Array.isArray(refreshRes.headers['set-cookie'])) {
          adminCookies.value = refreshRes.headers['set-cookie'].join('; ');
        }
      });

      it('Correct (user)', async () => {
        const refreshRes = await app.inject({
          method: 'GET',
          url: ROUTES.auth.refresh,
          headers: { cookie: userCookies.value },
        });
        expect(refreshRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        expect(refreshRes.headers).toHaveProperty('set-cookie');

        if (Array.isArray(refreshRes.headers['set-cookie'])) {
          userCookies.value = refreshRes.headers['set-cookie'].join('; ');
        }
      });
    });
  });
};
