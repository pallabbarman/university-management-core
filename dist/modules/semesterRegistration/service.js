"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMySemesterRegCourses = exports.beginNewSemester = exports.findMyRegistration = exports.verifyMyRegistration = exports.drawOutFromCourse = exports.joinIntoCourse = exports.beginMyRegistration = exports.removeSemesterRegistration = exports.editSemesterRegistration = exports.findSemesterRegistration = exports.findAllSemesterRegistration = exports.insertSemesterRegistration = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const service_1 = require("../studentEnrolledCourseMark/service");
const service_2 = require("../studentSemesterPayment/service");
const service_3 = require("../studentSemesterRegistrationCourse/service");
const asyncForEach_1 = require("../../utils/asyncForEach");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const utils_1 = require("./utils");
const insertSemesterRegistration = async (data) => {
    const isAnySemesterRegUpcomingOrOngoing = await prisma_1.default.semesterRegistration.findFirst({
        where: {
            OR: [
                {
                    status: client_1.SemesterRegistrationStatus.UPCOMING,
                },
                {
                    status: client_1.SemesterRegistrationStatus.ONGOING,
                },
            ],
        },
    });
    if (isAnySemesterRegUpcomingOrOngoing) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `There is already an ${isAnySemesterRegUpcomingOrOngoing.status} registration!`);
    }
    const result = await prisma_1.default.semesterRegistration.create({
        data,
    });
    return result;
};
exports.insertSemesterRegistration = insertSemesterRegistration;
const findAllSemesterRegistration = async (filters, options) => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.semesterRegistrationSearchableFields.map((field) => ({
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
                if (constant_1.semesterRegistrationRelationalFields.includes(key)) {
                    return {
                        [constant_1.semesterRegistrationRelationalFieldsMapper[key]]: {
                            id: filterData[key],
                        },
                    };
                }
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.semesterRegistration.findMany({
        include: {
            semester: true,
        },
        skip,
        take: limit,
        where: whereConditions,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: 'desc',
            },
    });
    const total = await prisma_1.default.semesterRegistration.count({
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
exports.findAllSemesterRegistration = findAllSemesterRegistration;
const findSemesterRegistration = async (id) => {
    const result = await prisma_1.default.semesterRegistration.findUnique({
        where: {
            id,
        },
        include: {
            semester: true,
        },
    });
    return result;
};
exports.findSemesterRegistration = findSemesterRegistration;
const editSemesterRegistration = async (id, payload) => {
    const isSemesterRegExist = await prisma_1.default.semesterRegistration.findUnique({
        where: {
            id,
        },
    });
    if (!isSemesterRegExist) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Data not found!');
    }
    if (payload.status &&
        isSemesterRegExist.status === client_1.SemesterRegistrationStatus.UPCOMING &&
        payload.status !== client_1.SemesterRegistrationStatus.ONGOING) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Can only move from UPCOMING to ONGOING');
    }
    if (payload.status &&
        isSemesterRegExist.status === client_1.SemesterRegistrationStatus.ONGOING &&
        payload.status !== client_1.SemesterRegistrationStatus.ENDED) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Can only move from ONGOING to ENDED');
    }
    const result = await prisma_1.default.semesterRegistration.update({
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
exports.editSemesterRegistration = editSemesterRegistration;
const removeSemesterRegistration = async (id) => {
    const result = await prisma_1.default.semesterRegistration.delete({
        where: {
            id,
        },
        include: {
            semester: true,
        },
    });
    return result;
};
exports.removeSemesterRegistration = removeSemesterRegistration;
const beginMyRegistration = async (authUserId) => {
    const studentInfo = await prisma_1.default.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });
    if (!studentInfo) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Student Info not found!');
    }
    const semesterRegistrationInfo = await prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: {
                in: [client_1.SemesterRegistrationStatus.ONGOING, client_1.SemesterRegistrationStatus.UPCOMING],
            },
        },
    });
    if (semesterRegistrationInfo?.status === client_1.SemesterRegistrationStatus.UPCOMING) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Registration is not started yet');
    }
    let studentRegistration = await prisma_1.default.studentSemesterRegistration.findFirst({
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
        studentRegistration = await prisma_1.default.studentSemesterRegistration.create({
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
exports.beginMyRegistration = beginMyRegistration;
const joinIntoCourse = async (authUserId, payload) => (0, service_3.registerIntoCourse)(authUserId, payload);
exports.joinIntoCourse = joinIntoCourse;
const drawOutFromCourse = async (authUserId, payload) => (0, service_3.extractFromCourse)(authUserId, payload);
exports.drawOutFromCourse = drawOutFromCourse;
const verifyMyRegistration = async (authUserId) => {
    const semesterRegistration = await prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING,
        },
    });
    const studentSemesterRegistration = await prisma_1.default.studentSemesterRegistration.findFirst({
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
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not recognized for this semester!');
    }
    if (studentSemesterRegistration.totalCreditsTaken === 0) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not enrolled in any course!');
    }
    if (studentSemesterRegistration.totalCreditsTaken &&
        semesterRegistration?.minCredit &&
        semesterRegistration.maxCredit &&
        (studentSemesterRegistration.totalCreditsTaken < semesterRegistration?.minCredit ||
            studentSemesterRegistration.totalCreditsTaken > semesterRegistration?.maxCredit)) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits`);
    }
    await prisma_1.default.studentSemesterRegistration.update({
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
exports.verifyMyRegistration = verifyMyRegistration;
const findMyRegistration = async (authUserId) => {
    const semesterRegistration = await prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: client_1.SemesterRegistrationStatus.ONGOING,
        },
        include: {
            semester: true,
        },
    });
    const studentSemesterRegistration = await prisma_1.default.studentSemesterRegistration.findFirst({
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
exports.findMyRegistration = findMyRegistration;
const beginNewSemester = async (id) => {
    const semesterRegistration = await prisma_1.default.semesterRegistration.findUnique({
        where: {
            id,
        },
        include: {
            semester: true,
        },
    });
    if (!semesterRegistration) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Semester Registration Not found!');
    }
    if (semesterRegistration.status !== client_1.SemesterRegistrationStatus.ENDED) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Semester Registration is not ended yet!');
    }
    if (semesterRegistration.semester.isCurrent) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Semester is already started!');
    }
    await prisma_1.default.$transaction(async (prismaTransactionClient) => {
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
        const studentSemesterRegistrations = await prisma_1.default.studentSemesterRegistration.findMany({
            where: {
                semesterRegistration: {
                    id,
                },
                isConfirmed: true,
            },
        });
        await (0, asyncForEach_1.asyncForEach)(studentSemesterRegistrations, async (studentSemReg) => {
            if (studentSemReg.totalCreditsTaken) {
                const totalSemesterPaymentAmount = studentSemReg.totalCreditsTaken * 5000;
                await (0, service_2.insertSemesterPayment)(prismaTransactionClient, {
                    studentId: studentSemReg.studentId,
                    semesterId: semesterRegistration.semesterId,
                    totalPaymentAmount: totalSemesterPaymentAmount,
                });
            }
            const studentSemesterRegistrationCourses = await prismaTransactionClient.studentSemesterRegistrationCourse.findMany({
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
            await (0, asyncForEach_1.asyncForEach)(studentSemesterRegistrationCourses, async (item) => {
                const isExistEnrolledData = await prismaTransactionClient.studentEnrolledCourse.findFirst({
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
                    const studentEnrolledCourseData = await prismaTransactionClient.studentEnrolledCourse.create({
                        data: enrolledCourseData,
                    });
                    await (0, service_1.createStudentEnrolledCourseDefaultMark)(prismaTransactionClient, {
                        studentId: item.studentId,
                        studentEnrolledCourseId: studentEnrolledCourseData.id,
                        semesterId: semesterRegistration.semesterId,
                    });
                }
            });
        });
    });
    return {
        message: 'Semester started successfully!',
    };
};
exports.beginNewSemester = beginNewSemester;
const findMySemesterRegCourses = async (authUserId) => {
    const student = await prisma_1.default.student.findFirst({
        where: {
            studentId: authUserId,
        },
    });
    const semesterRegistration = await prisma_1.default.semesterRegistration.findFirst({
        where: {
            status: {
                in: [client_1.SemesterRegistrationStatus.UPCOMING, client_1.SemesterRegistrationStatus.ONGOING],
            },
        },
        include: {
            semester: true,
        },
    });
    if (!semesterRegistration) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'No semester registration not found!');
    }
    const studentCompletedCourse = await prisma_1.default.studentEnrolledCourse.findMany({
        where: {
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
            student: {
                id: student?.id,
            },
        },
        include: {
            course: true,
        },
    });
    const studentCurrentSemesterTakenCourse = await prisma_1.default.studentSemesterRegistrationCourse.findMany({
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
    const offeredCourse = await prisma_1.default.offeredCourse.findMany({
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
    const availableCourses = (0, utils_1.getAvailableCourses)(offeredCourse, studentCompletedCourse, studentCurrentSemesterTakenCourse);
    return availableCourses;
};
exports.findMySemesterRegCourses = findMySemesterRegCourses;
