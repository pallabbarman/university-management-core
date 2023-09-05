"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../modules/academicFaculty/route"));
const route_2 = __importDefault(require("../modules/building/route"));
const route_3 = __importDefault(require("../modules/course/route"));
const route_4 = __importDefault(require("../modules/department/route"));
const route_5 = __importDefault(require("../modules/room/route"));
const route_6 = __importDefault(require("../modules/semester/route"));
const route_7 = __importDefault(require("../modules/semesterRegistration/route"));
const route_8 = __importDefault(require("../modules/student/route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/students',
        route: route_8.default,
    },
    {
        path: '/semesters',
        route: route_6.default,
    },
    {
        path: '/departments',
        route: route_4.default,
    },
    {
        path: '/academic-faculties',
        route: route_1.default,
    },
    {
        path: '/buildings',
        route: route_2.default,
    },
    {
        path: '/rooms',
        route: route_5.default,
    },
    {
        path: '/courses',
        route: route_3.default,
    },
    {
        path: '/semester-registration',
        route: route_7.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
