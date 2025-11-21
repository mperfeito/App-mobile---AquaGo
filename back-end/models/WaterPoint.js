import mongoose from 'mongoose';

const waterPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['fountain', 'tap', 'filter', 'bottle_refill'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  opening_hours: {
    type: String,
    default: '24/7'
  },
  last_maintenance_date: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('WaterPoint', waterPointSchema);