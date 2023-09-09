"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferedCourseSectionValidation = exports.offeredCourseSectionValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.offeredCourseSectionValidation = zod_1.default.object({
    body: zod_1.default.object({
        offeredCourseId: zod_1.default.string({
            required_error: 'Offered course id is required',
        }),
        maxCapacity: zod_1.default.number({
            required_error: 'Max capacity is required',
        }),
        title: zod_1.default.string({
            required_error: 'Title is required',
        }),
    }),
});
exports.updateOfferedCourseSectionValidation = zod_1.default.object({
    body: zod_1.default.object({
        maxCapacity: zod_1.default.number().optional(),
        title: zod_1.default.string().optional(),
    }),
});
