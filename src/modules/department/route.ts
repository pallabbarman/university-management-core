/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
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
router.post(
    '/',
    validateRequest(departmentValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createDepartment
);
router.patch(
    '/:id',
    validateRequest(updateDepartmentValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateDepartment
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteDepartment);

const departmentRoutes = router;

export default departmentRoutes;
