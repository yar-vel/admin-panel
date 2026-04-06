import { describe, it, expect } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, ROUTES, userCookies, wrongId } from './app.setup';
import {
  IReqItems,
  IUser,
  IUsersRoles,
  TUserCreate,
  TUserReqList,
  TUserResList,
  TUserUpdate,
} from '@workspace/shared';

export const runUsersTests = () => {
  describe('Users', () => {
    let entity: IUser;

    describe('Create', () => {
      const createEntity: TUserCreate = {
        name: 'Test',
        email: 'test0@mail.com',
        password: '!Q1q2w3e4rr4e3w2q1Q!',
        enabled: true,
      };

      it('Incorrect', async () => {
        const createRes1 = await app.inject({
          method: 'POST',
          url: ROUTES.users._,
        });
        expect(createRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const createRes2 = await app.inject({
          method: 'POST',
          url: ROUTES.users._,
          headers: { cookie: adminCookies.value },
          payload: {},
        });
        expect(createRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createRes = await app.inject({
          method: 'POST',
          url: ROUTES.users._,
          headers: { cookie: adminCookies.value },
          payload: createEntity,
        });
        expect(createRes.statusCode).toEqual(HttpStatus.CREATED);
        entity = createRes.json();
        expect(entity).toHaveProperty('id');
        expect(entity).toHaveProperty('name', entity.name);
        expect(entity).toHaveProperty('email', createEntity.email);
        expect(entity).toHaveProperty('enabled', createEntity.enabled);
      });

      it('Correct (user)', async () => {
        const createRes = await app.inject({
          method: 'POST',
          url: ROUTES.users._,
          headers: { cookie: userCookies.value },
          payload: createEntity,
        });
        expect(createRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get List', () => {
      it('Incorrect', async () => {
        const getListRes = await app.inject({
          method: 'GET',
          url: ROUTES.users._,
        });
        expect(getListRes.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const getListRes1 = await app.inject({
          method: 'GET',
          url: ROUTES.users._,
          headers: { cookie: adminCookies.value },
          query: {
            reqLimit: '1',
            reqPage: '1',
            reqCount: 'true',
          } satisfies { [k in keyof TUserReqList]: string },
        });
        expect(getListRes1.statusCode).toEqual(HttpStatus.OK);
        const list1: TUserResList = getListRes1.json();
        expect(list1).toHaveProperty('meta');
        expect(list1.meta).toHaveProperty('total', 3);
        expect(list1.meta).toHaveProperty('page', 1);
        expect(list1.meta).toHaveProperty('limit', 1);

        const getListRes2 = await app.inject({
          method: 'GET',
          url: ROUTES.users._,
          headers: { cookie: adminCookies.value },
          query: {
            reqLimit: '1',
            reqPage: '1',
            email: 'test0',
          } satisfies { [k in keyof TUserReqList]: string },
        });
        expect(getListRes2.statusCode).toEqual(HttpStatus.OK);
        const list2: TUserResList = getListRes2.json();
        expect(list2.rows).toHaveProperty('length', 1);
        expect(list2.rows[0]).toHaveProperty('email', entity.email);
      });

      it('Correct (user)', async () => {
        const getListRes = await app.inject({
          method: 'GET',
          url: ROUTES.users._,
          headers: { cookie: userCookies.value },
        });
        expect(getListRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get One', () => {
      it('Incorrect', async () => {
        const getOneRes1 = await app.inject({
          method: 'GET',
          url: ROUTES.users.user(entity.id),
        });
        expect(getOneRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const getOneRes2 = await app.inject({
          method: 'GET',
          url: ROUTES.users.user(wrongId),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes2.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.OK);
        const element: IUser = getOneRes.json();
        expect(element).toHaveProperty('id', entity.id);
        expect(element).toHaveProperty('name', entity.name);
        expect(element).toHaveProperty('email', entity.email);
        expect(element).toHaveProperty('enabled', entity.enabled);
      });

      it('Correct (user)', async () => {
        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: userCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        const updateRes1 = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.user(entity.id),
        });
        expect(updateRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const updateRes2 = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(updateRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const updateRes3 = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: adminCookies.value },
          payload: { test: true },
        });
        expect(updateRes3.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const updateRes4 = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.user(wrongId),
          headers: { cookie: adminCookies.value },
          payload: { enabled: true } satisfies TUserUpdate,
        });
        expect(updateRes4.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const updateRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: adminCookies.value },
          payload: {
            name: entity.name + entity.name,
          } satisfies TUserUpdate,
        });
        expect(updateRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        entity.name = entity.name + entity.name;

        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.OK);
        const element: IUser = getOneRes.json();
        expect(element).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        const updateRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: userCookies.value },
        });
        expect(updateRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update Roles', () => {
      it('Incorrect', async () => {
        const updateRolesRes1 = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.userRoles(entity.id),
        });
        expect(updateRolesRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const updateRolesRes2 = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.userRoles(entity.id),
          headers: { cookie: adminCookies.value },
          payload: { test: true },
        });
        expect(updateRolesRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const updateRolesRes3 = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.userRoles(wrongId),
          headers: { cookie: adminCookies.value },
          payload: { items: [] } satisfies IReqItems<IUsersRoles>,
        });
        expect(updateRolesRes3.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getListRes = await app.inject({
          method: 'GET',
          url: ROUTES.roles._,
          headers: { cookie: adminCookies.value },
        });
        expect(getListRes.statusCode).toEqual(HttpStatus.OK);
        const list: TUserResList = getListRes.json();
        const role = list.rows[1];

        const updateRolesRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.userRoles(entity.id),
          headers: { cookie: adminCookies.value },
          payload: {
            items: [{ roleId: role.id, userId: entity.id }],
          } satisfies IReqItems<IUsersRoles>,
        });
        expect(updateRolesRes.statusCode).toEqual(HttpStatus.NO_CONTENT);

        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.OK);
        const element: IUser = getOneRes.json();
        expect(element.roles).toBeDefined();
        expect(element.roles).toHaveProperty('length', 1);
        expect(element.roles![0]).toHaveProperty('id', role.id);
      });

      it('Correct (user)', async () => {
        const updateRolesRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.users.userRoles(entity.id),
          headers: { cookie: userCookies.value },
        });
        expect(updateRolesRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        const deleteRes1 = await app.inject({
          method: 'DELETE',
          url: ROUTES.users._,
          payload: { items: [entity.id] } satisfies IReqItems<IUser['id']>,
        });
        expect(deleteRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const deleteRes2 = await app.inject({
          method: 'DELETE',
          url: ROUTES.users._,
          headers: { cookie: adminCookies.value },
          payload: { items: [wrongId] } satisfies IReqItems<IUser['id']>,
        });
        expect(deleteRes2.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const deleteRes = await app.inject({
          method: 'DELETE',
          url: ROUTES.users._,
          headers: { cookie: adminCookies.value },
          payload: { items: [entity.id] } satisfies IReqItems<IUser['id']>,
        });
        expect(deleteRes.statusCode).toEqual(HttpStatus.NO_CONTENT);

        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.users.user(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (user)', async () => {
        const deleteRes = await app.inject({
          method: 'DELETE',
          url: ROUTES.users._,
          headers: { cookie: userCookies.value },
        });
        expect(deleteRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });
  });
};
