import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createSemester, getAllSemesters, getSemester } from './controller';
import { semesterValidation } from './validation';

const router = Router();

router.get('/', getAllSemesters);
router.get('/:id', getSemester);
router.post('/create-semester', validateRequest(semesterValidation), createSemester);

const semesterRoutes = router;

export default semesterRoutes;
