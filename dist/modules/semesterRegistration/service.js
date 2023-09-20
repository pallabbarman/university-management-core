"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.beginMyRegistration = exports.removeSemesterRegistration = exports.editSemesterRegistration = exports.findSemesterRegistration = exports.findAllSemesterRegistration = exports.insertSemesterRegistration = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
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
