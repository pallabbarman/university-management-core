"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCourseMarks = exports.updateFinalMarks = exports.updateStudentMarks = exports.getAllStudentEnrolledCourseMarks = void 0;
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.getAllStudentEnrolledCourseMarks = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.studentEnrolledCourseMarkFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllStudentEnrolledCourseMarks)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student course marks fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
exports.updateStudentMarks = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.editStudentMarks)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Marks updated!',
        data: result,
    });
});
exports.updateFinalMarks = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.editFinalMarks)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Final marks updated!',
        data: result,
    });
});
exports.getMyCourseMarks = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.studentEnrolledCourseMarkFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const { user } = req;
    const result = await (0, service_1.findMyCourseMarks)(filters, options, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student course marks fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
