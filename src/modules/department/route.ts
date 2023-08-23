import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import {
    createDepartment,
    deleteDepartment,
    getAllDepartments,
    getDepartment,
    updateDepartment,
} from './controller';
import { departmentValidation, updateDepartmentValidation } from './validation';

const router = Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartment);
router.post('/create-department', validateRequest(departmentValidation), createDepartment);
router.patch('/:id', validateRequest(updateDepartmentValidation), updateDepartment);
router.delete('/:id', deleteDepartment);

const departmentRoutes = router;

export default departmentRoutes;
