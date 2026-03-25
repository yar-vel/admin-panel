import { z } from 'zod';
import { IUser } from '../types/user';
export declare const userSchema: z.ZodObject<{
    id: z.ZodUUID;
    email: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    password: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    googleId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enabled: z.ZodCoercedBoolean<unknown>;
    verified: z.ZodCoercedBoolean<unknown>;
    verificationCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resetPasswordCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    changeEmailCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    temporaryEmail: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const userReqListParamsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEmail>>>;
    verified: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
export declare const userReqListSchema: z.ZodObject<{
    reqLimit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    reqCount: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    reqSortField: z.ZodType<keyof IUser | undefined, unknown, z.core.$ZodTypeInternals<keyof IUser | undefined, unknown>>;
    reqSortOrder: z.ZodOptional<z.ZodEnum<typeof import("..").ESortOrder>>;
    name: z.ZodOptional<z.ZodString>;
    enabled: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEmail>>>;
    verified: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=user.d.ts.map