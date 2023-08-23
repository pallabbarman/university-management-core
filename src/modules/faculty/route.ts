import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import {
    createFaculty,
    deleteFaculty,
    getAllFaculties,
    getFaculty,
    updateFaculty,
} from './controller';
import { facultyValidation, updateFacultyValidation } from './validation';

const router = Router();

router.get('/id', getAllFaculties);
router.get('/:id', getFaculty);
router.post('/create-faculty', validateRequest(facultyValidation), createFaculty);
router.patch('/:id', validateRequest(updateFacultyValidation), updateFaculty);
router.delete('/:id', deleteFaculty);

const departmentRoutes = router;

export default departmentRoutes;
