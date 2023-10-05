"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentCourseFinalMarksValidation = exports.updateStudentMarksValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.updateStudentMarksValidation = zod_1.z.object({
    body: zod_1.z.object({
        semesterId: zod_1.z.string({
            required_error: 'Semester id is required',
        }),
        studentId: zod_1.z.string({
            required_error: 'Student id is required',
        }),
        courseId: zod_1.z.string({
            required_error: 'Course id is required',
        }),
        examType: zod_1.z.enum([...Object.values(client_1.ExamType)], {}),
        marks: zod_1.z
            .number({
            required_error: 'Marks is required',
        })
            .max(100)
            .min(0),
    }),
});
exports.updateStudentCourseFinalMarksValidation = zod_1.z.object({
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
