"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSemester = exports.findAllSemesters = exports.insertSemester = void 0;
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertSemester = async (data) => {
    const result = await prisma_1.default.semester.create({
        data,
    });
    return result;
};
exports.insertSemester = insertSemester;
const findAllSemesters = async (filters, options) => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.semesterSearchAbleFields.map((field) => ({
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
    const result = await prisma_1.default.semester.findMany({
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
    const total = await prisma_1.default.semester.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
exports.findAllSemesters = findAllSemesters;
const findSemester = async (id) => {
    const result = await prisma_1.default.semester.findUnique({
        where: {
            id,
        },
    });
    return result;
};
exports.findSemester = findSemester;
