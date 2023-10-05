/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    getAllStudentEnrolledCourseMarks,
    getMyCourseMarks,
    updateFinalMarks,
    updateStudentMarks,
} from './controller';
import {
    updateStudentCourseFinalMarksValidation,
    updateStudentMarksValidation,
} from './validation';

const router = Router();

router.get('/', auth(USER_ROLE.ADMIN, USER_ROLE.FACULTY), getAllStudentEnrolledCourseMarks);
router.get('/my-marks', auth(USER_ROLE.STUDENT), getMyCourseMarks);
router.patch(
    '/update-marks',
    validateRequest(updateStudentMarksValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.FACULTY),
    updateStudentMarks
);
router.patch(
    '/update-final-marks',
    validateRequest(updateStudentCourseFinalMarksValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.FACULTY),
    updateFinalMarks
);

const studentEnrolledCourseMarkRoutes = router;

export default studentEnrolledCourseMarkRoutes;
