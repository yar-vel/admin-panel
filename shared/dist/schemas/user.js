"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userReqListSchema = exports.userReqListParamsSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
const api_1 = require("./api");
exports.userSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    email: zod_1.z.email().nullable().optional(),
    password: zod_1.z.string().min(10).max(100).nullable().optional(),
    name: zod_1.z.string().min(1).max(100),
    googleId: zod_1.z.string().nullable().optional(),
    enabled: zod_1.z.coerce.boolean(),
    verified: zod_1.z.coerce.boolean(),
    verificationCode: zod_1.z.string().nullable().optional(),
    resetPasswordCode: zod_1.z.string().nullable().optional(),
    changeEmailCode: zod_1.z.string().nullable().optional(),
    temporaryEmail: zod_1.z.email().nullable().optional(),
    roles: zod_1.z.array(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.userReqListParamsSchema = exports.userSchema
    .pick({
    email: true,
    name: true,
    enabled: true,
    verified: true,
})
    .partial();
exports.userReqListSchema = (0, api_1.getReqListSchema)().extend(exports.userReqListParamsSchema.shape);
//# sourceMappingURL=user.js.map