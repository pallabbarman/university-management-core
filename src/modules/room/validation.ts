import z from 'zod';

export const roomValidation = z.object({
    body: z.object({
        roomNumber: z.string({
            required_error: 'Room number is required!',
        }),
        floor: z.string({
            required_error: 'Floor is required!',
        }),
        buildingId: z.string({
            required_error: 'Building id is required!',
        }),
    }),
});

export const updateRoomValidation = z.object({
    body: z.object({
        roomNumber: z.string().optional(),
        floor: z.string().optional(),
        buildingId: z.string().optional(),
    }),
});
