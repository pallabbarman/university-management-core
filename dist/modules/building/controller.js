"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBuilding = exports.updateBuilding = exports.getBuilding = exports.getAllBuildings = exports.createBuilding = void 0;
const pagination_1 = __importDefault(require("../../constants/pagination"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../utils/pick"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const constant_1 = require("./constant");
const service_1 = require("./service");
exports.createBuilding = (0, catchAsync_1.default)(async (req, res) => {
    const result = await (0, service_1.insertBuilding)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Building is created successfully!',
        data: result,
    });
});
exports.getAllBuildings = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, constant_1.buildingFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.default);
    const result = await (0, service_1.findAllBuildings)(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Buildings is retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
exports.getBuilding = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.findBuilding)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Building is retrieved successfully!',
        data: result,
    });
});
exports.updateBuilding = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.editBuilding)(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Building is updated successfully!',
        data: result,
    });
});
exports.deleteBuilding = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params?.id;
    const result = await (0, service_1.removeBuilding)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Building deleted successfully!',
        data: result,
    });
});
