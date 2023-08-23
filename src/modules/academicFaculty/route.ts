/* eslint-disable comma-dangle */
import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
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
    '/create-academic-faculty',
    validateRequest(academicFacultyValidation),
    createAcademicFaculty
);
router.patch('/:id', validateRequest(updateAcademicFacultyValidation), updateAcademicFaculty);
router.delete('/:id', deleteAcademicFaculty);

const academicFacultyRoutes = router;

export default academicFacultyRoutes;
