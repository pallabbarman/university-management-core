/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    deleteStudentEnrolledCourse,
    getAllStudentEnrolledCourses,
    getStudentEnrolledCourse,
    updateStudentEnrolledCourse,
} from './controller';
import { insertStudentEnrolledCourse } from './service';
import {
    studentEnrolledCourseValidation,
    updateStudentEnrolledCourseValidation,
} from './validation';

const router = Router();

router.get('/', getAllStudentEnrolledCourses);
router.get('/:id', getStudentEnrolledCourse);
router.post(
    '/',
    validateRequest(studentEnrolledCourseValidation),
    auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
    insertStudentEnrolledCourse
);
router.patch(
    '/:id',
    validateRequest(updateStudentEnrolledCourseValidation),
    auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
    updateStudentEnrolledCourse
);
router.delete('/:id', auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), deleteStudentEnrolledCourse);

const studentEnrolledCourseRoutes = router;

export default studentEnrolledCourseRoutes;
