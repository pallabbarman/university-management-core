"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMyAcademicInfo = exports.findMyCourseSchedules = exports.findMyCourses = exports.removeStudent = exports.editStudent = exports.findStudent = exports.findAllStudents = exports.insertStudent = void 0;
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
const client_1 = require("@prisma/client");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const utils_1 = require("./utils");
const insertStudent = async (data) => {
    const result = await prisma_1.default.student.create({
        data,
        include: {
            academicFaculty: true,
            department: true,
            semester: true,
        },
    });
    return result;
};
exports.insertStudent = insertStudent;
const findAllStudents = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.studentSearchableFields.map((field) => ({
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
                if (constant_1.studentRelationalFields.includes(key)) {
                    return {
                        [constant_1.studentRelationalFieldsMapper[key]]: {
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
    const result = await prisma_1.default.student.findMany({
        include: {
            academicFaculty: true,
            department: true,
            semester: true,
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
    const total = await prisma_1.default.student.count({
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
exports.findAllStudents = findAllStudents;
const findStudent = async (id) => {
    const result = await prisma_1.default.student.findUnique({
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
exports.findStudent = findStudent;
const editStudent = async (id, payload) => {
    const result = await prisma_1.default.student.update({
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
exports.editStudent = editStudent;
const removeStudent = async (id) => {
    const result = await prisma_1.default.student.delete({
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
exports.removeStudent = removeStudent;
const findMyCourses = async (authUserId, filter) => {
    if (!filter.semesterId) {
        const currentSemester = await prisma_1.default.semester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        filter.semesterId = currentSemester?.id;
    }
    const result = await prisma_1.default.studentEnrolledCourse.findMany({
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
exports.findMyCourses = findMyCourses;
const findMyCourseSchedules = async (authUserId, filter) => {
    if (!filter.semesterId) {
        const currentSemester = await prisma_1.default.semester.findFirst({
            where: {
                isCurrent: true,
            },
        });
        filter.semesterId = currentSemester?.id;
    }
    const studentEnrolledCourses = await (0, exports.findMyCourses)(authUserId, filter);
    const studentEnrolledCourseIds = studentEnrolledCourses.map((item) => item.courseId);
    const result = await prisma_1.default.studentSemesterRegistrationCourse.findMany({
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
exports.findMyCourseSchedules = findMyCourseSchedules;
const findMyAcademicInfo = async (authUserId) => {
    const academicInfo = await prisma_1.default.studentAcademicInfo.findFirst({
        where: {
            student: {
                studentId: authUserId,
            },
        },
    });
    const enrolledCourses = await prisma_1.default.studentEnrolledCourse.findMany({
        where: {
            student: {
                studentId: authUserId,
            },
            status: client_1.StudentEnrolledCourseStatus.COMPLETED,
        },
        include: {
            course: true,
            semester: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    const groupByAcademicSemesterData = (0, utils_1.groupBySemester)(enrolledCourses);
    return {
        academicInfo,
        courses: groupByAcademicSemesterData,
    };
};
exports.findMyAcademicInfo = findMyAcademicInfo;
