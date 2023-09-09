/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    assignCourses,
    createFaculty,
    deleteCourses,
    deleteFaculty,
    getAllFaculties,
    getFaculty,
    updateFaculty,
} from './controller';
import { coursesValidation, facultyValidation, updateFacultyValidation } from './validation';

const router = Router();

router.get('/id', getAllFaculties);
router.get('/:id', getFaculty);
router.post('/', validateRequest(facultyValidation), createFaculty);
router.patch(
    '/:id',
    validateRequest(updateFacultyValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateFaculty
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteFaculty);
router.post(
    '/:id/assign-courses',
    validateRequest(coursesValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    assignCourses
);
router.delete(
    '/:id/remove-courses',
    validateRequest(coursesValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    deleteCourses
);

const departmentRoutes = router;

export default departmentRoutes;
