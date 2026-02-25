import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import {
  adminCookies,
  app,
  closeApp,
  createApp,
  timeout,
  userCookies,
} from './app.setup';
import { runAuthTests } from './auth.test';
import { runProfileTests } from './profile.test';
import { runResourcesTests } from './resources.test';
import { runRolesTests } from './roles.test';
import { runUsersTests } from './users.test';

describe('App (e2e)', () => {
  beforeAll(async () => {
    await createApp();
  }, timeout);

  afterAll(async () => {
    await closeApp();
  });

  runAuthTests();
  runProfileTests();
  runResourcesTests();
  runRolesTests();
  runUsersTests();

  describe('Sign Out', () => {
    it('Incorrect', async () => {
      await request(app.getHttpServer())
        .delete('/auth/sign-out')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Correct (admin)', async () => {
      const resHeaders = await request(app.getHttpServer())
        .delete('/auth/sign-out')
        .set('Cookie', adminCookies)
        .expect(HttpStatus.NO_CONTENT)
        .then((res) => res.headers);

      expect(resHeaders).toHaveProperty('set-cookie');
    });

    it('Correct (user)', async () => {
      const resHeaders = await request(app.getHttpServer())
        .delete('/auth/sign-out')
        .set('Cookie', userCookies)
        .expect(HttpStatus.NO_CONTENT)
        .then((res) => res.headers);

      expect(resHeaders).toHaveProperty('set-cookie');
    });
  });
});
