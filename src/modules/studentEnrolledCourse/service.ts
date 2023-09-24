/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import { Prisma, StudentEnrolledCourse, StudentEnrolledCourseStatus } from '@prisma/client';
import ApiError from 'errors/apiError';
import httpStatus from 'http-status';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    studentEnrolledCourseRelationalFields,
    studentEnrolledCourseRelationalFieldsMapper,
    studentEnrolledCourseSearchableFields,
} from './constant';
import { IStudentEnrolledCourseFilter } from './interface';

export const insertStudentEnrolledCourse = async (
    data: StudentEnrolledCourse
): Promise<StudentEnrolledCourse> => {
    const isCourseOngoingOrCompleted = await prisma.studentEnrolledCourse.findFirst({
        where: {
            OR: [
                {
                    status: StudentEnrolledCourseStatus.ONGOING,
                },

                {
                    status: StudentEnrolledCourseStatus.COMPLETED,
                },
            ],
        },
    });

    if (isCourseOngoingOrCompleted) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `There is already an ${isCourseOngoingOrCompleted.status?.toLowerCase()} registration`
        );
    }

    const result = await prisma.studentEnrolledCourse.create({
        data,
        include: {
            semester: true,
            student: true,
            course: true,
        },
    });

    return result;
};

export const findAllStudentEnrolledCourses = async (
    filters: IStudentEnrolledCourseFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourse[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    if (!filterData.semesterId) {
        const currentAcademicSemester = await prisma.semester.findFirst({
            where: {
                isCurrent: true,
            },
        });

        if (currentAcademicSemester) {
            filterData.semesterId = currentAcademicSemester.id;
        }
    }

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: studentEnrolledCourseSearchableFields.map((field) => ({
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
                if (studentEnrolledCourseRelationalFields.includes(key)) {
                    return {
                        [studentEnrolledCourseRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.StudentEnrolledCourseWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.studentEnrolledCourse.findMany({
        include: {
            semester: true,
            student: true,
            course: true,
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

    const total = await prisma.studentEnrolledCourse.count({
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

export const findStudentEnrolledCourse = async (
    id: string
): Promise<StudentEnrolledCourse | null> => {
    const result = await prisma.studentEnrolledCourse.findUnique({
        where: {
            id,
        },
        include: {
            semester: true,
            student: true,
            course: true,
        },
    });

    return result;
};

export const editStudentEnrolledCourse = async (
    id: string,
    payload: Partial<StudentEnrolledCourse>
): Promise<StudentEnrolledCourse> => {
    const result = await prisma.studentEnrolledCourse.update({
        where: {
            id,
        },
        data: payload,
        include: {
            semester: true,
            student: true,
            course: true,
        },
    });

    return result;
};

export const removeStudentEnrolledCourse = async (id: string): Promise<StudentEnrolledCourse> => {
    const result = await prisma.studentEnrolledCourse.delete({
        where: {
            id,
        },
        include: {
            semester: true,
            student: true,
            course: true,
        },
    });

    return result;
};
