/* eslint-disable comma-dangle */
import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createAcademicFaculty } from './controller';
import { academicFacultyValidation } from './validation';

const router = Router();

router.post(
    '/create-academic-faculty',
    validateRequest(academicFacultyValidation),
    createAcademicFaculty
);

const academicFacultyRoutes = router;

export default academicFacultyRoutes;
