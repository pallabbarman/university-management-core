"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOfferedCourseClassSchedule = exports.updateOfferedCourseClassSchedule = exports.getOfferedCourseClassSchedule = exports.getAllOfferedCourseClassSchedules = exports.createOfferedCourseClassSchedule = void 0;
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.createOfferedCourseClassSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.insertOfferedCourseClassSchedule)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course class schedule created successfully!',
        data: result,
    });
});
exports.getAllOfferedCourseClassSchedules = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.offeredCourseClassScheduleFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllOfferedCourseClassSchedules)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course class schedules is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
exports.getOfferedCourseClassSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.findOfferedCourseClassSchedule)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course class schedule is retrieved successfully!',
        data: result,
    });
});
exports.updateOfferedCourseClassSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.editOfferedCourseClassSchedule)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course class schedule updated successfully!',
        data: result,
    });
});
exports.deleteOfferedCourseClassSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.removeOfferedCourseClassSchedule)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course class schedule deleted successfully!',
        data: result,
    });
});
