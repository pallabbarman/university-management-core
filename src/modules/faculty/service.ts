/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import { Faculty, Prisma } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    facultyRelationalFields,
    facultyRelationalFieldsMapper,
    facultySearchableFields,
} from './constant';
import { IFacultyFilters } from './interface';

export const insertFaculty = async (data: Faculty): Promise<Faculty> => {
    const result = await prisma.faculty.create({
        data,
        include: {
            academicFaculty: true,
            department: true,
        },
    });

    return result;
};

export const findAllFaculties = async (
    filters: IFacultyFilters,
    options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: facultySearchableFields.map((field) => ({
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
                if (facultyRelationalFields.includes(key)) {
                    return {
                        [facultyRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.FacultyWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.faculty.findMany({
        include: {
            academicFaculty: true,
            department: true,
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

    const total = await prisma.faculty.count({
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

export const findFaculty = async (id: string): Promise<Faculty | null> => {
    const result = await prisma.faculty.findUnique({
        where: {
            id,
        },
        include: {
            academicFaculty: true,
            department: true,
        },
    });

    return result;
};
