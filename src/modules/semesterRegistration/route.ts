/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    createSemesterRegistration,
    deleteSemesterRegistration,
    getAllSemesterRegistration,
    getSemesterRegistration,
    updateSemesterRegistration,
} from './controller';
import { semesterRegistrationValidation, updateSemesterRegistrationValidation } from './validation';

const router = Router();

router.post(
    '/',
    validateRequest(semesterRegistrationValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createSemesterRegistration
);
router.get('/', getAllSemesterRegistration);
router.get('/:id', getSemesterRegistration);
router.patch(
    '/:id',
    validateRequest(updateSemesterRegistrationValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateSemesterRegistration
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteSemesterRegistration);

const semesterRegistrationRoutes = router;

export default semesterRegistrationRoutes;
