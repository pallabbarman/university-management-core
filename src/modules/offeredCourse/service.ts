/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
import { OfferedCourse, Prisma } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import { asyncForEach } from 'utils/asyncForEach';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    offeredCourseRelationalFields,
    offeredCourseRelationalFieldsMapper,
    offeredCourseSearchableFields,
} from './constant';
import { ICreateOfferedCourse, IOfferedCourseFilter } from './interface';

export const insertOfferedCourse = async (data: ICreateOfferedCourse): Promise<OfferedCourse[]> => {
    const { courseIds, departmentId, semesterRegistrationId } = data;
    const result: OfferedCourse[] = [];

    await asyncForEach(courseIds, async (courseId: string) => {
        const isAlreadyExist = await prisma.offeredCourse.findFirst({
            where: {
                courseId,
                departmentId,
                semesterRegistrationId,
            },
        });

        if (!isAlreadyExist) {
            const addOfferedCourse = await prisma.offeredCourse.create({
                data: {
                    courseId,
                    departmentId,
                    semesterRegistrationId,
                },
                include: {
                    course: true,
                    department: true,
                    semesterRegistration: true,
                },
            });

            result.push(addOfferedCourse);
        }
    });

    return result;
};

export const findAllOfferedCourses = async (
    filters: IOfferedCourseFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: offeredCourseSearchableFields.map((field) => ({
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
                if (offeredCourseRelationalFields.includes(key)) {
                    return {
                        [offeredCourseRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.OfferedCourseWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.offeredCourse.findMany({
        include: {
            course: true,
            department: true,
            semesterRegistration: true,
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
    const total = await prisma.offeredCourse.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

export const findOfferedCourse = async (id: string): Promise<OfferedCourse | null> => {
    const result = await prisma.offeredCourse.findUnique({
        where: {
            id,
        },
        include: {
            course: true,
            department: true,
            semesterRegistration: true,
        },
    });

    return result;
};

export const editOfferedCourse = async (
    id: string,
    payload: Partial<OfferedCourse>
): Promise<OfferedCourse> => {
    const result = await prisma.offeredCourse.update({
        where: {
            id,
        },
        data: payload,
        include: {
            course: true,
            department: true,
            semesterRegistration: true,
        },
    });

    return result;
};

export const removeOfferedCourse = async (id: string): Promise<OfferedCourse> => {
    const result = await prisma.offeredCourse.delete({
        where: {
            id,
        },
        include: {
            course: true,
            department: true,
            semesterRegistration: true,
        },
    });

    return result;
};
