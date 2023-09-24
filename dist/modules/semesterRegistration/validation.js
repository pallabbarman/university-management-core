"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollOrWithdrawCourse = exports.updateSemesterRegistrationValidation = exports.semesterRegistrationValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.semesterRegistrationValidation = zod_1.default.object({
    body: zod_1.default.object({
        startDate: zod_1.default.string({
            required_error: 'Start date is required',
        }),
        endDate: zod_1.default.string({
            required_error: 'End date is required',
        }),
        semesterId: zod_1.default.string({
            required_error: 'Semester id is required',
        }),
        minCredit: zod_1.default.number({
            required_error: 'Min credit is required',
        }),
        maxCredit: zod_1.default.number({
            required_error: 'Max credit is required',
        }),
    }),
});
exports.updateSemesterRegistrationValidation = zod_1.default.object({
    body: zod_1.default.object({
        startDate: zod_1.default.string().optional(),
        endDate: zod_1.default.string().optional(),
        semesterId: zod_1.default.string().optional(),
        minCredit: zod_1.default.number().optional(),
        maxCredit: zod_1.default.number().optional(),
        status: zod_1.default
            .enum([...Object.values(client_1.SemesterRegistrationStatus)], {})
            .optional(),
    }),
});
exports.enrollOrWithdrawCourse = zod_1.default.object({
    body: zod_1.default.object({
        offeredCourseId: zod_1.default.string({
            required_error: 'Offered course id is required',
        }),
        offeredCourseSectionId: zod_1.default.string({
            required_error: 'Offered course Section id is required',
        }),
    }),
});
