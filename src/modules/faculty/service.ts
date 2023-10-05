/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import { CourseFaculty, Faculty, Prisma, Student } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    facultyRelationalFields,
    facultyRelationalFieldsMapper,
    facultySearchableFields,
} from './constant';
import { IFacultyFilters, IFacultyMyCourseStudents } from './interface';

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
            page,
            limit,
            total,
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

export const editFaculty = async (id: string, payload: Partial<Faculty>): Promise<Faculty> => {
    const result = await prisma.faculty.update({
        where: {
            id,
        },
        data: payload,
        include: {
            academicFaculty: true,
            department: true,
        },
    });

    return result;
};

export const removeFaculty = async (id: string): Promise<Faculty> => {
    const result = await prisma.faculty.delete({
        where: {
            id,
        },
    });

    return result;
};

export const setCourses = async (id: string, payload: string[]): Promise<CourseFaculty[]> => {
    await prisma.courseFaculty.createMany({
        data: payload.map((courseId) => ({
            courseId,
            facultyId: id,
        })),
    });

    const result = await prisma.courseFaculty.findMany({
        where: {
            facultyId: id,
        },
        include: {
            course: true,
        },
    });

    return result;
};

export const removeCourses = async (
    id: string,
    payload: string[]
): Promise<CourseFaculty[] | null> => {
    await prisma.courseFaculty.deleteMany({
        where: {
            facultyId: id,
            courseId: {
                in: payload,
            },
        },
    });

    const result = await prisma.courseFaculty.findMany({
        where: {
            facultyId: id,
        },
        include: {
            course: true,
        },
    });

    return result;
};
export const findMyCourses = async (
    authUser: JwtPayload,
    filter: {
        semesterId?: string | null | undefined;
        courseId?: string | null | undefined;
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

    const offeredCourseSections = await prisma.offeredCourseSection.findMany({
        where: {
            offeredCourseClassSchedules: {
                some: {
                    faculty: {
                        facultyId: authUser.userId,
                    },
                },
            },
            offeredCourse: {
                semesterRegistration: {
                    semester: {
                        id: filter.semesterId,
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
            offeredCourseClassSchedules: {
                include: {
                    room: {
                        include: {
                            building: true,
                        },
                    },
                },
            },
        },
    });

    const courseAndSchedule = offeredCourseSections.reduce((acc: any, obj: any) => {
        const { course } = obj.offeredCourse;
        const classSchedules = obj.offeredCourseClassSchedules;

        const existingCourse = acc.find((item: any) => item.course?.id === course?.id);

        if (existingCourse) {
            existingCourse.sections.push({
                section: obj,
                classSchedules,
            });
        } else {
            acc.push({
                course,
                sections: [
                    {
                        section: obj,
                        classSchedules,
                    },
                ],
            });
        }
        return acc;
    }, []);

    return courseAndSchedule;
};

export const findMyCourseStudents = async (
    filters: IFacultyMyCourseStudents,
    options: IPaginationOptions,
    authUser: any
): Promise<IGenericResponse<Student[]>> => {
    const { limit, page, skip } = calculatePagination(options);
    console.log(authUser);
    if (!filters.semesterId) {
        const currentAcademicSemester = await prisma.semester.findFirst({
            where: {
                isCurrent: true,
            },
        });

        if (currentAcademicSemester) {
            filters.semesterId = currentAcademicSemester.id;
        }
    }

    const offeredCourseSections = await prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId,
                },
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        semester: {
                            id: filters.semesterId,
                        },
                    },
                },
                id: filters.offeredCourseSectionId,
            },
        },
        include: {
            student: true,
        },
        take: limit,
        skip,
    });

    const students = offeredCourseSections.map(
        (offeredCourseSection) => offeredCourseSection.student
    );

    const total = await prisma.studentSemesterRegistrationCourse.count({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId,
                },
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        semester: {
                            id: filters.semesterId,
                        },
                    },
                },
                id: filters.offeredCourseSectionId,
            },
        },
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: students,
    };
};
