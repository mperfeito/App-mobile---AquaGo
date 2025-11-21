import express from 'express';
import { protect } from '../middleware/auth.js';
import FavoritePoint from '../models/FavoritePoint.js';

const router = express.Router();

// Get user favorites
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await FavoritePoint.find({ user_id: req.user._id })
      .populate('point_id');
    res.json(favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add to favorites
router.post('/:pointId', protect, async (req, res) => {
  try {
    const favorite = await FavoritePoint.create({
      user_id: req.user._id,
      point_id: req.params.pointId
    });
    
    await favorite.populate('point_id');
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/:pointId', protect, async (req, res) => {
  try {
    await FavoritePoint.findOneAndDelete({
      user_id: req.user._id,
      point_id: req.params.pointId
    });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;