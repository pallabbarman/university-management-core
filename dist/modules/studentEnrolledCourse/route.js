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
const service_1 = require("./service");
const validation_1 = require("./validation");
const router = (0, express_1.Router)();
router.get('/', controller_1.getAllStudentEnrolledCourses);
router.get('/:id', controller_1.getStudentEnrolledCourse);
router.post('/', (0, validateRequest_1.default)(validation_1.studentEnrolledCourseValidation), (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN), service_1.insertStudentEnrolledCourse);
router.patch('/:id', (0, validateRequest_1.default)(validation_1.updateStudentEnrolledCourseValidation), (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN), controller_1.updateStudentEnrolledCourse);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLE.SUPER_ADMIN, user_1.USER_ROLE.ADMIN), controller_1.deleteStudentEnrolledCourse);
const studentEnrolledCourseRoutes = router;
exports.default = studentEnrolledCourseRoutes;
