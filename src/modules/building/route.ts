/* eslint-disable comma-dangle */
import { Router } from 'express';
import auth from 'middlewares/auth';
import validateRequest from 'middlewares/validateRequest';
import { USER_ROLE } from 'types/user';
import {
    createBuilding,
    deleteBuilding,
    getAllBuildings,
    getBuilding,
    updateBuilding,
} from './controller';
import { buildingValidation, updateBuildingValidation } from './validation';

const router = Router();

router.get('/', getAllBuildings);
router.get('/:id', getBuilding);
router.post(
    '/',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(buildingValidation),
    createBuilding
);
router.patch(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(updateBuildingValidation),
    updateBuilding
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), deleteBuilding);

const buildingRoutes = router;

export default buildingRoutes;
