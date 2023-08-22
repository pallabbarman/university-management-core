/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
import { Prisma, Semester } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import { semesterSearchAbleFields } from './constant';
import { ISemesterFilters } from './interface';

export const insertSemester = async (data: Semester): Promise<Semester> => {
    const result = await prisma.semester.create({
        data,
    });

    return result;
};

export const findAllSemesters = async (
    filters: ISemesterFilters,
    options: IPaginationOptions
): Promise<IGenericResponse<Semester[]>> => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: semesterSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.SemesterWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.semester.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy:
            sortBy && sortOrder
                ? {
                      [sortBy]: sortOrder,
                  }
                : {
                      createdAt: 'desc',
                  },
    });

    const total = await prisma.semester.count();

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

export const findSemester = async (id: string): Promise<Semester | null> => {
    const result = await prisma.semester.findUnique({
        where: {
            id,
        },
    });

    return result;
};
