"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDepartment = exports.insertDepartment = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
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
