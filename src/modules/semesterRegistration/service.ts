/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
import {
    Course,
    OfferedCourse,
    Prisma,
    SemesterRegistration,
    SemesterRegistrationStatus,
    StudentEnrolledCourseStatus,
    StudentSemesterRegistration,
    StudentSemesterRegistrationCourse,
} from '@prisma/client';
import ApiError from 'errors/apiError';
import httpStatus from 'http-status';
import { createStudentEnrolledCourseDefaultMark } from 'modules/studentEnrolledCourseMark/service';
import { insertSemesterPayment } from 'modules/studentSemesterPayment/service';
import {
    extractFromCourse,
    registerIntoCourse,
} from 'modules/studentSemesterRegistrationCourse/service';
import { IPaginationOptions } from 'types/pagination';
import { IGenericResponse } from 'types/response';
import { asyncForEach } from 'utils/asyncForEach';
import calculatePagination from 'utils/pagination';
import prisma from 'utils/prisma';
import {
    semesterRegistrationRelationalFields,
    semesterRegistrationRelationalFieldsMapper,
    semesterRegistrationSearchableFields,
} from './constant';
import { IEnrollCoursePayload, ISemesterRegistrationFilter } from './interface';
import { getAvailableCourses } from './utils';

export const insertSemesterRegistration = async (
    data: SemesterRegistration
): Promise<SemesterRegistration> => {
    const isAnySemesterRegUpcomingOrOngoing = await prisma.semesterRegistration.findFirst({
        where: {
            OR: [
                {
                    status: SemesterRegistrationStatus.UPCOMING,
                },
                {
                    status: SemesterRegistrationStatus.ONGOING,
                },
            ],
        },
    });

    if (isAnySemesterRegUpcomingOrOngoing) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `There is already an ${isAnySemesterRegUpcomingOrOngoing.status} registration!`
        );
    }

    const result = await prisma.semesterRegistration.create({
        data,
    });

    return result;
};
export const findAllSemesterRegistration = async (
    filters: ISemesterRegistrationFilter,
    options: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: semesterRegistrationSearchableFields.map((field) => ({
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
                if (semesterRegistrationRelationalFields.includes(key)) {
                    return {
                        [semesterRegistrationRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.SemesterRegistrationWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.semesterRegistration.findMany({
        include: {
            semester: true,
        },
        skip,
        take: limit,
        where: whereConditions,
        orderBy:
            sortBy && sortOrder
                ? {
                      [sortBy]: sortOrder,
                  }
                : {
                      createdAt: 'desc',
                  },
    });

    const total = await prisma.semesterRegistration.count({
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

export const findSemesterRegistration = async (
    id: string
): Promise<SemesterRegistration | null> => {
    const result = await prisma.semesterRegistration.findUnique({
        where: {
            id,
        },
        include: {
            semester: true,
        },
    });

    return result;
};

export const editSemesterRegistration = async (
    id: string,
    payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration | null> => {
    const isSemesterRegExist = await prisma.semesterRegistration.findUnique({
        where: {
            id,
        },
    });

    if (!isSemesterRegExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found!');
    }

    if (
        payload.status &&
        isSemesterRegExist.status === SemesterRegistrationStatus.UPCOMING &&
        payload.status !== SemesterRegistrationStatus.ONGOING
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Can only move from UPCOMING to ONGOING');
    }

    if (
        payload.status &&
        isSemesterRegExist.status === SemesterRegistrationStatus.ONGOING &&
        payload.status !== SemesterRegistrationStatus.ENDED
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Can only move from ONGOING to ENDED');
    }

    const result = await prisma.semesterRegistration.update({
        where: {
            id,
        },
        data: payload,
        include: {
            semester: true,
        },
    });

    return result;
};

export const removeSemesterRegistration = async (id: string): Promise<SemesterRegistration> => {
    const result = await prisma.semesterRegistration.delete({
        where: {
            id,
        },
        include: {
            semester: true,
        },
    });

    return result;
};

export const beginMyRegistration = async (
    authUserId: string
): Promise<{
    semesterRegistration: SemesterRegistration | null;
    studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
    const studentInfo = await prisma.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });

    if (!studentInfo) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Student Info not found!');
    }

    const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
        where: {
            status: {
                in: [SemesterRegistrationStatus.ONGOING, SemesterRegistrationStatus.UPCOMING],
            },
        },
    });

    if (semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Registration is not started yet');
    }

    let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
        where: {
            student: {
                id: studentInfo?.id,
            },
            semesterRegistration: {
                id: semesterRegistrationInfo?.id,
            },
        },
    });

    if (!studentRegistration) {
        studentRegistration = await prisma.studentSemesterRegistration.create({
            data: {
                student: {
                    connect: {
                        id: studentInfo?.id,
                    },
                },
                semesterRegistration: {
                    connect: {
                        id: semesterRegistrationInfo?.id,
                    },
                },
            },
        });
    }

    return {
        semesterRegistration: semesterRegistrationInfo,
        studentSemesterRegistration: studentRegistration,
    };
};

export const joinIntoCourse = async (
    authUserId: string,
    payload: IEnrollCoursePayload
): Promise<{
    message: string;
}> => registerIntoCourse(authUserId, payload);

export const drawOutFromCourse = async (
    authUserId: string,
    payload: IEnrollCoursePayload
): Promise<{
    message: string;
}> => extractFromCourse(authUserId, payload);

export const verifyMyRegistration = async (authUserId: string): Promise<{ message: string }> => {
    const semesterRegistration = await prisma.semesterRegistration.findFirst({
        where: {
            status: SemesterRegistrationStatus.ONGOING,
        },
    });

    const studentSemesterRegistration = await prisma.studentSemesterRegistration.findFirst({
        where: {
            semesterRegistration: {
                id: semesterRegistration?.id,
            },
            student: {
                studentId: authUserId,
            },
        },
    });

    if (!studentSemesterRegistration) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You are not recognized for this semester!');
    }

    if (studentSemesterRegistration.totalCreditsTaken === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You are not enrolled in any course!');
    }

    if (
        studentSemesterRegistration.totalCreditsTaken &&
        semesterRegistration?.minCredit &&
        semesterRegistration.maxCredit &&
        (studentSemesterRegistration.totalCreditsTaken < semesterRegistration?.minCredit ||
            studentSemesterRegistration.totalCreditsTaken > semesterRegistration?.maxCredit)
    ) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits`
        );
    }

    await prisma.studentSemesterRegistration.update({
        where: {
            id: studentSemesterRegistration.id,
        },
        data: {
            isConfirmed: true,
        },
    });

    return {
        message: 'Your registration is confirmed!',
    };
};

export const findMyRegistration = async (authUserId: string) => {
    const semesterRegistration = await prisma.semesterRegistration.findFirst({
        where: {
            status: SemesterRegistrationStatus.ONGOING,
        },
        include: {
            semester: true,
        },
    });

    const studentSemesterRegistration = await prisma.studentSemesterRegistration.findFirst({
        where: {
            semesterRegistration: {
                id: semesterRegistration?.id,
            },
            student: {
                studentId: authUserId,
            },
        },
        include: {
            student: true,
        },
    });

    return { semesterRegistration, studentSemesterRegistration };
};

export const beginNewSemester = async (
    id: string
): Promise<{
    message: string;
}> => {
    const semesterRegistration = await prisma.semesterRegistration.findUnique({
        where: {
            id,
        },
        include: {
            semester: true,
        },
    });

    if (!semesterRegistration) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Semester Registration Not found!');
    }

    if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Semester Registration is not ended yet!');
    }

    if (semesterRegistration.semester.isCurrent) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Semester is already started!');
    }

    await prisma.$transaction(async (prismaTransactionClient) => {
        await prismaTransactionClient.semester.updateMany({
            where: {
                isCurrent: true,
            },
            data: {
                isCurrent: false,
            },
        });

        await prismaTransactionClient.semester.update({
            where: {
                id: semesterRegistration.semesterId,
            },
            data: {
                isCurrent: true,
            },
        });

        const studentSemesterRegistrations = await prisma.studentSemesterRegistration.findMany({
            where: {
                semesterRegistration: {
                    id,
                },
                isConfirmed: true,
            },
        });

        await asyncForEach(
            studentSemesterRegistrations,
            async (studentSemReg: StudentSemesterRegistration) => {
                if (studentSemReg.totalCreditsTaken) {
                    const totalSemesterPaymentAmount = studentSemReg.totalCreditsTaken * 5000;

                    await insertSemesterPayment(prismaTransactionClient, {
                        studentId: studentSemReg.studentId,
                        semesterId: semesterRegistration.semesterId,
                        totalPaymentAmount: totalSemesterPaymentAmount,
                    });
                }

                const studentSemesterRegistrationCourses =
                    await prismaTransactionClient.studentSemesterRegistrationCourse.findMany({
                        where: {
                            semesterRegistration: {
                                id,
                            },
                            student: {
                                id: studentSemReg.studentId,
                            },
                        },
                        include: {
                            offeredCourse: {
                                include: {
                                    course: true,
                                },
                            },
                        },
                    });

                await asyncForEach(
                    studentSemesterRegistrationCourses,
                    async (
                        item: StudentSemesterRegistrationCourse & {
                            offeredCourse: OfferedCourse & {
                                course: Course;
                            };
                        }
                    ) => {
                        const isExistEnrolledData =
                            await prismaTransactionClient.studentEnrolledCourse.findFirst({
                                where: {
                                    student: { id: item.studentId },
                                    course: { id: item.offeredCourse.courseId },
                                    semester: {
                                        id: semesterRegistration.semesterId,
                                    },
                                },
                            });

                        if (!isExistEnrolledData) {
                            const enrolledCourseData = {
                                studentId: item.studentId,
                                courseId: item.offeredCourse.courseId,
                                semesterId: semesterRegistration.semesterId,
                            };

                            const studentEnrolledCourseData =
                                await prismaTransactionClient.studentEnrolledCourse.create({
                                    data: enrolledCourseData,
                                });

                            await createStudentEnrolledCourseDefaultMark(prismaTransactionClient, {
                                studentId: item.studentId,
                                studentEnrolledCourseId: studentEnrolledCourseData.id,
                                semesterId: semesterRegistration.semesterId,
                            });
                        }
                    }
                );
            }
        );
    });
    return {
        message: 'Semester started successfully!',
    };
};

export const findMySemesterRegCourses = async (authUserId: string) => {
    const student = await prisma.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });

    const semesterRegistration = await prisma.semesterRegistration.findFirst({
        where: {
            status: {
                in: [SemesterRegistrationStatus.UPCOMING, SemesterRegistrationStatus.ONGOING],
            },
        },
        include: {
            semester: true,
        },
    });

    if (!semesterRegistration) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No semester registration not found!');
    }

    const studentCompletedCourse = await prisma.studentEnrolledCourse.findMany({
        where: {
            status: StudentEnrolledCourseStatus.COMPLETED,
            student: {
                id: student?.id,
            },
        },
        include: {
            course: true,
        },
    });

    const studentCurrentSemesterTakenCourse =
        await prisma.studentSemesterRegistrationCourse.findMany({
            where: {
                student: {
                    id: student?.id,
                },
                semesterRegistration: {
                    id: semesterRegistration?.id,
                },
            },
            include: {
                offeredCourse: true,
                offeredCourseSection: true,
            },
        });

    const offeredCourse = await prisma.offeredCourse.findMany({
        where: {
            semesterRegistration: {
                id: semesterRegistration.id,
            },
            department: {
                id: student?.departmentId,
            },
        },
        include: {
            course: {
                include: {
                    preRequisite: {
                        include: {
                            preRequisite: true,
                        },
                    },
                },
            },
            offeredCourseSections: {
                include: {
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
            },
        },
    });

    const availableCourses = getAvailableCourses(
        offeredCourse,
        studentCompletedCourse,
        studentCurrentSemesterTakenCourse
    );

    return availableCourses;
};
