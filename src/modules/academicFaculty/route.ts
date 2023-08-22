/* eslint-disable comma-dangle */
import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createAcademicFaculty, getAcademicFaculty, getAllAcademicFaculties } from './controller';
import { academicFacultyValidation } from './validation';

const router = Router();

router.get('/', getAllAcademicFaculties);
router.get('/:id', getAcademicFaculty);
router.post(
    '/create-academic-faculty',
    validateRequest(academicFacultyValidation),
    createAcademicFaculty
);

const academicFacultyRoutes = router;

export default academicFacultyRoutes;
