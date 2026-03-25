import { z } from 'zod';
import { ESortOrder } from '../types';
export declare const getReqListSchema: <T extends object>() => z.ZodObject<{
    reqLimit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqCount: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    reqSortField: z.ZodType<keyof T | undefined>;
    reqSortOrder: z.ZodOptional<z.ZodEnum<typeof ESortOrder>>;
}, z.core.$strip>;
//# sourceMappingURL=api.d.ts.map