"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferedCourseValidation = exports.offeredCourseValidation = void 0;
/* eslint-disable comma-dangle */
const zod_1 = __importDefault(require("zod"));
exports.offeredCourseValidation = zod_1.default.object({
    body: zod_1.default.object({
        departmentId: zod_1.default.string({
            required_error: 'Department Id is required',
        }),
        semesterRegistrationId: zod_1.default.string({
            required_error: 'Semester Reg. is required',
        }),
        courseIds: zod_1.default.array(zod_1.default.string({
            required_error: 'Course Id is required',
        }), {
            required_error: 'Course Ids are required',
        }),
    }),
});
exports.updateOfferedCourseValidation = zod_1.default.object({
    body: zod_1.default.object({
        courseId: zod_1.default.string().optional(),
        departmentId: zod_1.default.string().optional(),
        semesterRegistrationId: zod_1.default.string().optional(),
    }),
});
