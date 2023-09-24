"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../types/user");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_1.USER_ROLE.ADMIN, user_1.USER_ROLE.FACULTY), controller_1.getAllStudentSemesterPayments);
const studentSemesterPaymentRoutes = router;
exports.default = studentSemesterPaymentRoutes;
