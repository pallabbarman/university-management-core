/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    createOfferedCourses,
    deleteOfferedCourse,
    getAllOfferedCourses,
    getOfferedCourse,
    updateOfferedCourse,
} from './controller';
import { offeredCourseValidation, updateOfferedCourseValidation } from './validation';

const router = Router();

router.get('/id', getAllOfferedCourses);
router.get('/:id', getOfferedCourse);
router.post(
    '/',
    validateRequest(offeredCourseValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createOfferedCourses
);
router.patch(
    '/:id',
    validateRequest(updateOfferedCourseValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateOfferedCourse
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteOfferedCourse);

const offeredCourseRoutes = router;

export default offeredCourseRoutes;
