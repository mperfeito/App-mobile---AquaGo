import express from 'express';
import { protect } from '../middleware/auth.js';
import WaterPoint from '../models/WaterPoint.js';

const router = express.Router();

// Get all water points
router.get('/', async (req, res) => {
  try {
    const waterPoints = await WaterPoint.find();
    res.json(waterPoints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single water point
router.get('/:id', async (req, res) => {
  try {
    const waterPoint = await WaterPoint.findById(req.params.id);
    if (!waterPoint) {
      return res.status(404).json({ message: 'Water point not found' });
    }
    res.json(waterPoint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create water point (admin)
router.post('/', protect, async (req, res) => {
  try {
    const waterPoint = await WaterPoint.create(req.body);
    res.status(201).json(waterPoint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update water point
router.put('/:id', protect, async (req, res) => {
  try {
    const waterPoint = await WaterPoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(waterPoint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;