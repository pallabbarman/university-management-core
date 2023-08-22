/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    createStudent,
    deleteStudent,
    getAllStudents,
    getStudent,
    updateStudent,
} from './controller';
import { studentValidation, updateStudentValidation } from './validation';

const router = Router();

router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post(
    '/create-student',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(studentValidation),
    createStudent
);
router.patch(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(updateStudentValidation),
    updateStudent
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteStudent);

const studentRoutes = router;

export default studentRoutes;
