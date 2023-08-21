import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createFaculty, getAllFaculties, getFaculty } from './controller';
import { facultyValidation } from './validation';

const router = Router();

router.get('/id', getAllFaculties);
router.get('/:id', getFaculty);
router.post('/create-faculty', validateRequest(facultyValidation), createFaculty);

const departmentRoutes = router;

export default departmentRoutes;
