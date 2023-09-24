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
const route_5 = __importDefault(require("../modules/offeredCourse/route"));
const route_6 = __importDefault(require("../modules/offeredCourseClassSchedule/route"));
const route_7 = __importDefault(require("../modules/offeredCourseSection/route"));
const route_8 = __importDefault(require("../modules/room/route"));
const route_9 = __importDefault(require("../modules/semester/route"));
const route_10 = __importDefault(require("../modules/semesterRegistration/route"));
const route_11 = __importDefault(require("../modules/student/route"));
const route_12 = __importDefault(require("../modules/studentEnrolledCourse/route"));
const route_13 = __importDefault(require("../modules/studentEnrolledCourseMark/route"));
const route_14 = __importDefault(require("../modules/studentSemesterPayment/route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/students',
        route: route_11.default,
    },
    {
        path: '/semesters',
        route: route_9.default,
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
        route: route_8.default,
    },
    {
        path: '/courses',
        route: route_3.default,
    },
    {
        path: '/semester-registration',
        route: route_10.default,
    },
    {
        path: '/offered-courses',
        route: route_5.default,
    },
    {
        path: '/offered-course-sections',
        route: route_7.default,
    },
    {
        path: '/offered-course-class-schedules',
        route: route_6.default,
    },
    {
        path: '/student-enrolled-courses',
        route: route_12.default,
    },
    {
        path: '/student-enrolled-course-marks',
        route: route_13.default,
    },
    {
        path: '/student-semester-payments',
        route: route_14.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
