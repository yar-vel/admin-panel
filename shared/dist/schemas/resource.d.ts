import { z } from 'zod';
import { IResource } from '../types/resource';
export declare const resourceSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    path: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enabled: z.ZodCoercedBoolean<unknown>;
    default: z.ZodCoercedBoolean<unknown>;
    rights: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const resourceReqListParamsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    default: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
export declare const resourceReqListSchema: z.ZodObject<{
    reqLimit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqCount: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    reqSortField: z.ZodType<keyof IResource | undefined, unknown, z.core.$ZodTypeInternals<keyof IResource | undefined, unknown>>;
    reqSortOrder: z.ZodOptional<z.ZodEnum<typeof import("..").ESortOrder>>;
    name: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    default: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=resource.d.ts.map