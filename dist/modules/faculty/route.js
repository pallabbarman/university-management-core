"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const router = (0, express_1.Router)();
router.get('/id', controller_1.getAllFaculties);
router.get('/:id', controller_1.getFaculty);
router.post('/create-faculty', (0, validateRequest_1.default)(validation_1.facultyValidation), controller_1.createFaculty);
const departmentRoutes = router;
exports.default = departmentRoutes;
