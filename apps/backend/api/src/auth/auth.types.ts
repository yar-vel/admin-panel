import { FastifyRequest } from 'fastify';

import { IUser } from '@ap/shared/dist/types';

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  userId: string;
  sessionId: string;
  sign?: string;
}

export interface IRequestUser extends IUser {
  sessionId: string;
}

export interface IFastifyRequestWithUser extends FastifyRequest {
  user: IRequestUser;
}
