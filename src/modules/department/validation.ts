import z from 'zod';

export const departmentValidation = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required!',
        }),
        academicFacultyId: z.string({
            required_error: 'Academic faculty id is required!',
        }),
    }),
});

export const updateDepartmentValidation = z.object({
    body: z.object({
        title: z.string().optional(),
        academicFacultyId: z.string().optional(),
    }),
});
