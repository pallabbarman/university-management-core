"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAcademicFaculty = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const insertAcademicFaculty = async (data) => {
    const result = await prisma_1.default.academicFaculty.create({
        data,
    });
    return result;
};
exports.insertAcademicFaculty = insertAcademicFaculty;
