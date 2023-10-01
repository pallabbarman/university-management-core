/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    createSemester,
    deleteSemester,
    getAllSemesters,
    getSemester,
    updateSemester,
} from './controller';
import { semesterValidation, updateSemesterValidation } from './validation';

const router = Router();

router.get('/', getAllSemesters);
router.get('/:id', getSemester);
router.post(
    '/',
    validateRequest(semesterValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createSemester
);
router.patch(
    '/:id',
    validateRequest(updateSemesterValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateSemester
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteSemester);

const semesterRoutes = router;

export default semesterRoutes;
