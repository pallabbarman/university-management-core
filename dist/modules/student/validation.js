"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentValidation = exports.studentValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.studentValidation = zod_1.default.object({
    body: zod_1.default.object({
        studentId: zod_1.default.string({
            required_error: 'Student id is required!',
        }),
        firstName: zod_1.default.string({
            required_error: 'First name is required!',
        }),
        lastName: zod_1.default.string({
            required_error: 'Last name is required!',
        }),
        middleName: zod_1.default.string({
            required_error: 'Middle name is required!',
        }),
        profileImage: zod_1.default.string({
            required_error: 'Profile image is required!',
        }),
        email: zod_1.default.string({
            required_error: 'Email is required!',
        }),
        contactNo: zod_1.default.string({
            required_error: 'Contact no is required!',
        }),
        gender: zod_1.default.string({
            required_error: 'Gender is required!',
        }),
        bloodGroup: zod_1.default.string({
            required_error: 'Blood group is required!',
        }),
        semesterId: zod_1.default.string({
            required_error: 'Semester is required!',
        }),
        departmentId: zod_1.default.string({
            required_error: 'Department is required',
        }),
        academicFacultyId: zod_1.default.string({
            required_error: 'Academic faculty is required',
        }),
    }),
});
exports.updateStudentValidation = zod_1.default.object({
    body: zod_1.default.object({
        studentId: zod_1.default.string().optional(),
        firstName: zod_1.default.string().optional(),
        lastName: zod_1.default.string().optional(),
        middleName: zod_1.default.string().optional(),
        profileImage: zod_1.default.string().optional(),
        email: zod_1.default.string().optional(),
        contactNo: zod_1.default.string().optional(),
        gender: zod_1.default.string().optional(),
        bloodGroup: zod_1.default.string().optional(),
        semesterId: zod_1.default.string().optional(),
        departmentId: zod_1.default.string().optional(),
        academicFacultyId: zod_1.default.string().optional(),
    }),
});
