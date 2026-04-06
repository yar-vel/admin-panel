import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';

import {
  adminCookies,
  app,
  closeApp,
  createApp,
  ROUTES,
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
      const signOutRes = await app.inject({
        method: 'DELETE',
        url: ROUTES.auth.signOut,
      });
      expect(signOutRes.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it('Correct (admin)', async () => {
      const signOutRes = await app.inject({
        method: 'DELETE',
        url: ROUTES.auth.signOut,
        headers: { cookie: adminCookies.value },
      });
      expect(signOutRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
      expect(signOutRes.headers).toHaveProperty('set-cookie');
    });

    it('Correct (user)', async () => {
      const signOutRes = await app.inject({
        method: 'DELETE',
        url: ROUTES.auth.signOut,
        headers: { cookie: userCookies.value },
      });
      expect(signOutRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
      expect(signOutRes.headers).toHaveProperty('set-cookie');
    });
  });
});
