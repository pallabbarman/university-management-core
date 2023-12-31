/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import { Course, CourseFaculty, Prisma } from '@prisma/client';
import ApiError from 'errors/apiError';
import httpStatus from 'http-status';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import { asyncForEach } from 'utils/asyncForEach';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import { courseSearchableFields } from './constant';
import { ICourseCreateData, ICourseFilter, IPrerequisiteCourseRequest } from './interface';

export const insertCourse = async (data: ICourseCreateData): Promise<Course | null> => {
    const { preRequisiteCourses, ...courseData } = data;

    const newCourse = await prisma.$transaction(async (transactionClient) => {
        const result = await transactionClient.course.create({
            data: courseData,
        });

        if (!result) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
        }

        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            await asyncForEach(
                preRequisiteCourses,
                async (preRequisiteCourse: IPrerequisiteCourseRequest) => {
                    await transactionClient.courseToPrerequisite.create({
                        data: {
                            courseId: result.id,
                            preRequisiteId: preRequisiteCourse.courseId,
                        },
                    });
                }
            );
        }
        return result;
    });

    if (newCourse) {
        const responseData = await prisma.course.findUnique({
            where: {
                id: newCourse.id,
            },
            include: {
                preRequisite: {
                    include: {
                        preRequisite: true,
                    },
                },
                preRequisiteFor: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        return responseData;
    }

    throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
};

export const findAllCourses = async (
    filters: ICourseFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: courseSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.CourseWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.course.findMany({
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
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

    const total = await prisma.course.count({
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

export const findCourse = async (id: string): Promise<Course | null> => {
    const result = await prisma.course.findUnique({
        where: { id },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    preRequisite: true,
                },
            },
        },
    });

    return result;
};

export const editCourse = async (
    id: string,
    payload: ICourseCreateData
): Promise<Course | null> => {
    const { preRequisiteCourses, ...courseData } = payload;

    await prisma.$transaction(async (transactionClient) => {
        const result = await transactionClient.course.update({
            where: {
                id,
            },
            data: courseData,
        });

        if (!result) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');
        }

        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletePrerequisite = preRequisiteCourses.filter(
                (coursePrerequisite) => coursePrerequisite.courseId && coursePrerequisite.isDeleted
            );

            const newPrerequisite = preRequisiteCourses.filter(
                (coursePrerequisite) => coursePrerequisite.courseId && !coursePrerequisite.isDeleted
            );

            await asyncForEach(
                deletePrerequisite,
                async (deletePreCourse: IPrerequisiteCourseRequest) => {
                    await transactionClient.courseToPrerequisite.deleteMany({
                        where: {
                            AND: [
                                {
                                    courseId: id,
                                },
                                {
                                    preRequisiteId: deletePreCourse.courseId,
                                },
                            ],
                        },
                    });
                }
            );

            await asyncForEach(
                newPrerequisite,
                async (insertPrerequisite: IPrerequisiteCourseRequest) => {
                    await transactionClient.courseToPrerequisite.create({
                        data: {
                            courseId: id,
                            preRequisiteId: insertPrerequisite.courseId,
                        },
                    });
                }
            );
        }

        return result;
    });

    const responseData = await prisma.course.findUnique({
        where: {
            id,
        },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
        },
    });

    return responseData;
};

export const removeCourse = async (id: string): Promise<Course> => {
    await prisma.courseToPrerequisite.deleteMany({
        where: {
            OR: [{ courseId: id }, { preRequisiteId: id }],
        },
    });

    const result = await prisma.course.delete({
        where: {
            id,
        },
    });

    return result;
};

export const setFaculties = async (id: string, payload: string[]): Promise<CourseFaculty[]> => {
    await prisma.courseFaculty.createMany({
        data: payload.map((facultyId) => ({
            courseId: id,
            facultyId,
        })),
    });

    const result = await prisma.courseFaculty.findMany({
        where: {
            courseId: id,
        },
        include: {
            faculty: true,
        },
    });

    return result;
};

export const removeFaculties = async (
    id: string,
    payload: string[]
): Promise<CourseFaculty[] | null> => {
    await prisma.courseFaculty.deleteMany({
        where: {
            courseId: id,
            facultyId: {
                in: payload,
            },
        },
    });

    const result = await prisma.courseFaculty.findMany({
        where: {
            courseId: id,
        },
        include: {
            faculty: true,
        },
    });

    return result;
};
