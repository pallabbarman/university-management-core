"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDepartment = exports.editDepartment = exports.findDepartment = exports.findAllDepartments = exports.insertDepartment = void 0;
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertDepartment = async (data) => {
    const result = await prisma_1.default.department.create({
        data,
        include: {
            academicFaculty: true,
        },
    });
    return result;
};
exports.insertDepartment = insertDepartment;
const findAllDepartments = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.departmentSearchableFields.map((field) => ({
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
                if (constant_1.departmentRelationalFields.includes(key)) {
                    return {
                        [constant_1.departmentRelationalFieldsMapper[key]]: {
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
    const result = await prisma_1.default.department.findMany({
        include: {
            academicFaculty: true,
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
    const total = await prisma_1.default.department.count({
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
exports.findAllDepartments = findAllDepartments;
const findDepartment = async (id) => {
    const result = await prisma_1.default.department.findUnique({
        where: { id },
        include: {
            academicFaculty: true,
        },
    });
    return result;
};
exports.findDepartment = findDepartment;
const editDepartment = async (id, payload) => {
    const result = await prisma_1.default.department.update({
        where: {
            id,
        },
        data: payload,
        include: {
            academicFaculty: true,
        },
    });
    return result;
};
exports.editDepartment = editDepartment;
const removeDepartment = async (id) => {
    const result = await prisma_1.default.department.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.removeDepartment = removeDepartment;
