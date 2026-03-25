"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleReqListSchema = exports.roleReqListParamsSchema = exports.roleSchema = void 0;
const zod_1 = require("zod");
const api_1 = require("./api");
exports.roleSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(1000).nullable().optional(),
    enabled: zod_1.z.coerce.boolean(),
    admin: zod_1.z.coerce.boolean(),
    default: zod_1.z.coerce.boolean(),
    users: zod_1.z.array(zod_1.z.any()).optional(),
    rights: zod_1.z.array(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.roleReqListParamsSchema = exports.roleSchema
    .pick({
    name: true,
    enabled: true,
    default: true,
    admin: true,
})
    .partial();
exports.roleReqListSchema = (0, api_1.getReqListSchema)().extend(exports.roleReqListParamsSchema.shape);
//# sourceMappingURL=role.js.map