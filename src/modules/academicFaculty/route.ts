/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    createAcademicFaculty,
    deleteAcademicFaculty,
    getAcademicFaculty,
    getAllAcademicFaculties,
    updateAcademicFaculty,
} from './controller';
import { academicFacultyValidation, updateAcademicFacultyValidation } from './validation';

const router = Router();

router.get('/', getAllAcademicFaculties);
router.get('/:id', getAcademicFaculty);
router.post(
    '/',
    validateRequest(academicFacultyValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createAcademicFaculty
);
router.patch(
    '/:id',
    validateRequest(updateAcademicFacultyValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateAcademicFaculty
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteAcademicFaculty);

const academicFacultyRoutes = router;

export default academicFacultyRoutes;
