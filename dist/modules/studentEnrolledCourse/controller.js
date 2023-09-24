"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudentEnrolledCourse = exports.updateStudentEnrolledCourse = exports.getStudentEnrolledCourse = exports.getAllStudentEnrolledCourses = exports.createStudentEnrolledCourse = void 0;
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.createStudentEnrolledCourse = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.insertStudentEnrolledCourse)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Course created successfully',
        data: result,
    });
});
exports.getAllStudentEnrolledCourses = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.studentEnrolledCourseFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllStudentEnrolledCourses)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Courses fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
exports.getStudentEnrolledCourse = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await (0, service_1.findStudentEnrolledCourse)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Course fetched successfully',
        data: result,
    });
});
exports.updateStudentEnrolledCourse = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await (0, service_1.editStudentEnrolledCourse)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Course updated successfully',
        data: result,
    });
});
exports.deleteStudentEnrolledCourse = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await (0, service_1.removeStudentEnrolledCourse)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Enrolled Course deleted successfully',
        data: result,
    });
});
