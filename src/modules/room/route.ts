/* eslint-disable object-curly-newline */
import { Router } from 'express';
import validateRequest from 'middlewares/validateRequest';
import { createRoom, deleteRoom, getAllRooms, getRoom, updateRoom } from './controller';
import { roomValidation, updateRoomValidation } from './validation';

const router = Router();

router.get('/id', getAllRooms);
router.get('/:id', getRoom);
router.post('/create-room', validateRequest(roomValidation), createRoom);
router.patch('/:id', validateRequest(updateRoomValidation), updateRoom);
router.delete('/:id', deleteRoom);

const roomRoutes = router;

export default roomRoutes;
