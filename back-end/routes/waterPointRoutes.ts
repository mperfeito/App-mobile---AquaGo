import {Router} from 'express';
import { registerWaterPoint, listAllWaterPoints, deleteWaterPoint } from '../controllers/waterPointsControllers';

const router = Router();

router.post('/', registerWaterPoint);
router.get('/', listAllWaterPoints);
router.delete('/:id', deleteWaterPoint);

module.exports = router;