"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllStudentSemesterPayments = exports.insertSemesterPayment = void 0;
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertSemesterPayment = async (prismaClient, payload) => {
    const isExist = await prismaClient.studentSemesterPayment.findFirst({
        where: {
            student: {
                id: payload.studentId,
            },
            semester: {
                id: payload.semesterId,
            },
        },
    });
    if (!isExist) {
        const dataToInsert = {
            studentId: payload.studentId,
            semesterId: payload.semesterId,
            fullPaymentAmount: payload.totalPaymentAmount,
            partialPaymentAmount: payload.totalPaymentAmount * 0.5,
            totalDueAmount: payload.totalPaymentAmount,
            totalPaidAmount: 0,
        };
        await prismaClient.studentSemesterPayment.create({
            data: dataToInsert,
        });
    }
};
exports.insertSemesterPayment = insertSemesterPayment;
const findAllStudentSemesterPayments = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.studentSemesterPaymentSearchableFields.map((field) => ({
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
                if (constant_1.studentSemesterPaymentRelationalFields.includes(key)) {
                    return {
                        [constant_1.studentSemesterPaymentRelationalFieldsMapper[key]]: {
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
    const result = await prisma_1.default.studentSemesterPayment.findMany({
        include: {
            semester: true,
            student: true,
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
    const total = await prisma_1.default.studentSemesterPayment.count({
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
exports.findAllStudentSemesterPayments = findAllStudentSemesterPayments;
