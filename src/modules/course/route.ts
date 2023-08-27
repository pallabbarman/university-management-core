/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse } from './controller';
import { courseValidation, updateCourseValidation } from './validation';

const router = Router();

router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.post(
    '/create-course',
    validateRequest(courseValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createCourse
);
router.patch(
    '/:id',
    validateRequest(updateCourseValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateCourse
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteCourse);

const courseRoutes = router;

export default courseRoutes;
