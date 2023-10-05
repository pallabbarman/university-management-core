/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import { createRoom, deleteRoom, getAllRooms, getRoom, updateRoom } from './controller';
import { roomValidation, updateRoomValidation } from './validation';

const router = Router();

router.get('/id', getAllRooms);
router.get('/:id', getRoom);
router.post(
    '/',
    validateRequest(roomValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    createRoom
);
router.patch(
    '/:id',
    validateRequest(updateRoomValidation),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    updateRoom
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteRoom);

const roomRoutes = router;

export default roomRoutes;
