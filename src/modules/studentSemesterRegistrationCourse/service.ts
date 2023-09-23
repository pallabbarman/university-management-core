/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
import { SemesterRegistrationStatus } from '@prisma/client';
import ApiError from 'errors/apiError';
import httpStatus from 'http-status';
import { IEnrollCoursePayload } from 'modules/semesterRegistration/interface';
import prisma from 'utils/prisma';

export const registerIntoCourse = async (
    authUserId: string,
    payload: IEnrollCoursePayload
): Promise<{
    message: string;
}> => {
    const student = await prisma.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });

    const semesterRegistration = await prisma.semesterRegistration.findFirst({
        where: {
            status: SemesterRegistrationStatus.ONGOING,
        },
    });

    const offeredCourse = await prisma.offeredCourse.findFirst({
        where: {
            id: payload.offeredCourseId,
        },
        include: {
            course: true,
        },
    });

    const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
        where: {
            id: payload.offeredCourseSectionId,
        },
    });

    if (!student) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Student not found!');
    }

    if (!semesterRegistration) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found!');
    }

    if (!offeredCourse) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Offered Course not found!');
    }

    if (!offeredCourseSection) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Offered Course Section not found!');
    }

    if (
        offeredCourseSection.maxCapacity &&
        offeredCourseSection.currentlyEnrolledStudent &&
        offeredCourseSection.currentlyEnrolledStudent >= offeredCourseSection.maxCapacity
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Student capacity is full!');
    }

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.studentSemesterRegistrationCourse.create({
            data: {
                studentId: student?.id,
                semesterRegistrationId: semesterRegistration?.id,
                offeredCourseId: payload.offeredCourseId,
                offeredCourseSectionId: payload.offeredCourseSectionId,
            },
        });

        await transactionClient.offeredCourseSection.update({
            where: {
                id: payload.offeredCourseSectionId,
            },
            data: {
                currentlyEnrolledStudent: {
                    increment: 1,
                },
            },
        });

        await transactionClient.studentSemesterRegistration.updateMany({
            where: {
                student: {
                    id: student.id,
                },
                semesterRegistration: {
                    id: semesterRegistration.id,
                },
            },
            data: {
                totalCreditsTaken: {
                    increment: offeredCourse.course.credits,
                },
            },
        });
    });

    return {
        message: 'Successfully enrolled into course!',
    };
};

export const extractFromCourse = async (
    authUserId: string,
    payload: IEnrollCoursePayload
): Promise<{
    message: string;
}> => {
    const student = await prisma.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });

    const semesterRegistration = await prisma.semesterRegistration.findFirst({
        where: {
            status: SemesterRegistrationStatus.ONGOING,
        },
    });

    const offeredCourse = await prisma.offeredCourse.findFirst({
        where: {
            id: payload.offeredCourseId,
        },
        include: {
            course: true,
        },
    });

    if (!student) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Student not found!');
    }

    if (!semesterRegistration) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found!');
    }

    if (!offeredCourse) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Offered Course not found!');
    }

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.studentSemesterRegistrationCourse.delete({
            where: {
                semesterRegistrationId_studentId_offeredCourseId: {
                    semesterRegistrationId: semesterRegistration?.id,
                    studentId: student?.id,
                    offeredCourseId: payload.offeredCourseId,
                },
            },
        });

        await transactionClient.offeredCourseSection.update({
            where: {
                id: payload.offeredCourseSectionId,
            },
            data: {
                currentlyEnrolledStudent: {
                    decrement: 1,
                },
            },
        });

        await transactionClient.studentSemesterRegistration.updateMany({
            where: {
                student: {
                    id: student.id,
                },
                semesterRegistration: {
                    id: semesterRegistration.id,
                },
            },
            data: {
                totalCreditsTaken: {
                    decrement: offeredCourse.course.credits,
                },
            },
        });
    });

    return {
        message: 'Successfully withdraw from course',
    };
};
