import { Router } from 'express';
import academicFacultyRoutes from 'modules/academicFaculty/route';
import buildingRoutes from 'modules/building/route';
import departmentRoutes from 'modules/department/route';
import semesterRoutes from 'modules/semester/route';
import studentRoutes from 'modules/student/route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
