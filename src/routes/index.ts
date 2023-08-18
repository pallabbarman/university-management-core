import { Router } from 'express';
import semesterRoutes from 'modules/semester/route';

const router = Router();

const moduleRoutes = [
    {
        path: '/semesters',
        route: semesterRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
