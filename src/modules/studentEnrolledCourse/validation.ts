import { z } from 'zod';

export const studentEnrolledCourseValidation = z.object({
    body: z.object({
        semesterId: z.string({
            required_error: 'Academic semester id is required',
        }),
        studentId: z.string({
            required_error: 'Student id is required',
        }),
        courseId: z.string({
            required_error: 'Course id is required',
        }),
    }),
});

export const updateStudentEnrolledCourseValidation = z.object({
    body: z.object({
        semesterId: z.string().optional(),
        studentId: z.string().optional(),
        courseId: z.string().optional(),
        status: z.string().optional(),
        grade: z.string().optional(),
        point: z.number().optional(),
        marks: z.number().optional(),
    }),
});
