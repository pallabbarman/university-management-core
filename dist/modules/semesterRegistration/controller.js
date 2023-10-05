"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySemesterRegCourses = exports.startNewSemester = exports.getMyRegistration = exports.confirmMyRegistration = exports.withdrawFromCourse = exports.enrollIntoCourse = exports.startMyRegistration = exports.deleteSemesterRegistration = exports.updateSemesterRegistration = exports.getSemesterRegistration = exports.getAllSemesterRegistration = exports.createSemesterRegistration = void 0;
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.createSemesterRegistration = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.insertSemesterRegistration)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration is created successfully!',
        data: result,
    });
});
exports.getAllSemesterRegistration = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.semesterRegistrationFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllSemesterRegistration)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registrations is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
exports.getSemesterRegistration = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.findSemesterRegistration)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration is retrieved successfully!',
        data: result,
    });
});
exports.updateSemesterRegistration = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.editSemesterRegistration)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration updated successfully!',
        data: result,
    });
});
exports.deleteSemesterRegistration = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.removeSemesterRegistration)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Registration deleted successfully!',
        data: result,
    });
});
exports.startMyRegistration = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const result = await (0, service_1.beginMyRegistration)(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student semester registration started successfully',
        data: result,
    });
});
exports.enrollIntoCourse = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const result = await (0, service_1.joinIntoCourse)(user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student semester registration course enrolled successfully',
        data: result,
    });
});
exports.withdrawFromCourse = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const result = await (0, service_1.drawOutFromCourse)(user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student Withdraw from successfully',
        data: result,
    });
});
exports.confirmMyRegistration = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const result = await (0, service_1.verifyMyRegistration)(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Confirm your registration!',
        data: result,
    });
});
exports.getMyRegistration = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const result = await (0, service_1.findMyRegistration)(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My registration data fetched!',
        data: result,
    });
});
exports.startNewSemester = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await (0, service_1.beginNewSemester)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Semester Started Successfully!',
        data: result,
    });
});
exports.getMySemesterRegCourses = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const result = await (0, service_1.findMySemesterRegCourses)(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My registration courses data fetched!',
        data: result,
    });
});
