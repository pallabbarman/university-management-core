/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
import { OfferedCourseClassSchedule, Prisma } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    offeredCourseClassScheduleRelationalFields,
    offeredCourseClassScheduleRelationalFieldsMapper,
    offeredCourseClassScheduleSearchableFields,
} from './constant';
import { IOfferedCourseClassScheduleFilter } from './interface';
import { checkFacultyAvailable, checkRoomAvailable } from './utils';

export const insertOfferedCourseClassSchedule = async (
    data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
    await checkRoomAvailable(data);
    await checkFacultyAvailable(data);

    const result = await prisma.offeredCourseClassSchedule.create({
        data,
        include: {
            room: true,
            faculty: true,
            offeredCourseSection: true,
            semesterRegistration: true,
        },
    });

    return result;
};

export const findAllOfferedCourseClassSchedules = async (
    filters: IOfferedCourseClassScheduleFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: offeredCourseClassScheduleSearchableFields.map((field) => ({
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
                if (offeredCourseClassScheduleRelationalFields.includes(key)) {
                    return {
                        [offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.OfferedCourseClassScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.offeredCourseClassSchedule.findMany({
        include: {
            room: true,
            faculty: true,
            semesterRegistration: true,
            offeredCourseSection: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            sortBy && sortOrder
                ? { [sortBy]: sortOrder }
                : {
                      createdAt: 'desc',
                  },
    });

    const total = await prisma.offeredCourseClassSchedule.count({
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

export const findOfferedCourseClassSchedule = async (
    id: string
): Promise<OfferedCourseClassSchedule | null> => {
    const result = await prisma.offeredCourseClassSchedule.findUnique({
        where: {
            id,
        },
        include: {
            room: true,
            faculty: true,
            semesterRegistration: true,
            offeredCourseSection: true,
        },
    });

    return result;
};

export const editOfferedCourseClassSchedule = async (
    id: string,
    payload: Partial<OfferedCourseClassSchedule>
): Promise<OfferedCourseClassSchedule> => {
    const result = await prisma.offeredCourseClassSchedule.update({
        where: {
            id,
        },
        data: payload,
        include: {
            room: true,
            faculty: true,
            semesterRegistration: true,
            offeredCourseSection: true,
        },
    });

    return result;
};

export const removeOfferedCourseClassSchedule = async (
    id: string
): Promise<OfferedCourseClassSchedule> => {
    const result = await prisma.offeredCourseClassSchedule.delete({
        where: {
            id,
        },
        include: {
            room: true,
            faculty: true,
            semesterRegistration: true,
            offeredCourseSection: true,
        },
    });

    return result;
};
