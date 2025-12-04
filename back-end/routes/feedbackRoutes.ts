import {Router} from 'express';
import {registerFeedback, ListOfAllFeedbacks, feedbackByWaterPoints} from '../controllers/feedbackControllers';

const router = Router();

router.post('/:user_email/:waterPoint_id', registerFeedback);
router.get('/', ListOfAllFeedbacks);
router.get('/:waterPoint_id', feedbackByWaterPoints);

module.exports = router;