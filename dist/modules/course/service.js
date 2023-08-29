"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFaculties = exports.setFaculties = exports.removeCourse = exports.editCourse = exports.findCourse = exports.findAllCourses = exports.insertCourse = void 0;
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const asyncForEach_1 = require("../../utils/asyncForEach");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertCourse = async (data) => {
    const { preRequisiteCourses, ...courseData } = data;
    const newCourse = await prisma_1.default.$transaction(async (transactionClient) => {
        const result = await transactionClient.course.create({
            data: courseData,
        });
        if (!result) {
            throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to create course');
        }
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            await (0, asyncForEach_1.asyncForEach)(preRequisiteCourses, async (preRequisiteCourse) => {
                await transactionClient.courseToPrerequisite.create({
                    data: {
                        courseId: result.id,
                        preRequisiteId: preRequisiteCourse.courseId,
                    },
                });
            });
        }
        return result;
    });
    if (newCourse) {
        const responseData = await prisma_1.default.course.findUnique({
            where: {
                id: newCourse.id,
            },
            include: {
                preRequisite: {
                    include: {
                        preRequisite: true,
                    },
                },
                preRequisiteFor: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        return responseData;
    }
    throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to create course');
};
exports.insertCourse = insertCourse;
const findAllCourses = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.courseSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.course.findMany({
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
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
    const total = await prisma_1.default.course.count({
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
exports.findAllCourses = findAllCourses;
const findCourse = async (id) => {
    const result = await prisma_1.default.course.findUnique({
        where: { id },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    preRequisite: true,
                },
            },
        },
    });
    return result;
};
exports.findCourse = findCourse;
const editCourse = async (id, payload) => {
    const { preRequisiteCourses, ...courseData } = payload;
    await prisma_1.default.$transaction(async (transactionClient) => {
        const result = await transactionClient.course.update({
            where: {
                id,
            },
            data: courseData,
        });
        if (!result) {
            throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to update course');
        }
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletePrerequisite = preRequisiteCourses.filter((coursePrerequisite) => coursePrerequisite.courseId && coursePrerequisite.isDeleted);
            const newPrerequisite = preRequisiteCourses.filter((coursePrerequisite) => coursePrerequisite.courseId && !coursePrerequisite.isDeleted);
            await (0, asyncForEach_1.asyncForEach)(deletePrerequisite, async (deletePreCourse) => {
                await transactionClient.courseToPrerequisite.deleteMany({
                    where: {
                        AND: [
                            {
                                courseId: id,
                            },
                            {
                                preRequisiteId: deletePreCourse.courseId,
                            },
                        ],
                    },
                });
            });
            await (0, asyncForEach_1.asyncForEach)(newPrerequisite, async (insertPrerequisite) => {
                await transactionClient.courseToPrerequisite.create({
                    data: {
                        courseId: id,
                        preRequisiteId: insertPrerequisite.courseId,
                    },
                });
            });
        }
        return result;
    });
    const responseData = await prisma_1.default.course.findUnique({
        where: {
            id,
        },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
        },
    });
    return responseData;
};
exports.editCourse = editCourse;
const removeCourse = async (id) => {
    await prisma_1.default.courseToPrerequisite.deleteMany({
        where: {
            OR: [{ courseId: id }, { preRequisiteId: id }],
        },
    });
    const result = await prisma_1.default.course.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.removeCourse = removeCourse;
const setFaculties = async (id, payload) => {
    await prisma_1.default.courseFaculty.createMany({
        data: payload.map((facultyId) => ({
            courseId: id,
            facultyId,
        })),
    });
    const result = await prisma_1.default.courseFaculty.findMany({
        where: {
            courseId: id,
        },
        include: {
            faculty: true,
        },
    });
    return result;
};
exports.setFaculties = setFaculties;
const removeFaculties = async (id, payload) => {
    await prisma_1.default.courseFaculty.deleteMany({
        where: {
            courseId: id,
            facultyId: {
                in: payload,
            },
        },
    });
    const result = await prisma_1.default.courseFaculty.findMany({
        where: {
            courseId: id,
        },
        include: {
            faculty: true,
        },
    });
    return result;
};
exports.removeFaculties = removeFaculties;
