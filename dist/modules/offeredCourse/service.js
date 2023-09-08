"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOfferedCourse = exports.editOfferedCourse = exports.findOfferedCourse = exports.findAllOfferedCourses = exports.insertOfferedCourse = void 0;
const asyncForEach_1 = require("../../utils/asyncForEach");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertOfferedCourse = async (data) => {
    const { courseIds, departmentId, semesterRegistrationId } = data;
    const result = [];
    await (0, asyncForEach_1.asyncForEach)(courseIds, async (courseId) => {
        const isAlreadyExist = await prisma_1.default.offeredCourse.findFirst({
            where: {
                courseId,
                departmentId,
                semesterRegistrationId,
            },
        });
        if (!isAlreadyExist) {
            const addOfferedCourse = await prisma_1.default.offeredCourse.create({
                data: {
                    courseId,
                    departmentId,
                    semesterRegistrationId,
                },
                include: {
                    course: true,
                    department: true,
                    semesterRegistration: true,
                },
            });
            result.push(addOfferedCourse);
        }
    });
    return result;
};
exports.insertOfferedCourse = insertOfferedCourse;
const findAllOfferedCourses = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.offeredCourseSearchableFields.map((field) => ({
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
                if (constant_1.offeredCourseRelationalFields.includes(key)) {
                    return {
                        [constant_1.offeredCourseRelationalFieldsMapper[key]]: {
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
    const result = await prisma_1.default.offeredCourse.findMany({
        include: {
            course: true,
            department: true,
            semesterRegistration: true,
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
    const total = await prisma_1.default.offeredCourse.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
exports.findAllOfferedCourses = findAllOfferedCourses;
const findOfferedCourse = async (id) => {
    const result = await prisma_1.default.offeredCourse.findUnique({
        where: {
            id,
        },
        include: {
            course: true,
            department: true,
            semesterRegistration: true,
        },
    });
    return result;
};
exports.findOfferedCourse = findOfferedCourse;
const editOfferedCourse = async (id, payload) => {
    const result = await prisma_1.default.offeredCourse.update({
        where: {
            id,
        },
        data: payload,
        include: {
            course: true,
            department: true,
            semesterRegistration: true,
        },
    });
    return result;
};
exports.editOfferedCourse = editOfferedCourse;
const removeOfferedCourse = async (id) => {
    const result = await prisma_1.default.offeredCourse.delete({
        where: {
            id,
        },
        include: {
            course: true,
            department: true,
            semesterRegistration: true,
        },
    });
    return result;
};
exports.removeOfferedCourse = removeOfferedCourse;
