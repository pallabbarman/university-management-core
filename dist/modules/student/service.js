"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStudent = exports.editStudent = exports.findStudent = exports.findAllStudents = exports.insertStudent = void 0;
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
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
