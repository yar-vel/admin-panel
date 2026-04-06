import { describe, it, expect } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, ROUTES, userCookies, wrongId } from './app.setup';
import {
  IReqItems,
  IRights,
  IRole,
  TRoleCreate,
  TRoleReqList,
  TRoleUpdate,
  TRoleResList,
} from '@workspace/shared';

export const runRolesTests = () => {
  describe('Roles', () => {
    let entity: IRole;

    describe('Create', () => {
      const createEntity: TRoleCreate = {
        name: 'Test',
        description: 'Test entity',
        enabled: true,
      };

      it('Incorrect', async () => {
        const createRes1 = await app.inject({
          method: 'POST',
          url: ROUTES.roles._,
        });
        expect(createRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const createRes2 = await app.inject({
          method: 'POST',
          url: ROUTES.roles._,
          headers: { cookie: adminCookies.value },
          payload: {},
        });
        expect(createRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createRes = await app.inject({
          method: 'POST',
          url: ROUTES.roles._,
          headers: { cookie: adminCookies.value },
          payload: createEntity,
        });
        expect(createRes.statusCode).toEqual(HttpStatus.CREATED);
        entity = createRes.json();
        expect(entity).toHaveProperty('id');
        expect(entity).toHaveProperty('name', entity.name);
        expect(entity).toHaveProperty('description', createEntity.description);
        expect(entity).toHaveProperty('enabled', createEntity.enabled);
        expect(entity).toHaveProperty('default', false);
        expect(entity).toHaveProperty('admin', false);
      });

      it('Correct (user)', async () => {
        const createRes = await app.inject({
          method: 'POST',
          url: ROUTES.roles._,
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
          url: ROUTES.roles._,
        });
        expect(getListRes.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const getListRes1 = await app.inject({
          method: 'GET',
          url: ROUTES.roles._,
          headers: { cookie: adminCookies.value },
          query: {
            reqLimit: '1',
            reqPage: '1',
            reqCount: 'true',
          } satisfies { [k in keyof TRoleReqList]: string },
        });
        expect(getListRes1.statusCode).toEqual(HttpStatus.OK);
        const list1: TRoleResList = getListRes1.json();
        expect(list1).toHaveProperty('meta');
        expect(list1.meta).toHaveProperty('total', 3);
        expect(list1.meta).toHaveProperty('page', 1);
        expect(list1.meta).toHaveProperty('limit', 1);

        const getListRes2 = await app.inject({
          method: 'GET',
          url: ROUTES.roles._,
          headers: { cookie: adminCookies.value },
          query: {
            reqLimit: '1',
            reqPage: '1',
            name: 'te',
          } satisfies { [k in keyof TRoleReqList]: string },
        });
        expect(getListRes2.statusCode).toEqual(HttpStatus.OK);
        const list2: TRoleResList = getListRes2.json();
        expect(list2.rows).toHaveProperty('length', 1);
        expect(list2.rows[0]).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        const getListRes = await app.inject({
          method: 'GET',
          url: ROUTES.roles._,
          headers: { cookie: userCookies.value },
        });
        expect(getListRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get One', () => {
      it('Incorrect', async () => {
        const getOneRes1 = await app.inject({
          method: 'GET',
          url: ROUTES.roles.role(entity.id),
        });
        expect(getOneRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const getOneRes2 = await app.inject({
          method: 'GET',
          url: ROUTES.roles.role(wrongId),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes2.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.roles.role(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.OK);
        const element: IRole = getOneRes.json();
        expect(element).toHaveProperty('id', entity.id);
        expect(element).toHaveProperty('name', entity.name);
        expect(element).toHaveProperty('description', entity.description);
        expect(element).toHaveProperty('enabled', entity.enabled);
        expect(element).toHaveProperty('default', entity.default);
        expect(element).toHaveProperty('admin', entity.admin);
      });

      it('Correct (user)', async () => {
        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.roles.role(entity.id),
          headers: { cookie: userCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        const updateRes1 = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.role(entity.id),
        });
        expect(updateRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const updateRes2 = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.role(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(updateRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const updateRes3 = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.role(entity.id),
          headers: { cookie: adminCookies.value },
          payload: { test: true },
        });
        expect(updateRes3.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const updateRes4 = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.role(wrongId),
          headers: { cookie: adminCookies.value },
          payload: { enabled: true } satisfies TRoleUpdate,
        });
        expect(updateRes4.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const updateRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.role(entity.id),
          headers: { cookie: adminCookies.value },
          payload: {
            name: entity.name + entity.name,
          } satisfies TRoleUpdate,
        });
        expect(updateRes.statusCode).toEqual(HttpStatus.NO_CONTENT);
        entity.name = entity.name + entity.name;

        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.roles.role(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.OK);
        const element: IRole = getOneRes.json();
        expect(element).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        const updateRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.role(entity.id),
          headers: { cookie: userCookies.value },
        });
        expect(updateRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update Rights', () => {
      it('Incorrect', async () => {
        const updateRightsRes1 = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.roleRights(entity.id),
        });
        expect(updateRightsRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const updateRightsRes2 = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.roleRights(entity.id),
          headers: { cookie: adminCookies.value },
          payload: { test: true },
        });
        expect(updateRightsRes2.statusCode).toEqual(HttpStatus.BAD_REQUEST);

        const updateRightsRes3 = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.roleRights(wrongId),
          headers: { cookie: adminCookies.value },
          payload: { items: [] } satisfies IReqItems<IRights>,
        });
        expect(updateRightsRes3.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getListRes = await app.inject({
          method: 'GET',
          url: ROUTES.resources._,
          headers: { cookie: adminCookies.value },
        });
        expect(getListRes.statusCode).toEqual(HttpStatus.OK);
        const list: TRoleResList = getListRes.json();
        const resource = list.rows[0];

        const updateRightsRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.roleRights(entity.id),
          headers: { cookie: adminCookies.value },
          payload: {
            items: [
              {
                roleId: entity.id,
                resourceId: resource.id,
                creating: true,
                reading: true,
                updating: false,
                deleting: false,
              },
            ],
          } satisfies IReqItems<IRights>,
        });
        expect(updateRightsRes.statusCode).toEqual(HttpStatus.NO_CONTENT);

        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.roles.role(entity.id),
          headers: { cookie: adminCookies.value },
        });
        expect(getOneRes.statusCode).toEqual(HttpStatus.OK);
        const element: IRole = getOneRes.json();
        expect(element.rights).toBeDefined();
        expect(element.rights).toHaveProperty('length', 1);
        expect(element.rights![0]).toHaveProperty('resourceId', resource.id);
        expect(element.rights![0]).toHaveProperty('creating', true);
        expect(element.rights![0]).toHaveProperty('reading', true);
        expect(element.rights![0]).toHaveProperty('updating', false);
        expect(element.rights![0]).toHaveProperty('deleting', false);
      });

      it('Correct (user)', async () => {
        const updateRightsRes = await app.inject({
          method: 'PATCH',
          url: ROUTES.roles.roleRights(entity.id),
          headers: { cookie: userCookies.value },
        });
        expect(updateRightsRes.statusCode).toEqual(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        const deleteRes1 = await app.inject({
          method: 'DELETE',
          url: ROUTES.roles._,
          payload: { items: [entity.id] } satisfies IReqItems<IRole['id']>,
        });
        expect(deleteRes1.statusCode).toEqual(HttpStatus.UNAUTHORIZED);

        const deleteRes2 = await app.inject({
          method: 'DELETE',
          url: ROUTES.roles._,
          headers: { cookie: adminCookies.value },
          payload: { items: [wrongId] } satisfies IReqItems<IRole['id']>,
        });
        expect(deleteRes2.statusCode).toEqual(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const deleteRes = await app.inject({
          method: 'DELETE',
          url: ROUTES.roles._,
          headers: { cookie: adminCookies.value },
          payload: { items: [entity.id] } satisfies IReqItems<IRole['id']>,
        });
        expect(deleteRes.statusCode).toEqual(HttpStatus.NO_CONTENT);

        const getOneRes = await app.inject({
          method: 'GET',
          url: ROUTES.roles.role(entity.id),
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
