/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    createOfferedCourseSection,
    deleteOfferedCourseSection,
    getAllOfferedCourseSections,
    getOfferedCourseSection,
    updateOfferedCourseSection,
} from './controller';
import { offeredCourseSectionValidation, updateOfferedCourseSectionValidation } from './validation';

const router = Router();

router.get('/id', getAllOfferedCourseSections);
router.get('/:id', getOfferedCourseSection);
router.post(
    '/',
    validateRequest(offeredCourseSectionValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createOfferedCourseSection
);
router.patch(
    '/:id',
    validateRequest(updateOfferedCourseSectionValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateOfferedCourseSection
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteOfferedCourseSection);

const offeredCourseSectionRoutes = router;

export default offeredCourseSectionRoutes;
