"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStudentEnrolledCourse = exports.editStudentEnrolledCourse = exports.findStudentEnrolledCourse = exports.findAllStudentEnrolledCourses = exports.insertStudentEnrolledCourse = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertStudentEnrolledCourse = async (data) => {
    const isCourseOngoingOrCompleted = await prisma_1.default.studentEnrolledCourse.findFirst({
        where: {
            OR: [
                {
                    status: client_1.StudentEnrolledCourseStatus.ONGOING,
                },
                {
                    status: client_1.StudentEnrolledCourseStatus.COMPLETED,
                },
            ],
        },
    });
    if (isCourseOngoingOrCompleted) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `There is already an ${isCourseOngoingOrCompleted.status?.toLowerCase()} registration`);
    }
    const result = await prisma_1.default.studentEnrolledCourse.create({
        data,
        include: {
            semester: true,
            student: true,
            course: true,
        },
    });
    return result;
};
exports.insertStudentEnrolledCourse = insertStudentEnrolledCourse;
const findAllStudentEnrolledCourses = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, ...filterData } = filters;
    if (!filterData.semesterId) {
        const currentAcademicSemester = await prisma_1.default.semester.findFirst({
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
            OR: constant_1.studentEnrolledCourseSearchableFields.map((field) => ({
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
                if (constant_1.studentEnrolledCourseRelationalFields.includes(key)) {
                    return {
                        [constant_1.studentEnrolledCourseRelationalFieldsMapper[key]]: {
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
    const result = await prisma_1.default.studentEnrolledCourse.findMany({
        include: {
            semester: true,
            student: true,
            course: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = await prisma_1.default.studentEnrolledCourse.count({
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
exports.findAllStudentEnrolledCourses = findAllStudentEnrolledCourses;
const findStudentEnrolledCourse = async (id) => {
    const result = await prisma_1.default.studentEnrolledCourse.findUnique({
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
exports.findStudentEnrolledCourse = findStudentEnrolledCourse;
const editStudentEnrolledCourse = async (id, payload) => {
    const result = await prisma_1.default.studentEnrolledCourse.update({
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
exports.editStudentEnrolledCourse = editStudentEnrolledCourse;
const removeStudentEnrolledCourse = async (id) => {
    const result = await prisma_1.default.studentEnrolledCourse.delete({
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
exports.removeStudentEnrolledCourse = removeStudentEnrolledCourse;
