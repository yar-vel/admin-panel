import { z } from 'zod';

import { getReqListSchema } from '../api';
import { IResource, TResourceReqList, TResourceReqListParams } from './types';

export const resourceSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  path: z.string().min(1).max(100),
  description: z.string().max(1000).nullable().optional(),
  enabled: z.coerce.boolean(),
  default: z.coerce.boolean(),
  rights: z.array(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<IResource>;

export const resourceReqListParamsSchema = resourceSchema
  .pick({
    name: true,
    path: true,
    enabled: true,
    default: true,
  })
  .partial() satisfies z.ZodType<TResourceReqListParams>;

export const resourceReqListSchema = getReqListSchema<IResource>().extend(
  resourceReqListParamsSchema.shape,
) satisfies z.ZodType<TResourceReqList>;
