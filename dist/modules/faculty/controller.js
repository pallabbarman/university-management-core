"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCourseStudents = exports.myCourses = exports.deleteCourses = exports.assignCourses = exports.deleteFaculty = exports.updateFaculty = exports.getFaculty = exports.getAllFaculties = exports.createFaculty = void 0;
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.createFaculty = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.insertFaculty)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Faculty created successfully!',
        data: result,
    });
});
exports.getAllFaculties = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.facultyFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllFaculties)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Faculties is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
exports.getFaculty = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.findFaculty)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Faculty is retrieved successfully!',
        data: result,
    });
});
exports.updateFaculty = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.editFaculty)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Faculty is updated successfully!',
        data: result,
    });
});
exports.deleteFaculty = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.removeFaculty)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Faculty deleted successfully!',
        data: result,
    });
});
exports.assignCourses = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.setCourses)(id, req.body?.courses);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course faculty assigned successfully!',
        data: result,
    });
});
exports.deleteCourses = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.removeCourses)(id, req.body?.courses);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course faculty deleted successfully!',
        data: result,
    });
});
exports.myCourses = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const filter = (0, pick_1.default)(req.query, ['academicSemesterId', 'courseId']);
    const result = await (0, service_1.findMyCourses)(user, filter);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My courses data fetched successfully!',
        data: result,
    });
});
exports.getMyCourseStudents = (0, catchAsync_1.default)(async (req, res) => {
    const { user } = req;
    const filters = (0, pick_1.default)(req.query, ['academicSemesterId', 'courseId', 'offeredCourseSectionId']);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findMyCourseStudents)(filters, options, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Faculty course students fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
