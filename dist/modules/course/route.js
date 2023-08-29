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
router.get('/', controller_1.getAllCourses);
router.get('/:id', controller_1.getCourse);
router.post('/create-course', (0, validateRequest_1.default)(validation_1.courseValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.createCourse);
router.patch('/:id', (0, validateRequest_1.default)(validation_1.updateCourseValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.updateCourse);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.deleteCourse);
router.post('/:id/assign-faculties', (0, validateRequest_1.default)(validation_1.facultiesValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.assignFaculties);
router.delete('/:id/remove-faculties', (0, validateRequest_1.default)(validation_1.facultiesValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.deleteFaculties);
const courseRoutes = router;
exports.default = courseRoutes;
