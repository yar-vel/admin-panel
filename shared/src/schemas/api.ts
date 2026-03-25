import { z } from 'zod';

import { ESortOrder, IReqList } from '../types';
import {
  REQ_LIST_DEFAULT_LIMIT,
  REQ_LIST_DEFAULT_PAGE,
  REQ_LIST_MAX_LIMIT,
} from '../libs';

export const getReqListSchema = <T extends object>() =>
  z.object({
    reqLimit: z.coerce
      .number()
      .min(1)
      .max(REQ_LIST_MAX_LIMIT)
      .default(REQ_LIST_DEFAULT_LIMIT),
    reqPage: z.coerce.number().min(1).default(REQ_LIST_DEFAULT_PAGE),
    reqCount: z.coerce.boolean().optional(),
    reqSortField: z.string().optional() as z.ZodType<keyof T | undefined>,
    reqSortOrder: z.enum(ESortOrder).optional(),
  }) satisfies z.ZodType<IReqList<T>>;
