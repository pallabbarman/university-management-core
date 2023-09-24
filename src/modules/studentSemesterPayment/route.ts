import { Router } from 'express';
import auth from 'middlewares/auth';
import { USER_ROLE } from 'types/user';
import { getAllStudentSemesterPayments } from './controller';

const router = Router();

router.get('/', auth(USER_ROLE.ADMIN, USER_ROLE.FACULTY), getAllStudentSemesterPayments);

const studentSemesterPaymentRoutes = router;

export default studentSemesterPaymentRoutes;
