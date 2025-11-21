import express from 'express';
import { protect } from '../middleware/auth.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Get feedback for a water point
router.get('/point/:pointId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ point_id: req.params.pointId })
      .populate('user_id', 'name');
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create feedback
router.post('/', protect, async (req, res) => {
  try {
    const feedback = await Feedback.create({
      user_id: req.user._id,
      ...req.body
    });
    
    await feedback.populate('user_id', 'name');
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;