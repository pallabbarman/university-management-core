"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferedCourseClassScheduleValidation = exports.offeredCourseClassScheduleValidation = void 0;
/* eslint-disable comma-dangle */
const constant_1 = require("../offeredCourseSection/constant");
const zod_1 = require("zod");
const timeStringSchema = zod_1.z.string().refine((time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // example: 09:45, 21:30
    return regex.test(time);
}, {
    message: "Invalid time format, expected 'HH:MM' in 24-hour format",
});
exports.offeredCourseClassScheduleValidation = zod_1.z
    .object({
    body: zod_1.z.object({
        dayOfWeek: zod_1.z.enum([...constant_1.daysInWeek], {
            required_error: 'Day of week is required',
        }),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
        roomId: zod_1.z.string({
            required_error: 'Room id is required',
        }),
        facultyId: zod_1.z.string({
            required_error: 'Faculty id is required',
        }),
        offeredCourseSectionId: zod_1.z.string({
            required_error: 'Section id is required',
        }),
    }),
})
    .refine(({ body }) => {
    const start = new Date(`1970-01-01T${body.startTime}:00`);
    const end = new Date(`1970-01-01T${body.endTime}:00`);
    return start < end;
}, {
    message: 'Start time must be before end time',
});
exports.updateOfferedCourseClassScheduleValidation = zod_1.z.object({
    body: zod_1.z.object({
        roomId: zod_1.z.string().optional(),
        facultyId: zod_1.z.string().optional(),
        offeredCourseSectionId: zod_1.z.string().optional(),
    }),
});
