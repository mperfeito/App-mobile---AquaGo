import {Router} from 'express';
import { registerWaterPoint, listAllWaterPoints, deleteWaterPoint, getTheLocation } from '../controllers/waterPointsControllers';

const router = Router();

router.post('/', registerWaterPoint);
router.get('/', listAllWaterPoints);
router.delete('/:id', deleteWaterPoint);
router.get('/:id', getTheLocation)

module.exports = router;