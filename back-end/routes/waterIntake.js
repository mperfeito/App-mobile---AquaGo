import express from 'express';
import { protect } from '../middleware/auth.js';
import WaterIntake from '../models/WaterIntake.js';

const router = express.Router();

// Get user water intake (with date filter)
router.get('/', protect, async (req, res) => {
  try {
    const { date } = req.query;
    let filter = { user_id: req.user._id };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      filter.timestamp = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    const intake = await WaterIntake.find(filter).sort({ timestamp: -1 });
    res.json(intake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add water intake
router.post('/', protect, async (req, res) => {
  try {
    const intake = await WaterIntake.create({
      user_id: req.user._id,
      ...req.body
    });
    res.status(201).json(intake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get today's total
router.get('/today/total', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const result = await WaterIntake.aggregate([
      {
        $match: {
          user_id: req.user._id,
          timestamp: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount_ml' }
        }
      }
    ]);
    
    const total = result.length > 0 ? result[0].total : 0;
    res.json({ total });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;