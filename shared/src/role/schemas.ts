import { z } from 'zod';

import { IRole, TRoleReqListParams, TRoleReqList } from './types';
import { getReqListSchema } from '../api';

export const roleSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(1000).nullable().optional(),
  enabled: z.coerce.boolean(),
  admin: z.coerce.boolean(),
  default: z.coerce.boolean(),
  users: z.array(z.any()).optional(),
  rights: z.array(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<IRole>;

export const roleReqListParamsSchema = roleSchema
  .pick({
    name: true,
    enabled: true,
    default: true,
    admin: true,
  })
  .partial() satisfies z.ZodType<TRoleReqListParams>;

export const roleReqListSchema = getReqListSchema<IRole>().extend(
  roleReqListParamsSchema.shape,
) satisfies z.ZodType<TRoleReqList>;
