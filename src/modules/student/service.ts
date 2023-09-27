/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
import { Prisma, Student, StudentEnrolledCourseStatus } from '@prisma/client';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    studentRelationalFields,
    studentRelationalFieldsMapper,
    studentSearchableFields,
} from './constant';
import { IStudentFilter } from './interface';
import { groupBySemester } from './utils';

export const insertStudent = async (data: Student): Promise<Student> => {
    const result = await prisma.student.create({
        data,
        include: {
            academicFaculty: true,
            department: true,
            semester: true,
        },
    });

    return result;
};

export const findAllStudents = async (
    filters: IStudentFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: studentSearchableFields.map((field) => ({
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
                if (studentRelationalFields.includes(key)) {
                    return {
                        [studentRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.StudentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.student.findMany({
        include: {
            academicFaculty: true,
            department: true,
            semester: true,
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

    const total = await prisma.student.count({
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

export const findStudent = async (id: string): Promise<Student | null> => {
    const result = await prisma.student.findUnique({
        where: {
            id,
        },
        include: {
            academicFaculty: true,
            department: true,
            semester: true,
        },
    });

    return result;
};

export const editStudent = async (id: string, payload: Partial<Student>): Promise<Student> => {
    const result = await prisma.student.update({
        where: {
            id,
        },
        data: payload,
        include: {
            academicFaculty: true,
            department: true,
            semester: true,
        },
    });

    return result;
};

export const removeStudent = async (id: string): Promise<Student> => {
    const result = await prisma.student.delete({
        where: {
            id,
        },
        include: {
            academicFaculty: true,
            department: true,
            semester: true,
        },
    });

    return result;
};

export const findMyCourses = async (
    authUserId: string,
    filter: {
        courseId?: string | undefined;
        semesterId?: string | undefined;
    }
) => {
    if (!filter.semesterId) {
        const currentSemester = await prisma.semester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        filter.semesterId = currentSemester?.id;
    }

    const result = await prisma.studentEnrolledCourse.findMany({
        where: {
            student: {
                studentId: authUserId,
            },
            ...filter,
        },
        include: {
            course: true,
        },
    });

    return result;
};

export const findMyCourseSchedules = async (
    authUserId: string,
    filter: {
        courseId?: string | undefined;
        semesterId?: string | undefined;
    }
) => {
    if (!filter.semesterId) {
        const currentSemester = await prisma.semester.findFirst({
            where: {
                isCurrent: true,
            },
        });

        filter.semesterId = currentSemester?.id;
    }

    const studentEnrolledCourses = await findMyCourses(authUserId, filter);
    const studentEnrolledCourseIds = studentEnrolledCourses.map((item) => item.courseId);
    const result = await prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            student: {
                studentId: authUserId,
            },
            semesterRegistration: {
                semester: {
                    id: filter.semesterId,
                },
            },
            offeredCourse: {
                course: {
                    id: {
                        in: studentEnrolledCourseIds,
                    },
                },
            },
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
            offeredCourseSection: {
                include: {
                    offeredCourseClassSchedules: {
                        include: {
                            room: {
                                include: {
                                    building: true,
                                },
                            },
                            faculty: true,
                        },
                    },
                },
            },
        },
    });

    return result;
};

export const findMyAcademicInfo = async (authUserId: string): Promise<any> => {
    const academicInfo = await prisma.studentAcademicInfo.findFirst({
        where: {
            student: {
                studentId: authUserId,
            },
        },
    });

    const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
        where: {
            student: {
                studentId: authUserId,
            },
            status: StudentEnrolledCourseStatus.COMPLETED,
        },
        include: {
            course: true,
            semester: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    const groupByAcademicSemesterData = groupBySemester(enrolledCourses);

    return {
        academicInfo,
        courses: groupByAcademicSemesterData,
    };
};
