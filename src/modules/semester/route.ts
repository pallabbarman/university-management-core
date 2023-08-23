import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
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
router.post('/create-semester', validateRequest(semesterValidation), createSemester);
router.patch('/:id', validateRequest(updateSemesterValidation), updateSemester);
router.delete('/:id', deleteSemester);

const semesterRoutes = router;

export default semesterRoutes;
