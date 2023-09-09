"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOfferedCourseSection = exports.updateOfferedCourseSection = exports.getOfferedCourseSection = exports.getAllOfferedCourseSections = exports.createOfferedCourseSection = void 0;
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.createOfferedCourseSection = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.insertOfferedCourseSection)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course section is created successfully!',
        data: result,
    });
});
exports.getAllOfferedCourseSections = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.offeredCourseSectionFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllOfferedCourseSections)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course sections is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
exports.getOfferedCourseSection = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.findOfferedCourseSection)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course section is retrieved successfully!',
        data: result,
    });
});
exports.updateOfferedCourseSection = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.editOfferedCourseSection)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course section updated successfully!',
        data: result,
    });
});
exports.deleteOfferedCourseSection = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.removeOfferedCourseSection)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Offered course section deleted successfully!',
        data: result,
    });
});
