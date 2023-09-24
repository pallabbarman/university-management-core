"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFromCourse = exports.registerIntoCourse = void 0;
/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const registerIntoCourse = async (authUserId, payload) => {
    const student = await prisma_1.default.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });
    const semesterRegistration = await prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING,
        },
    });
    const offeredCourse = await prisma_1.default.offeredCourse.findFirst({
        where: {
            id: payload.offeredCourseId,
        },
        include: {
            course: true,
        },
    });
    const offeredCourseSection = await prisma_1.default.offeredCourseSection.findFirst({
        where: {
            id: payload.offeredCourseSectionId,
        },
    });
    if (!student) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found!');
    }
    if (!semesterRegistration) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Semester Registration not found!');
    }
    if (!offeredCourse) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Offered Course not found!');
    }
    if (!offeredCourseSection) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Offered Course Section not found!');
    }
    if (offeredCourseSection.maxCapacity &&
        offeredCourseSection.currentlyEnrolledStudent &&
        offeredCourseSection.currentlyEnrolledStudent >= offeredCourseSection.maxCapacity) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Student capacity is full!');
    }
    await prisma_1.default.$transaction(async (transactionClient) => {
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
exports.registerIntoCourse = registerIntoCourse;
const extractFromCourse = async (authUserId, payload) => {
    const student = await prisma_1.default.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });
    const semesterRegistration = await prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING,
        },
    });
    const offeredCourse = await prisma_1.default.offeredCourse.findFirst({
        where: {
            id: payload.offeredCourseId,
        },
        include: {
            course: true,
        },
    });
    if (!student) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Student not found!');
    }
    if (!semesterRegistration) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Semester Registration not found!');
    }
    if (!offeredCourse) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Offered Course not found!');
    }
    await prisma_1.default.$transaction(async (transactionClient) => {
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
exports.extractFromCourse = extractFromCourse;
