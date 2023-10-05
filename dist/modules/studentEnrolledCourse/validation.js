"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentEnrolledCourseValidation = exports.studentEnrolledCourseValidation = void 0;
const zod_1 = require("zod");
exports.studentEnrolledCourseValidation = zod_1.z.object({
    body: zod_1.z.object({
        semesterId: zod_1.z.string({
            required_error: 'Academic semester id is required',
        }),
        studentId: zod_1.z.string({
            required_error: 'Student id is required',
        }),
        courseId: zod_1.z.string({
            required_error: 'Course id is required',
        }),
    }),
});
exports.updateStudentEnrolledCourseValidation = zod_1.z.object({
    body: zod_1.z.object({
        semesterId: zod_1.z.string().optional(),
        studentId: zod_1.z.string().optional(),
        courseId: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        grade: zod_1.z.string().optional(),
        point: zod_1.z.number().optional(),
        marks: zod_1.z.number().optional(),
    }),
});
