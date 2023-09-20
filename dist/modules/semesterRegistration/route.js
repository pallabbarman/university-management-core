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
router.post('/', (0, validateRequest_1.default)(validation_1.semesterRegistrationValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.createSemesterRegistration);
router.get('/', controller_1.getAllSemesterRegistration);
router.get('/:id', controller_1.getSemesterRegistration);
router.patch('/:id', (0, validateRequest_1.default)(validation_1.updateSemesterRegistrationValidation), (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.updateSemesterRegistration);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.SUPER_ADMIN), controller_1.deleteSemesterRegistration);
router.post('/start-registration', (0, auth_1.default)(user_1.USER_ROLE.STUDENT), controller_1.startMyRegistration);
const semesterRegistrationRoutes = router;
exports.default = semesterRegistrationRoutes;
