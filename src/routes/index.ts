import { Router } from 'express';
import academicFacultyRoutes from 'modules/academicFaculty/route';
import departmentRoutes from 'modules/department/route';
import semesterRoutes from 'modules/semester/route';

const router = Router();

const moduleRoutes = [
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
