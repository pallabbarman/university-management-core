"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.getRoom = exports.getAllRooms = exports.createRoom = void 0;
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.createRoom = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.insertRoom)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Room created successfully!',
        data: result,
    });
});
exports.getAllRooms = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.roomFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllRooms)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Rooms is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
exports.getRoom = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.findRoom)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Room is retrieved successfully!',
        data: result,
    });
});
exports.updateRoom = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.editRoom)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Room is updated successfully!',
        data: result,
    });
});
exports.deleteRoom = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.removeRoom)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Room deleted successfully!',
        data: result,
    });
});
