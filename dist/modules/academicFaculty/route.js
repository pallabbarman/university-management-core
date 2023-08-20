"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const router = (0, express_1.Router)();
router.post('/create-academic-faculty', (0, validateRequest_1.default)(validation_1.academicFacultyValidation), controller_1.createAcademicFaculty);
const academicFacultyRoutes = router;
exports.default = academicFacultyRoutes;