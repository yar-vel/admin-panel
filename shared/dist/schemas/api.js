"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReqListSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
const libs_1 = require("../libs");
const getReqListSchema = () => zod_1.z.object({
    reqLimit: zod_1.z.coerce
        .number()
        .min(1)
        .max(libs_1.REQ_LIST_MAX_LIMIT)
        .default(libs_1.REQ_LIST_DEFAULT_LIMIT),
    reqPage: zod_1.z.coerce.number().min(1).default(libs_1.REQ_LIST_DEFAULT_PAGE),
    reqCount: zod_1.z.coerce.boolean().optional(),
    reqSortField: zod_1.z.string().optional(),
    reqSortOrder: zod_1.z.enum(types_1.ESortOrder).optional(),
});
exports.getReqListSchema = getReqListSchema;
//# sourceMappingURL=api.js.map