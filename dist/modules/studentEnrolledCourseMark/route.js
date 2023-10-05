"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_1 = require("../../types/user");
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.FACULTY), controller_1.getAllStudentEnrolledCourseMarks);
router.get('/my-marks', (0, auth_1.default)(user_1.USER_ROLE.STUDENT), controller_1.getMyCourseMarks);
router.patch('/update-marks', (0, validateRequest_1.default)(validation_1.updateStudentMarksValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.FACULTY), controller_1.updateStudentMarks);
router.patch('/update-final-marks', (0, validateRequest_1.default)(validation_1.updateStudentCourseFinalMarksValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.FACULTY), controller_1.updateFinalMarks);
const studentEnrolledCourseMarkRoutes = router;
exports.default = studentEnrolledCourseMarkRoutes;
