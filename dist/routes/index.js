"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../modules/academicFaculty/route"));
const route_2 = __importDefault(require("../modules/building/route"));
const route_3 = __importDefault(require("../modules/department/route"));
const route_4 = __importDefault(require("../modules/semester/route"));
const route_5 = __importDefault(require("../modules/student/route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/students',
        route: route_5.default,
    },
    {
        path: '/semesters',
        route: route_4.default,
    },
    {
        path: '/departments',
        route: route_3.default,
    },
    {
        path: '/academic-faculties',
        route: route_1.default,
    },
    {
        path: '/buildings',
        route: route_2.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
