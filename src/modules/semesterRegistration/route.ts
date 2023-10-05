/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    confirmMyRegistration,
    createSemesterRegistration,
    deleteSemesterRegistration,
    enrollIntoCourse,
    getAllSemesterRegistration,
    getMyRegistration,
    getMySemesterRegCourses,
    getSemesterRegistration,
    startMyRegistration,
    startNewSemester,
    updateSemesterRegistration,
    withdrawFromCourse,
} from './controller';
import {
    enrollOrWithdrawCourse,
    semesterRegistrationValidation,
    updateSemesterRegistrationValidation,
} from './validation';

const router = Router();

router.post(
    '/',
    validateRequest(semesterRegistrationValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createSemesterRegistration
);
router.get('/', getAllSemesterRegistration);
router.get('/:id', getSemesterRegistration);
router.get('/get-my-registration', auth(USER_ROLE.STUDENT), getMyRegistration);
router.get('/get-my-semester-courses', auth(USER_ROLE.STUDENT), getMySemesterRegCourses);
router.patch(
    '/:id',
    validateRequest(updateSemesterRegistrationValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateSemesterRegistration
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteSemesterRegistration);
router.post('/start-registration', auth(USER_ROLE.STUDENT), startMyRegistration);
router.post(
    '/enroll-into-course',
    validateRequest(enrollOrWithdrawCourse),
    auth(USER_ROLE.STUDENT),
    enrollIntoCourse
);
router.post(
    '/withdraw-from-course',
    validateRequest(enrollOrWithdrawCourse),
    auth(USER_ROLE.STUDENT),
    withdrawFromCourse
);
router.post('/confirm-my-registration', auth(USER_ROLE.STUDENT), confirmMyRegistration);
router.post('/:id/start-new-semester', auth(USER_ROLE.ADMIN), startNewSemester);

const semesterRegistrationRoutes = router;

export default semesterRegistrationRoutes;
