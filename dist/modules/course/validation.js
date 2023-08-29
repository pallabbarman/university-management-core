"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultiesValidation = exports.updateCourseValidation = exports.courseValidation = void 0;
/* eslint-disable comma-dangle */
const zod_1 = __importDefault(require("zod"));
exports.courseValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string({
            required_error: 'Title is required!',
        }),
        code: zod_1.default.string({
            required_error: 'Code is required',
        }),
        credits: zod_1.default.number({
            required_error: 'Credits is required',
        }),
        preRequisiteCourses: zod_1.default
            .array(zod_1.default.object({
            courseId: zod_1.default.string({}),
        }))
            .optional(),
    }),
});
exports.updateCourseValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().optional(),
        code: zod_1.default.string().optional(),
        credits: zod_1.default.number().optional(),
        preRequisiteCourses: zod_1.default
            .array(zod_1.default.object({
            courseId: zod_1.default.string({}),
            isDeleted: zod_1.default.boolean({}).optional(),
        }))
            .optional(),
    }),
});
exports.facultiesValidation = zod_1.default.object({
    body: zod_1.default.object({
        faculties: zod_1.default.array(zod_1.default.string(), {
            required_error: 'Faculties are required',
        }),
    }),
});
