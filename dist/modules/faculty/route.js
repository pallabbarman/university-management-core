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
router.get('/id', controller_1.getAllFaculties);
router.get('/:id', controller_1.getFaculty);
router.post('/', (0, validateRequest_1.default)(validation_1.facultyValidation), controller_1.createFaculty);
router.patch('/:id', (0, validateRequest_1.default)(validation_1.updateFacultyValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.updateFaculty);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.deleteFaculty);
router.post('/:id/assign-courses', (0, validateRequest_1.default)(validation_1.coursesValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.assignCourses);
router.delete('/:id/remove-courses', (0, validateRequest_1.default)(validation_1.coursesValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.deleteCourses);
const departmentRoutes = router;
exports.default = departmentRoutes;
