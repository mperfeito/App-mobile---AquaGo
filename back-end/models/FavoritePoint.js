import mongoose from 'mongoose';

const favoritePointSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  point_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterPoint',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

// Evitar duplicados
favoritePointSchema.index({ user_id: 1, point_id: 1 }, { unique: true });

export default mongoose.model('FavoritePoint', favoritePointSchema);