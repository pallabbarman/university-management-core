"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBuilding = exports.editBuilding = exports.findBuilding = exports.findAllBuildings = exports.insertBuilding = void 0;
const pagination_1 = __importDefault(require("../../utils/pagination"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const constant_1 = require("./constant");
const insertBuilding = async (data) => {
    const result = await prisma_1.default.building.create({
        data,
    });
    return result;
};
exports.insertBuilding = insertBuilding;
const findAllBuildings = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = (0, pagination_1.default)(options);
    const { searchTerm } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: constant_1.buildingSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.building.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? { [sortBy]: sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = await prisma_1.default.building.count({
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
exports.findAllBuildings = findAllBuildings;
const findBuilding = async (id) => {
    const result = await prisma_1.default.building.findUnique({
        where: { id },
    });
    return result;
};
exports.findBuilding = findBuilding;
const editBuilding = async (id, payload) => {
    const result = await prisma_1.default.building.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};
exports.editBuilding = editBuilding;
const removeBuilding = async (id) => {
    const result = await prisma_1.default.building.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.removeBuilding = removeBuilding;
