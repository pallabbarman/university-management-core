/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import { OfferedCourseClassSchedule, OfferedCourseSection, Prisma } from '@prisma/client';
import ApiError from 'errors/apiError';
import httpStatus from 'http-status';
import {
    checkFacultyAvailable,
    checkRoomAvailable,
} from 'modules/offeredCourseClassSchedule/utils';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import { asyncForEach } from 'utils/asyncForEach';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    offeredCourseSectionRelationalFields,
    offeredCourseSectionRelationalFieldsMapper,
    offeredCourseSectionSearchableFields,
} from './constant';
import {
    IClassSchedule,
    IOfferedCourseSectionCreate,
    IOfferedCourseSectionFilter,
} from './interface';

export const insertOfferedCourseSection = async (
    payload: IOfferedCourseSectionCreate
): Promise<OfferedCourseSection | null> => {
    const { classSchedules, ...data } = payload;

    const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
        where: {
            id: data.offeredCourseId,
        },
    });

    if (!isExistOfferedCourse) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course does not exist!');
    }

    await asyncForEach(classSchedules, async (schedule: OfferedCourseClassSchedule) => {
        await checkRoomAvailable(schedule);
        await checkFacultyAvailable(schedule);
    });

    const offerCourseSectionData = await prisma.offeredCourseSection.findFirst({
        where: {
            offeredCourse: {
                id: data.offeredCourseId,
            },
            title: data.title,
        },
    });

    if (offerCourseSectionData) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Course Section already exists');
    }

    const createSection = await prisma.$transaction(async (transactionClient) => {
        const createOfferedCourseSection = await transactionClient.offeredCourseSection.create({
            data: {
                title: data.title,
                maxCapacity: data.maxCapacity,
                offeredCourseId: data.offeredCourseId,
                semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
            },
        });

        const scheduleData = classSchedules.map((schedule: IClassSchedule) => ({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            dayOfWeek: schedule.dayOfWeek,
            roomId: schedule.roomId,
            facultyId: schedule.facultyId,
            offeredCourseSectionId: createOfferedCourseSection.id,
            semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
        }));

        await transactionClient.offeredCourseClassSchedule.createMany({
            data: scheduleData,
        });

        return createOfferedCourseSection;
    });

    const result = await prisma.offeredCourseSection.findFirst({
        where: {
            id: createSection.id,
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
            offeredCourseClassSchedules: {
                include: {
                    room: {
                        include: {
                            building: true,
                        },
                    },
                    faculty: true,
                },
            },
        },
    });

    return result;
};

export const findAllOfferedCourseSections = async (
    filters: IOfferedCourseSectionFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: offeredCourseSectionSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (offeredCourseSectionRelationalFields.includes(key)) {
                    return {
                        [offeredCourseSectionRelationalFieldsMapper[key]]: {
                            id: (filterData as any)[key],
                        },
                    };
                }
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.OfferedCourseSectionWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.offeredCourseSection.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            sortBy && sortOrder
                ? { [sortBy]: sortOrder }
                : {
                      createdAt: 'desc',
                  },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
        },
    });

    const total = await prisma.offeredCourseSection.count({
        where: whereConditions,
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

export const findOfferedCourseSection = async (
    id: string
): Promise<OfferedCourseSection | null> => {
    const result = await prisma.offeredCourseSection.findUnique({
        where: {
            id,
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
        },
    });

    return result;
};

export const editOfferedCourseSection = async (
    id: string,
    payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
    const result = await prisma.offeredCourseSection.update({
        where: {
            id,
        },
        data: payload,
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
        },
    });

    return result;
};

export const removeOfferedCourseSection = async (id: string): Promise<OfferedCourseSection> => {
    const result = await prisma.offeredCourseSection.delete({
        where: {
            id,
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
        },
    });

    return result;
};
