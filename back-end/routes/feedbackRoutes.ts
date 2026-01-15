import {Router} from 'express';
import {registerFeedback, ListOfAllFeedbacks, feedbackByWaterPoints, deleteComment} from '../controllers/feedbackControllers';
import {MiddlewareAuth} from '../middlewares/MiddleWareAuth';
import {upload} from '../middlewares/upload';

const router = Router();

router.post('/:user_email/:waterPoint_id', MiddlewareAuth, upload.single("image"), registerFeedback);
router.get('/', ListOfAllFeedbacks);
router.get('/:waterPoint_id', feedbackByWaterPoints);
router.delete('/:point_id', MiddlewareAuth, deleteComment)

module.exports = router;