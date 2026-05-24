import { z } from 'zod';

import { IUser, TUserReqListParams, TUserReqList } from './types';
import { getReqListSchema } from '../api';

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email().nullable().optional(),
  password: z.string().min(10).max(100).nullable().optional(),
  name: z.string().min(1).max(100),
  googleId: z.string().nullable().optional(),
  enabled: z.coerce.boolean(),
  verified: z.coerce.boolean(),
  verificationCode: z.string().nullable().optional(),
  resetPasswordCode: z.string().nullable().optional(),
  changeEmailCode: z.string().nullable().optional(),
  temporaryEmail: z.email().nullable().optional(),
  roles: z.array(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<IUser>;

export const userReqListParamsSchema = userSchema
  .pick({
    email: true,
    name: true,
    enabled: true,
    verified: true,
  })
  .partial() satisfies z.ZodType<TUserReqListParams>;

export const userReqListSchema = getReqListSchema<IUser>().extend(
  userReqListParamsSchema.shape,
) satisfies z.ZodType<TUserReqList>;
