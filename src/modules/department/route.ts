import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createDepartment, getAllDepartments, getDepartment } from './controller';
import { departmentValidation } from './validation';

const router = Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartment);
router.post('/create-department', validateRequest(departmentValidation), createDepartment);

const departmentRoutes = router;

export default departmentRoutes;
