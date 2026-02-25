import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, userCookies, wrongId } from './app.setup';
import {
  IReqItems,
  IUser,
  IUsersRoles,
  TUserCreate,
  TUserReqList,
  TUserResList,
  TUserUpdate,
} from '@ap/shared/dist/types';
import { API_ROUTES, buildRoutes } from '@ap/shared/dist/libs';

const ROUTES = buildRoutes(API_ROUTES);

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
        await request(app.getHttpServer())
          .post(ROUTES.users._)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post(ROUTES.users._)
          .set('Cookie', adminCookies)
          .send({})
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createResBody = await request(app.getHttpServer())
          .post(ROUTES.users._)
          .set('Cookie', adminCookies)
          .send(createEntity)
          .expect(HttpStatus.CREATED)
          .then((res) => res.body as IUser);

        expect(createResBody).toHaveProperty('id');
        expect(createResBody).toHaveProperty('name', createResBody.name);
        expect(createResBody).toHaveProperty('email', createEntity.email);
        expect(createResBody).toHaveProperty('enabled', createEntity.enabled);

        entity = createResBody;
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post(ROUTES.users._)
          .set('Cookie', userCookies)
          .send(createEntity)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get List', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.users._)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        let getListResBody = await request(app.getHttpServer())
          .get(ROUTES.users._)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TUserReqList)
          .expect(HttpStatus.OK)
          .then((res) => res.body as TUserResList);

        expect(getListResBody).toHaveProperty('meta');
        expect(getListResBody.meta).toHaveProperty('total', 3);
        expect(getListResBody.meta).toHaveProperty('page', 1);
        expect(getListResBody.meta).toHaveProperty('limit', 1);

        getListResBody = await request(app.getHttpServer())
          .get(ROUTES.users._)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            email: 'test0',
          } satisfies TUserReqList)
          .expect(HttpStatus.OK)
          .then((res) => res.body as TUserResList);

        expect(getListResBody.rows).toHaveProperty('length', 1);
        expect(getListResBody.rows[0]).toHaveProperty('email', entity.email);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.users._)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get One', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.users.user(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .get(ROUTES.users.user(wrongId))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.users.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getOneResBody).toHaveProperty('id', entity.id);
        expect(getOneResBody).toHaveProperty('name', entity.name);
        expect(getOneResBody).toHaveProperty('email', entity.email);
        expect(getOneResBody).toHaveProperty('enabled', entity.enabled);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.users.user(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.users.user(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(ROUTES.users.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.users.user(entity.id))
          .set('Cookie', adminCookies)
          .send({ test: true })
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.users.user(wrongId))
          .set('Cookie', adminCookies)
          .send({ enabled: true } satisfies TUserUpdate)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.users.user(entity.id))
          .set('Cookie', adminCookies)
          .send({
            name: entity.name + entity.name,
          } satisfies TUserUpdate)
          .expect(HttpStatus.NO_CONTENT);

        entity.name = entity.name + entity.name;

        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.users.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getOneResBody).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.users.user(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update Roles', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.users.userRoles(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(ROUTES.users.userRoles(entity.id))
          .set('Cookie', adminCookies)
          .send({ test: true })
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.users.userRoles(wrongId))
          .set('Cookie', adminCookies)
          .send({ items: [] } satisfies IReqItems<IUsersRoles>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getListResBody = await request(app.getHttpServer())
          .get(ROUTES.roles._)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as TUserResList);

        const role = getListResBody.rows[1];

        await request(app.getHttpServer())
          .patch(ROUTES.users.userRoles(entity.id))
          .set('Cookie', adminCookies)
          .send({
            items: [{ roleId: role.id, userId: entity.id }],
          } satisfies IReqItems<IUsersRoles>)
          .expect(HttpStatus.NO_CONTENT);

        entity.name = entity.name + entity.name;

        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.users.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getOneResBody.roles).toBeDefined();
        expect(getOneResBody.roles).toHaveProperty('length', 1);
        expect(getOneResBody.roles![0]).toHaveProperty('id', role.id);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.users.userRoles(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.users._)
          .send({ items: [entity.id] } satisfies IReqItems<IUser['id']>)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .delete(ROUTES.users._)
          .set('Cookie', adminCookies)
          .send({ items: [wrongId] } satisfies IReqItems<IUser['id']>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.users._)
          .set('Cookie', adminCookies)
          .send({ items: [entity.id] } satisfies IReqItems<IUser['id']>)
          .expect(HttpStatus.NO_CONTENT);

        await request(app.getHttpServer())
          .get(ROUTES.users.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.users.user(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
};
