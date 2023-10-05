import { OfferedCourseClassSchedule } from '@prisma/client';
import ApiError from 'errors/apiError';
import httpStatus from 'http-status';
import { hasTimeConflict } from 'utils/hasTimeConflict';
import prisma from 'utils/prisma';

export const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
    const alreadyBookedRoomOnDay = await prisma.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            room: {
                id: data.roomId,
            },
        },
    });

    const existingSlots = alreadyBookedRoomOnDay.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek,
    }));

    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek,
    };

    if (hasTimeConflict(existingSlots, newSlot)) {
        throw new ApiError(httpStatus.CONFLICT, 'Room is already booked!');
    }
};

export const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
    const alreadyFaultyAssigned = await prisma.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            faculty: {
                id: data.facultyId,
            },
        },
    });

    const existingSlots = alreadyFaultyAssigned.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek,
    }));

    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek,
    };

    if (hasTimeConflict(existingSlots, newSlot)) {
        throw new ApiError(httpStatus.CONFLICT, 'Faculty is already booked!');
    }
};
