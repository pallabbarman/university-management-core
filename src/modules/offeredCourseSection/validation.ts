import z from 'zod';

export const offeredCourseSectionValidation = z.object({
    body: z.object({
        offeredCourseId: z.string({
            required_error: 'Offered course id is required',
        }),
        maxCapacity: z.number({
            required_error: 'Max capacity is required',
        }),
        title: z.string({
            required_error: 'Title is required',
        }),
    }),
});

export const updateOfferedCourseSectionValidation = z.object({
    body: z.object({
        maxCapacity: z.number().optional(),
        title: z.string().optional(),
    }),
});
