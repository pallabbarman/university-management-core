/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    createOfferedCourseClassSchedule,
    deleteOfferedCourseClassSchedule,
    getAllOfferedCourseClassSchedules,
    getOfferedCourseClassSchedule,
    updateOfferedCourseClassSchedule,
} from './controller';
import {
    offeredCourseClassScheduleValidation,
    updateOfferedCourseClassScheduleValidation,
} from './validation';

const router = Router();

router.get('/id', getAllOfferedCourseClassSchedules);
router.get('/:id', getOfferedCourseClassSchedule);
router.post(
    '/',
    validateRequest(offeredCourseClassScheduleValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createOfferedCourseClassSchedule
);
router.patch(
    '/:id',
    validateRequest(updateOfferedCourseClassScheduleValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateOfferedCourseClassSchedule
);
router.delete(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    deleteOfferedCourseClassSchedule
);

const offeredCourseClassScheduleRoutes = router;

export default offeredCourseClassScheduleRoutes;
