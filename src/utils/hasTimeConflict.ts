/* eslint-disable comma-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import { WeekDays } from '@prisma/client';

export const hasTimeConflict = (
    existingSlots: {
        startTime: string;
        endTime: string;
        dayOfWeek: WeekDays;
    }[],
    newSlot: {
        startTime: string;
        endTime: string;
        dayOfWeek: WeekDays;
    }
) => {
    for (const slot of existingSlots) {
        const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
        const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
        const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
        const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);

        if (newStart < existingEnd && newEnd > existingStart) {
            return true;
        }
    }

    return false;
};
