"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFacultyAvailable = exports.checkRoomAvailable = void 0;
const apiError_1 = __importDefault(require("../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
const hasTimeConflict_1 = require("../../utils/hasTimeConflict");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const checkRoomAvailable = async (data) => {
    const alreadyBookedRoomOnDay = await prisma_1.default.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            room: {
                id: data.roomId,
            },
        },
    });
    const existingSlots = alreadyBookedRoomOnDay.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek,
    }));
    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek,
    };
    if ((0, hasTimeConflict_1.hasTimeConflict)(existingSlots, newSlot)) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, 'Room is already booked!');
    }
};
exports.checkRoomAvailable = checkRoomAvailable;
const checkFacultyAvailable = async (data) => {
    const alreadyFaultyAssigned = await prisma_1.default.offeredCourseClassSchedule.findMany({
        where: {
            dayOfWeek: data.dayOfWeek,
            faculty: {
                id: data.facultyId,
            },
        },
    });
    const existingSlots = alreadyFaultyAssigned.map((schedule) => ({
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        dayOfWeek: schedule.dayOfWeek,
    }));
    const newSlot = {
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek,
    };
    if ((0, hasTimeConflict_1.hasTimeConflict)(existingSlots, newSlot)) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, 'Faculty is already booked!');
    }
};
exports.checkFacultyAvailable = checkFacultyAvailable;
