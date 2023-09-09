"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOfferedCourseClassSchedule = exports.editOfferedCourseClassSchedule = exports.findOfferedCourseClassSchedule = exports.findAllOfferedCourseClassSchedules = exports.insertOfferedCourseClassSchedule = void 0;
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const utils_1 = require("./utils");
const insertOfferedCourseClassSchedule = async (data) => {
    await (0, utils_1.checkRoomAvailable)(data);
    await (0, utils_1.checkFacultyAvailable)(data);
    const result = await prisma_1.default.offeredCourseClassSchedule.create({
        data,
        include: {
            room: true,
            faculty: true,
            offeredCourseSection: true,
            semesterRegistration: true,
        },
    });
    return result;
};
exports.insertOfferedCourseClassSchedule = insertOfferedCourseClassSchedule;
const findAllOfferedCourseClassSchedules = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.offeredCourseClassScheduleSearchableFields.map((field) => ({
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
                if (constant_1.offeredCourseClassScheduleRelationalFields.includes(key)) {
                    return {
                        [constant_1.offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
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
    const result = await prisma_1.default.offeredCourseClassSchedule.findMany({
        include: {
            room: true,
            faculty: true,
            semesterRegistration: true,
            offeredCourseSection: true,
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
    const total = await prisma_1.default.offeredCourseClassSchedule.count({
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
exports.findAllOfferedCourseClassSchedules = findAllOfferedCourseClassSchedules;
const findOfferedCourseClassSchedule = async (id) => {
    const result = await prisma_1.default.offeredCourseClassSchedule.findUnique({
        where: {
            id,
        },
        include: {
            room: true,
            faculty: true,
            semesterRegistration: true,
            offeredCourseSection: true,
        },
    });
    return result;
};
exports.findOfferedCourseClassSchedule = findOfferedCourseClassSchedule;
const editOfferedCourseClassSchedule = async (id, payload) => {
    const result = await prisma_1.default.offeredCourseClassSchedule.update({
        where: {
            id,
        },
        data: payload,
        include: {
            room: true,
            faculty: true,
            semesterRegistration: true,
            offeredCourseSection: true,
        },
    });
    return result;
};
exports.editOfferedCourseClassSchedule = editOfferedCourseClassSchedule;
const removeOfferedCourseClassSchedule = async (id) => {
    const result = await prisma_1.default.offeredCourseClassSchedule.delete({
        where: {
            id,
        },
        include: {
            room: true,
            faculty: true,
            semesterRegistration: true,
            offeredCourseSection: true,
        },
    });
    return result;
};
exports.removeOfferedCourseClassSchedule = removeOfferedCourseClassSchedule;
