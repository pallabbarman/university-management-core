import { Router } from 'express';
import academicFacultyRoutes from 'modules/academicFaculty/route';
import buildingRoutes from 'modules/building/route';
import courseRoutes from 'modules/course/route';
import departmentRoutes from 'modules/department/route';
import offeredCourseRoutes from 'modules/offeredCourse/route';
import offeredCourseClassScheduleRoutes from 'modules/offeredCourseClassSchedule/route';
import offeredCourseSectionRoutes from 'modules/offeredCourseSection/route';
import roomRoutes from 'modules/room/route';
import semesterRoutes from 'modules/semester/route';
import semesterRegistrationRoutes from 'modules/semesterRegistration/route';
import studentRoutes from 'modules/student/route';
import studentEnrolledCourseRoutes from 'modules/studentEnrolledCourse/route';
import studentEnrolledCourseMarkRoutes from 'modules/studentEnrolledCourseMark/route';
import studentSemesterPaymentRoutes from 'modules/studentSemesterPayment/route';

const router = Router();

const moduleRoutes = [
    {
        path: '/students',
        route: studentRoutes,
    },
    {
        path: '/semesters',
        route: semesterRoutes,
    },
    {
        path: '/departments',
        route: departmentRoutes,
    },
    {
        path: '/academic-faculties',
        route: academicFacultyRoutes,
    },
    {
        path: '/buildings',
        route: buildingRoutes,
    },
    {
        path: '/rooms',
        route: roomRoutes,
    },
    {
        path: '/courses',
        route: courseRoutes,
    },
    {
        path: '/semester-registration',
        route: semesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: offeredCourseRoutes,
    },
    {
        path: '/offered-course-sections',
        route: offeredCourseSectionRoutes,
    },
    {
        path: '/offered-course-class-schedules',
        route: offeredCourseClassScheduleRoutes,
    },
    {
        path: '/student-enrolled-courses',
        route: studentEnrolledCourseRoutes,
    },
    {
        path: '/student-enrolled-course-marks',
        route: studentEnrolledCourseMarkRoutes,
    },
    {
        path: '/student-semester-payments',
        route: studentSemesterPaymentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
