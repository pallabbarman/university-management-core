"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myAcademicInfo = exports.getMyCourseSchedules = exports.myCourses = exports.deleteStudent = exports.updateStudent = exports.getStudent = exports.getAllStudents = exports.createStudent = void 0;
/* eslint-disable object-curly-newline */
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.createStudent = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.insertStudent)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student created successfully!',
        data: result,
    });
});
exports.getAllStudents = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.studentFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllStudents)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Students is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
exports.getStudent = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.findStudent)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student is retrieved successfully!',
        data: result,
    });
});
exports.updateStudent = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.editStudent)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student is updated successfully!',
        data: result,
    });
});
exports.deleteStudent = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.removeStudent)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student is deleted successfully!',
        data: result,
    });
});
exports.myCourses = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const filter = (0, pick_1.default)(req.query, ['courseId', 'semesterId']);
    const result = await (0, service_1.findMyCourses)(user.userId, filter);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Courses data fetched successfully',
        data: result,
    });
});
exports.getMyCourseSchedules = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const filter = (0, pick_1.default)(req.query, ['courseId', 'semesterId']);
    const result = await (0, service_1.findMyCourseSchedules)(user.userId, filter);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course Schedules data fetched successfully',
        data: result,
    });
});
exports.myAcademicInfo = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const result = await (0, service_1.findMyAcademicInfo)(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Academic Info data fetched successfully',
        data: result,
    });
});
