/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import { Prisma, PrismaClient, StudentSemesterPayment } from '@prisma/client';
import { DefaultArgs, PrismaClientOptions } from '@prisma/client/runtime/library';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    studentSemesterPaymentRelationalFields,
    studentSemesterPaymentRelationalFieldsMapper,
    studentSemesterPaymentSearchableFields,
} from './constant';
import { IStudentSemesterPaymentFilter } from './interface';

export const insertSemesterPayment = async (
    prismaClient: Omit<
        PrismaClient<PrismaClientOptions, never, DefaultArgs>,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    payload: {
        studentId: string;
        semesterId: string;
        totalPaymentAmount: number;
    }
) => {
    const isExist = await prismaClient.studentSemesterPayment.findFirst({
        where: {
            student: {
                id: payload.studentId,
            },
            semester: {
                id: payload.semesterId,
            },
        },
    });

    if (!isExist) {
        const dataToInsert = {
            studentId: payload.studentId,
            semesterId: payload.semesterId,
            fullPaymentAmount: payload.totalPaymentAmount,
            partialPaymentAmount: payload.totalPaymentAmount * 0.5,
            totalDueAmount: payload.totalPaymentAmount,
            totalPaidAmount: 0,
        };

        await prismaClient.studentSemesterPayment.create({
            data: dataToInsert,
        });
    }
};

export const findAllStudentSemesterPayments = async (
    filters: IStudentSemesterPaymentFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<StudentSemesterPayment[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: studentSemesterPaymentSearchableFields.map((field) => ({
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
                if (studentSemesterPaymentRelationalFields.includes(key)) {
                    return {
                        [studentSemesterPaymentRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.StudentSemesterPaymentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.studentSemesterPayment.findMany({
        include: {
            semester: true,
            student: true,
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

    const total = await prisma.studentSemesterPayment.count({
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
