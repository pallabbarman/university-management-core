/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import { Prisma, Room } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import { roomRelationalFields, roomRelationalFieldsMapper, roomSearchableFields } from './constant';
import { IRoomFilter } from './interface';

export const insertRoom = async (data: Room): Promise<Room> => {
    const result = await prisma.room.create({
        data,
        include: {
            building: true,
        },
    });

    return result;
};

export const findAllRooms = async (
    filters: IRoomFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: roomSearchableFields.map((field) => ({
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
                if (roomRelationalFields.includes(key)) {
                    return {
                        [roomRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.RoomWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.room.findMany({
        include: {
            building: true,
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

    const total = await prisma.room.count({
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

export const findRoom = async (id: string): Promise<Room | null> => {
    const result = await prisma.room.findUnique({
        where: {
            id,
        },
        include: {
            building: true,
        },
    });

    return result;
};

export const editRoom = async (id: string, payload: Partial<Room>): Promise<Room> => {
    const result = await prisma.room.update({
        where: {
            id,
        },
        data: payload,
        include: {
            building: true,
        },
    });

    return result;
};

export const removeRoom = async (id: string): Promise<Room> => {
    const result = await prisma.room.delete({
        where: {
            id,
        },
    });

    return result;
};
