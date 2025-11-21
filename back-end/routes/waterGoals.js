import express from 'express';
import { protect } from '../middleware/auth.js';
import WaterGoal from '../models/WaterGoal.js';

const router = express.Router();

// Get current goal
router.get('/current', protect, async (req, res) => {
  try {
    const goal = await WaterGoal.findOne({ 
      user_id: req.user._id, 
      active: true 
    });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create or update goal
router.post('/', protect, async (req, res) => {
  try {
    // Deactivate current goal
    await WaterGoal.updateMany(
      { user_id: req.user._id, active: true },
      { active: false }
    );
    
    // Create new goal
    const goal = await WaterGoal.create({
      user_id: req.user._id,
      ...req.body
    });
    
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;