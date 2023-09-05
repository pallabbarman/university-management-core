import { SemesterRegistrationStatus } from '@prisma/client';
import z from 'zod';

export const semesterRegistrationValidation = z.object({
    body: z.object({
        startDate: z.string({
            required_error: 'Start date is required',
        }),
        endDate: z.string({
            required_error: 'End date is required',
        }),
        semesterId: z.string({
            required_error: 'Semester id is required',
        }),
        minCredit: z.number({
            required_error: 'Min credit is required',
        }),
        maxCredit: z.number({
            required_error: 'Max credit is required',
        }),
    }),
});

export const updateSemesterRegistrationValidation = z.object({
    body: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        semesterId: z.string().optional(),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
        status: z
            .enum([...Object.values(SemesterRegistrationStatus)] as [string, ...string[]], {})
            .optional(),
    }),
});
