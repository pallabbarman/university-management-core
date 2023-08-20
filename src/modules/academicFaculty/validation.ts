/* eslint-disable import/prefer-default-export */
import z from 'zod';

export const academicFacultyValidation = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required!',
        }),
    }),
});
