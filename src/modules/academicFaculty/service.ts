/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable import/prefer-default-export */
import { AcademicFaculty, Prisma } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import { academicFacultySearchableFields } from './constant';
import { IAcademicFaculty } from './interface';

export const insertAcademicFaculty = async (data: AcademicFaculty): Promise<AcademicFaculty> => {
    const result = await prisma.academicFaculty.create({
        data,
    });

    return result;
};

export const findAllAcademicFaculties = async (
    filters: IAcademicFaculty,
    options: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: academicFacultySearchableFields.map((field) => ({
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

    const whereConditions: Prisma.AcademicFacultyWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.academicFaculty.findMany({
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

    const total = await prisma.academicFaculty.count({
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

export const findAcademicFaculty = async (id: string): Promise<AcademicFaculty | null> => {
    const result = await prisma.academicFaculty.findUnique({
        where: { id },
    });

    return result;
};

export const editAcademicFaculty = async (
    id: string,
    payload: Partial<AcademicFaculty>
): Promise<AcademicFaculty> => {
    const result = await prisma.academicFaculty.update({
        where: {
            id,
        },
        data: payload,
    });

    return result;
};

export const removeAcademicFaculty = async (id: string): Promise<AcademicFaculty> => {
    const result = await prisma.academicFaculty.delete({
        where: {
            id,
        },
    });

    return result;
};
