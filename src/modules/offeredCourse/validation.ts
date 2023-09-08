/* eslint-disable comma-dangle */
import z from 'zod';

export const offeredCourseValidation = z.object({
    body: z.object({
        departmentId: z.string({
            required_error: 'Department Id is required',
        }),
        semesterRegistrationId: z.string({
            required_error: 'Semester Reg. is required',
        }),
        courseIds: z.array(
            z.string({
                required_error: 'Course Id is required',
            }),
            {
                required_error: 'Course Ids are required',
            }
        ),
    }),
});

export const updateOfferedCourseValidation = z.object({
    body: z.object({
        courseId: z.string().optional(),
        departmentId: z.string().optional(),
        semesterRegistrationId: z.string().optional(),
    }),
});
