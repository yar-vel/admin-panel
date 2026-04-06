import { describe, it, expect } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';

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
  IChangeEmailConfirm,
  IChangeEmailRequest,
  IReqItems,
  ISignIn,
  IUpdatePassword,
  IUser,
  TSessionExternal,
  TUserUpdate,
} from '@workspace/shared';

export const runProfileTests = () => {
  describe('Profile', () => {
    describe('Get Profile', () => {
      it('Incorrect', async () => {
        const getProfileRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile._,
        });
        expect(getProfileRes.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const getProfileRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile._,
          headers: { cookie: adminCookies.value },
        });
        expect(getProfileRes.statusCode).toEqual(HttpStatus.OK);
        const element: IUser = getProfileRes.json();
        expect(element).toHaveProperty('id');
        expect(element).toHaveProperty('name', admin.name);
        expect(element).toHaveProperty('email', admin.email);
        expect(element).not.toHaveProperty('password');
      });

      it('Correct (user)', async () => {
        const getProfileRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile._,
          headers: { cookie: userCookies.value },
        });
        expect(getProfileRes.statusCode).toEqual(HttpStatus.OK);
        const element: IUser = getProfileRes.json();
        expect(element).toHaveProperty('id');
        expect(element).toHaveProperty('name', user.name);
        expect(element).toHaveProperty('email', user.email);
        expect(element).not.toHaveProperty('password');
      });
    });

    describe('Update Profile', () => {
      it('Incorrect', async () => {
        const updateProfileRes1 = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile._,
        });
        expect(updateProfileRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const updateProfileRes2 = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile._,
          headers: { cookie: adminCookies.value },
          payload: { password: admin.password },
        });
        expect(updateProfileRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const updateProfileRes3 = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile._,
          headers: { cookie: adminCookies.value },
        });
        expect(updateProfileRes3.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const updateProfileRes4 = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile._,
          headers: { cookie: adminCookies.value },
          payload: { name: wrongValue } satisfies TUserUpdate,
        });
        expect(updateProfileRes4.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const updateProfileRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile._,
          headers: { cookie: adminCookies.value },
          payload: { name: admin.name } satisfies TUserUpdate,
        });
        expect(updateProfileRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
      });

      it('Correct (user)', async () => {
        const updateProfileRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile._,
          headers: { cookie: userCookies.value },
          payload: { name: user.name } satisfies TUserUpdate,
        });
        expect(updateProfileRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
      });
    });

    describe('Update Password', () => {
      it('Incorrect', async () => {
        const updatePasswordRes1 = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile.updatePassword,
        });
        expect(updatePasswordRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const updatePasswordRes2 = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile.updatePassword,
          headers: { cookie: adminCookies.value },
          payload: {
            oldPassword: wrongValue,
            newPassword: admin.password + admin.password,
          } satisfies IUpdatePassword,
        });
        expect(updatePasswordRes2.statusCode).toEqual(HttpStatus.CONFLICT);

        const updatePasswordRes3 = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile.updatePassword,
          headers: { cookie: adminCookies.value },
          payload: {
            oldPassword: admin.password,
            newPassword: wrongValue,
          } satisfies IUpdatePassword,
        });
        expect(updatePasswordRes3.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const updatePasswordRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile.updatePassword,
          headers: { cookie: adminCookies.value },
          payload: {
            oldPassword: admin.password,
            newPassword: admin.password + admin.password,
          } satisfies IUpdatePassword,
        });
        expect(updatePasswordRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        admin.password = admin.password + admin.password;
      });

      it('Correct (user)', async () => {
        const updatePasswordRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile.updatePassword,
          headers: { cookie: userCookies.value },
          payload: {
            oldPassword: user.password,
            newPassword: user.password + user.password,
          } satisfies IUpdatePassword,
        });
        expect(updatePasswordRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        user.password = user.password + user.password;
      });
    });

    describe('Change Email Request', () => {
      const newAdminEmail = 'test3@test.com';
      const newUserEmail = 'test4@test.com';

      it('Incorrect', async () => {
        const changeEmailReqRes1 = await app.inject({
          method: 'POST',
          url: ROUTES.profile.changeEmail,
          payload: { newEmail: newAdminEmail } satisfies IChangeEmailRequest,
        });
        expect(changeEmailReqRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const changeEmailReqRes2 = await app.inject({
          method: 'POST',
          url: ROUTES.profile.changeEmail,
          headers: { cookie: adminCookies.value },
          payload: { newEmail: wrongValue } satisfies IChangeEmailRequest,
        });
        expect(changeEmailReqRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const changeEmailReqRes = await app.inject({
          method: 'POST',
          url: ROUTES.profile.changeEmail,
          headers: { cookie: adminCookies.value },
          payload: { newEmail: newAdminEmail } satisfies IChangeEmailRequest,
        });
        expect(changeEmailReqRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        expect(queue.at(-1)).toHaveProperty('code');
        expect(queue.at(-1)).toHaveProperty('email', newAdminEmail);
        admin.email = newAdminEmail;
      });

      it('Correct (user)', async () => {
        const changeEmailReqRes = await app.inject({
          method: 'POST',
          url: ROUTES.profile.changeEmail,
          headers: { cookie: userCookies.value },
          payload: { newEmail: newUserEmail } satisfies IChangeEmailRequest,
        });
        expect(changeEmailReqRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        expect(queue.at(-1)).toHaveProperty('code');
        expect(queue.at(-1)).toHaveProperty('email', newUserEmail);
        user.email = newUserEmail;
      });
    });

    describe('Change Email Confirm', () => {
      it('Incorrect', async () => {
        const changeEmailConfRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile.changeEmail,
          headers: { cookie: adminCookies.value },
        });
        expect(changeEmailConfRes.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const changeEmailConfRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile.changeEmail,
          headers: { cookie: adminCookies.value },
          payload: { code: queue.at(-2)!.code } satisfies IChangeEmailConfirm,
        });
        expect(changeEmailConfRes.statusCode).toEqual(HttpStatus.NO_CONTENT);

        const getProfileRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile._,
          headers: { cookie: adminCookies.value },
        });
        expect(getProfileRes.statusCode).toEqual(HttpStatus.OK);
        const element: IUser = getProfileRes.json();
        expect(element).toHaveProperty('email', admin.email);
      });

      it('Correct (user)', async () => {
        const changeEmailConfRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.profile.changeEmail,
          headers: { cookie: userCookies.value },
          payload: { code: queue.at(-1)!.code } satisfies IChangeEmailConfirm,
        });
        expect(changeEmailConfRes.statusCode).toEqual(HttpStatus.NO_CONTENT);

        const getProfileRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile._,
          headers: { cookie: userCookies.value },
        });
        expect(getProfileRes.statusCode).toEqual(HttpStatus.OK);
        const element: IUser = getProfileRes.json();
        expect(element).toHaveProperty('email', user.email);
      });
    });

    let adminSession: TSessionExternal;
    let userSession: TSessionExternal;

    describe('Get Sessions', () => {
      it('Incorrect', async () => {
        const getSessionsRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile.sessions,
        });
        expect(getSessionsRes.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const getSessionsRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile.sessions,
          headers: { cookie: adminCookies.value },
        });
        expect(getSessionsRes.statusCode).toEqual(HttpStatus.OK);
        const list: TSessionExternal[] = getSessionsRes.json();
        expect(list[0]).toHaveProperty('id');
        expect(list[0]).toHaveProperty('current', true);
        expect(list[0]).toHaveProperty('ip');
        expect(list[0]).toHaveProperty('updatedAt');
        adminSession = list[0];
      });

      it('Correct (user)', async () => {
        const getSessionsRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile.sessions,
          headers: { cookie: userCookies.value },
        });
        expect(getSessionsRes.statusCode).toEqual(HttpStatus.OK);
        const list: TSessionExternal[] = getSessionsRes.json();
        expect(list[0]).toHaveProperty('id');
        expect(list[0]).toHaveProperty('current', true);
        expect(list[0]).toHaveProperty('ip');
        expect(list[0]).toHaveProperty('updatedAt');
        userSession = list[0];
      });
    });

    describe('Delete Sessions', () => {
      it('Incorrect', async () => {
        const deleteSessionsRes1 = await app.inject({
          method: 'DELETE',
          url: ROUTES.profile.sessions,
        });
        expect(deleteSessionsRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const deleteSessionsRes2 = await app.inject({
          method: 'DELETE',
          url: ROUTES.profile.sessions,
          headers: { cookie: adminCookies.value },
          payload: {},
        });
        expect(deleteSessionsRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const deleteSessionsRes = await app.inject({
          method: 'DELETE',
          url: ROUTES.profile.sessions,
          headers: { cookie: adminCookies.value },
          payload: { items: [adminSession.id] } satisfies IReqItems<
            TSessionExternal['id']
          >,
        });
        expect(deleteSessionsRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        adminCookies.value = '';

        const getProfileRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile._,
          headers: { cookie: adminCookies.value },
        });
        expect(getProfileRes.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const signInRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: admin.email,
            password: admin.password,
          } satisfies ISignIn,
        });
        expect(signInRes.statusCode).toEqual(HttpStatus.CREATED);

        if (Array.isArray(signInRes.headers['set-cookie'])) {
          adminCookies.value = signInRes.headers['set-cookie'].join('; ');
        }
      });

      it('Correct (user)', async () => {
        const deleteSessionsRes = await app.inject({
          method: 'DELETE',
          url: ROUTES.profile.sessions,
          headers: { cookie: userCookies.value },
          payload: { items: [userSession.id] } satisfies IReqItems<
            TSessionExternal['id']
          >,
        });
        expect(deleteSessionsRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        userCookies.value = '';

        const getProfileRes = await app.inject({
          method: 'GET',
          url: ROUTES.profile._,
          headers: { cookie: userCookies.value },
        });
        expect(getProfileRes.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const signInRes = await app.inject({
          method: 'POST',
          url: ROUTES.auth.signIn,
          payload: {
            username: user.email,
            password: user.password,
          } satisfies ISignIn,
        });
        expect(signInRes.statusCode).toEqual(HttpStatus.CREATED);

        if (Array.isArray(signInRes.headers['set-cookie'])) {
          userCookies.value = signInRes.headers['set-cookie'].join('; ');
        }
      });
    });
  });
};
