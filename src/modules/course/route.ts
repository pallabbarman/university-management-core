/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    assignFaculties,
    createCourse,
    deleteCourse,
    deleteFaculties,
    getAllCourses,
    getCourse,
    updateCourse,
} from './controller';
import { courseValidation, facultiesValidation, updateCourseValidation } from './validation';

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
router.post(
    '/:id/assign-faculties',
    validateRequest(facultiesValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    assignFaculties
);
router.delete(
    '/:id/remove-faculties',
    validateRequest(facultiesValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    deleteFaculties
);

const courseRoutes = router;

export default courseRoutes;
