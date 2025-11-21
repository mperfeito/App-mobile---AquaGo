import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  point_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterPoint',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: { createdAt: 'created_at' }
});

export default mongoose.model('Feedback', feedbackSchema);