/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { Department, Prisma } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    departmentRelationalFields,
    departmentRelationalFieldsMapper,
    departmentSearchableFields,
} from './constant';
import { IDepartmentFilter } from './interface';

export const insertDepartment = async (data: Department): Promise<Department> => {
    const result = await prisma.department.create({
        data,
        include: {
            academicFaculty: true,
        },
    });

    return result;
};

export const findAllDepartments = async (
    filters: IDepartmentFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<Department[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: departmentSearchableFields.map((field) => ({
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
                if (departmentRelationalFields.includes(key)) {
                    return {
                        [departmentRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.DepartmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.department.findMany({
        include: {
            academicFaculty: true,
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

    const total = await prisma.department.count({
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

export const findDepartment = async (id: string): Promise<Department | null> => {
    const result = await prisma.department.findUnique({
        where: { id },
        include: {
            academicFaculty: true,
        },
    });

    return result;
};
