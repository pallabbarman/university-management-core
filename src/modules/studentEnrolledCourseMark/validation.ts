import { ExamType } from '@prisma/client';
import { z } from 'zod';

export const updateStudentMarksValidation = z.object({
    body: z.object({
        semesterId: z.string({
            required_error: 'Semester id is required',
        }),
        studentId: z.string({
            required_error: 'Student id is required',
        }),
        courseId: z.string({
            required_error: 'Course id is required',
        }),
        examType: z.enum([...Object.values(ExamType)] as [string, ...string[]], {}),
        marks: z
            .number({
                required_error: 'Marks is required',
            })
            .max(100)
            .min(0),
    }),
});

export const updateStudentCourseFinalMarksValidation = z.object({
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
