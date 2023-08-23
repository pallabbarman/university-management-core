"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSemesterValidation = exports.semesterValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.semesterValidation = zod_1.default.object({
    body: zod_1.default.object({
        year: zod_1.default.number({
            required_error: 'Year is required!',
        }),
        title: zod_1.default.string({
            required_error: 'Title is required!',
        }),
        code: zod_1.default.string({
            required_error: 'Code is required!',
        }),
        startMonth: zod_1.default.string({
            required_error: 'Start month is required!',
        }),
        endMonth: zod_1.default.string({
            required_error: 'End month is required!',
        }),
    }),
});
exports.updateSemesterValidation = zod_1.default.object({
    body: zod_1.default.object({
        year: zod_1.default.number().optional(),
        title: zod_1.default.string().optional(),
        code: zod_1.default.string().optional(),
        startMonth: zod_1.default.string().optional(),
        endMonth: zod_1.default.string().optional(),
    }),
});
