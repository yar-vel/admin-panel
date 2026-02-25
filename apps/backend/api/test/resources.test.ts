import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, userCookies, wrongId } from './app.setup';
import {
  IReqItems,
  IResource,
  TResourceCreate,
  TResourceReqList,
  TResourceResList,
  TResourceUpdate,
} from '@ap/shared/dist/types';
import { API_ROUTES, buildRoutes } from '@ap/shared/dist/libs';

const ROUTES = buildRoutes(API_ROUTES);

export const runResourcesTests = () => {
  describe('Resources', () => {
    let entity: IResource;

    describe('Create', () => {
      const createEntity: TResourceCreate = {
        name: 'Test',
        path: 'test',
        description: 'Test entity',
        enabled: true,
      };

      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post(ROUTES.resources._)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post(ROUTES.resources._)
          .set('Cookie', adminCookies)
          .send({})
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createResBody = await request(app.getHttpServer())
          .post(ROUTES.resources._)
          .set('Cookie', adminCookies)
          .send(createEntity)
          .expect(HttpStatus.CREATED)
          .then((res) => res.body as IResource);

        expect(createResBody).toHaveProperty('id');
        expect(createResBody).toHaveProperty('name', createResBody.name);
        expect(createResBody).toHaveProperty('path', createEntity.path);
        expect(createResBody).toHaveProperty(
          'description',
          createEntity.description,
        );
        expect(createResBody).toHaveProperty('enabled', createEntity.enabled);
        expect(createResBody).toHaveProperty('default', false);

        entity = createResBody;
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post(ROUTES.resources._)
          .set('Cookie', userCookies)
          .send(createEntity)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get List', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.resources._)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        let getListResBody = await request(app.getHttpServer())
          .get(ROUTES.resources._)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TResourceReqList)
          .expect(HttpStatus.OK)
          .then((res) => res.body as TResourceResList);

        expect(getListResBody).toHaveProperty('meta');
        expect(getListResBody.meta).toHaveProperty('total', 5);
        expect(getListResBody.meta).toHaveProperty('page', 1);
        expect(getListResBody.meta).toHaveProperty('limit', 1);

        getListResBody = await request(app.getHttpServer())
          .get(ROUTES.resources._)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            path: 'te',
          } satisfies TResourceReqList)
          .expect(HttpStatus.OK)
          .then((res) => res.body as TResourceResList);

        expect(getListResBody.rows).toHaveProperty('length', 1);
        expect(getListResBody.rows[0]).toHaveProperty('path', entity.path);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.resources._)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get One', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.resources.resource(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .get(ROUTES.resources.resource(wrongId))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.resources.resource(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IResource);

        expect(getOneResBody).toHaveProperty('id', entity.id);
        expect(getOneResBody).toHaveProperty('name', entity.name);
        expect(getOneResBody).toHaveProperty('path', entity.path);
        expect(getOneResBody).toHaveProperty('description', entity.description);
        expect(getOneResBody).toHaveProperty('enabled', entity.enabled);
        expect(getOneResBody).toHaveProperty('default', entity.default);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.resources.resource(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.resources.resource(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(ROUTES.resources.resource(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.resources.resource(entity.id))
          .set('Cookie', adminCookies)
          .send({ test: true })
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.resources.resource(wrongId))
          .set('Cookie', adminCookies)
          .send({ enabled: true } satisfies TResourceUpdate)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.resources.resource(entity.id))
          .set('Cookie', adminCookies)
          .send({
            name: entity.name + entity.name,
          } satisfies TResourceUpdate)
          .expect(HttpStatus.NO_CONTENT);

        entity.name = entity.name + entity.name;

        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.resources.resource(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IResource);

        expect(getOneResBody).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.resources.resource(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.resources._)
          .send({ items: [entity.id] } satisfies IReqItems<IResource['id']>)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .delete(ROUTES.resources._)
          .set('Cookie', adminCookies)
          .send({ items: [wrongId] } satisfies IReqItems<IResource['id']>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.resources._)
          .set('Cookie', adminCookies)
          .send({ items: [entity.id] } satisfies IReqItems<IResource['id']>)
          .expect(HttpStatus.NO_CONTENT);

        await request(app.getHttpServer())
          .get(ROUTES.resources.resource(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.resources.resource(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
};
