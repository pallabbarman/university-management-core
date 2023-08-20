import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createDepartment, getDepartment } from './controller';
import { departmentValidation } from './validation';

const router = Router();

router.get('/:id', getDepartment);
router.post('/create-department', validateRequest(departmentValidation), createDepartment);

const departmentRoutes = router;

export default departmentRoutes;
