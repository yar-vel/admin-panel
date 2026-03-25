"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceReqListSchema = exports.resourceReqListParamsSchema = exports.resourceSchema = void 0;
const zod_1 = require("zod");
const api_1 = require("./api");
exports.resourceSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    name: zod_1.z.string().min(1).max(100),
    path: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(1000).nullable().optional(),
    enabled: zod_1.z.coerce.boolean(),
    default: zod_1.z.coerce.boolean(),
    rights: zod_1.z.array(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.resourceReqListParamsSchema = exports.resourceSchema
    .pick({
    name: true,
    path: true,
    enabled: true,
    default: true,
})
    .partial();
exports.resourceReqListSchema = (0, api_1.getReqListSchema)().extend(exports.resourceReqListParamsSchema.shape);
//# sourceMappingURL=resource.js.map