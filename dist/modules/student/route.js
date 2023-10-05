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
router.get('/', controller_1.getAllStudents);
router.get('/:id', controller_1.getStudent);
router.get('/my-courses', (0, auth_1.default)(user_1.USER_ROLE.STUDENT), controller_1.myCourses);
router.get('/my-course-schedules', (0, auth_1.default)(user_1.USER_ROLE.STUDENT), controller_1.getMyCourseSchedules);
router.get('/my-academic-info', (0, auth_1.default)(user_1.USER_ROLE.STUDENT), controller_1.myAcademicInfo);
router.post('/create-student', (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(validation_1.studentValidation), controller_1.createStudent);
router.patch('/:id', (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(validation_1.updateStudentValidation), controller_1.updateStudent);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.deleteStudent);
const studentRoutes = router;
exports.default = studentRoutes;
