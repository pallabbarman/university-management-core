"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyValidation = void 0;
/* eslint-disable import/prefer-default-export */
const zod_1 = __importDefault(require("zod"));
exports.facultyValidation = zod_1.default.object({
    body: zod_1.default.object({
        facultyId: zod_1.default.string({
            required_error: 'Faculty id is required!',
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
        designation: zod_1.default.string({
            required_error: 'Designation is required!',
        }),
        departmentId: zod_1.default.string({
            required_error: 'Department is required!',
        }),
        academicFacultyId: zod_1.default.string({
            required_error: 'Academic faculty is required!',
        }),
    }),
});
