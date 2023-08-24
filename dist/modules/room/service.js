"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRoom = exports.editRoom = exports.findRoom = exports.findAllRooms = exports.insertRoom = void 0;
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertRoom = async (data) => {
    const result = await prisma_1.default.room.create({
        data,
        include: {
            building: true,
        },
    });
    return result;
};
exports.insertRoom = insertRoom;
const findAllRooms = async (filters, options) => {
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.roomSearchableFields.map((field) => ({
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
                if (constant_1.roomRelationalFields.includes(key)) {
                    return {
                        [constant_1.roomRelationalFieldsMapper[key]]: {
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
    const result = await prisma_1.default.room.findMany({
        include: {
            building: true,
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
    const total = await prisma_1.default.room.count({
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
exports.findAllRooms = findAllRooms;
const findRoom = async (id) => {
    const result = await prisma_1.default.room.findUnique({
        where: {
            id,
        },
        include: {
            building: true,
        },
    });
    return result;
};
exports.findRoom = findRoom;
const editRoom = async (id, payload) => {
    const result = await prisma_1.default.room.update({
        where: {
            id,
        },
        data: payload,
        include: {
            building: true,
        },
    });
    return result;
};
exports.editRoom = editRoom;
const removeRoom = async (id) => {
    const result = await prisma_1.default.room.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.removeRoom = removeRoom;
