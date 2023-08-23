"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDepartmentValidation = exports.departmentValidation = void 0;
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
exports.updateDepartmentValidation = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().optional(),
        academicFacultyId: zod_1.default.string().optional(),
    }),
});
