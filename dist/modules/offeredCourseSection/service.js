"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOfferedCourseSection = exports.editOfferedCourseSection = exports.findOfferedCourseSection = exports.findAllOfferedCourseSections = exports.insertOfferedCourseSection = void 0;
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../offeredCourseClassSchedule/utils");
const asyncForEach_1 = require("../../utils/asyncForEach");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertOfferedCourseSection = async (payload) => {
    const { classSchedules, ...data } = payload;
    const isExistOfferedCourse = await prisma_1.default.offeredCourse.findFirst({
        where: {
            id: data.offeredCourseId,
        },
    });
    if (!isExistOfferedCourse) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Offered Course does not exist!');
    }
    await (0, asyncForEach_1.asyncForEach)(classSchedules, async (schedule) => {
        await (0, utils_1.checkRoomAvailable)(schedule);
        await (0, utils_1.checkFacultyAvailable)(schedule);
    });
    const offerCourseSectionData = await prisma_1.default.offeredCourseSection.findFirst({
        where: {
            offeredCourse: {
                id: data.offeredCourseId,
            },
            title: data.title,
        },
    });
    if (offerCourseSectionData) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Course Section already exists');
    }
    const createSection = await prisma_1.default.$transaction(async (transactionClient) => {
        const createOfferedCourseSection = await transactionClient.offeredCourseSection.create({
            data: {
                title: data.title,
                maxCapacity: data.maxCapacity,
                offeredCourseId: data.offeredCourseId,
                semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
            },
        });
        const scheduleData = classSchedules.map((schedule) => ({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            dayOfWeek: schedule.dayOfWeek,
            roomId: schedule.roomId,
            facultyId: schedule.facultyId,
            offeredCourseSectionId: createOfferedCourseSection.id,
            semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
        }));
        await transactionClient.offeredCourseClassSchedule.createMany({
            data: scheduleData,
        });
        return createOfferedCourseSection;
    });
    const result = await prisma_1.default.offeredCourseSection.findFirst({
        where: {
            id: createSection.id,
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
                    faculty: true,
                },
            },
        },
    });
    return result;
};
exports.insertOfferedCourseSection = insertOfferedCourseSection;
const findAllOfferedCourseSections = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.offeredCourseSectionSearchableFields.map((field) => ({
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
                if (constant_1.offeredCourseSectionRelationalFields.includes(key)) {
                    return {
                        [constant_1.offeredCourseSectionRelationalFieldsMapper[key]]: {
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
    const result = await prisma_1.default.offeredCourseSection.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : {
                createdAt: 'desc',
            },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
        },
    });
    const total = await prisma_1.default.offeredCourseSection.count({
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
exports.findAllOfferedCourseSections = findAllOfferedCourseSections;
const findOfferedCourseSection = async (id) => {
    const result = await prisma_1.default.offeredCourseSection.findUnique({
        where: {
            id,
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
        },
    });
    return result;
};
exports.findOfferedCourseSection = findOfferedCourseSection;
const editOfferedCourseSection = async (id, payload) => {
    const result = await prisma_1.default.offeredCourseSection.update({
        where: {
            id,
        },
        data: payload,
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
        },
    });
    return result;
};
exports.editOfferedCourseSection = editOfferedCourseSection;
const removeOfferedCourseSection = async (id) => {
    const result = await prisma_1.default.offeredCourseSection.delete({
        where: {
            id,
        },
        include: {
            offeredCourse: {
                include: {
                    course: true,
                },
            },
        },
    });
    return result;
};
exports.removeOfferedCourseSection = removeOfferedCourseSection;
