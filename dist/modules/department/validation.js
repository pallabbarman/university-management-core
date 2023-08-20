"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentValidation = void 0;
/* eslint-disable import/prefer-default-export */
const zod_1 = __importDefault(require("zod"));
exports.departmentValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string({
            required_error: 'Title is required!',
        }),
        academicFacultyId: zod_1.default.string({
            required_error: 'Academic faculty id is required!',
        }),
    }),
});
