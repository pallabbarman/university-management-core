import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createStudent, getAllStudents, getStudent } from './controller';
import { studentValidation } from './validation';

const router = Router();

router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/create-student', validateRequest(studentValidation), createStudent);

const studentRoutes = router;

export default studentRoutes;
