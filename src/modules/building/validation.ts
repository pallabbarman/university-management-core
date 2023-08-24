import z from 'zod';

export const buildingValidation = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required!',
        }),
    }),
});

export const updateBuildingValidation = z.object({
    body: z.object({
        title: z.string().optional(),
    }),
});
