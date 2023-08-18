import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createSemester, getAllSemesters } from './controller';
import { semesterValidation } from './validation';

const router = Router();

router.get('/', getAllSemesters);
router.post('/create-semester', validateRequest(semesterValidation), createSemester);

export default router;
