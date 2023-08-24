/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import { Building, Prisma } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import { buildingSearchableFields } from './constant';
import { IBuilding } from './interface';

export const insertBuilding = async (data: Building): Promise<Building> => {
    const result = await prisma.building.create({
        data,
    });

    return result;
};

export const findAllBuildings = async (
    filters: IBuilding,
    options: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: buildingSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    const whereConditions: Prisma.BuildingWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.building.findMany({
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

    const total = await prisma.building.count({
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

export const findBuilding = async (id: string): Promise<Building | null> => {
    const result = await prisma.building.findUnique({
        where: { id },
    });

    return result;
};

export const editBuilding = async (id: string, payload: Partial<Building>): Promise<Building> => {
    const result = await prisma.building.update({
        where: {
            id,
        },
        data: payload,
    });

    return result;
};

export const removeBuilding = async (id: string): Promise<Building> => {
    const result = await prisma.building.delete({
        where: {
            id,
        },
    });

    return result;
};
