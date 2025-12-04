import {Schema, model} from 'mongoose';

const waterPointSchema = new Schema({
   name: {type: String, required: true, trim: true},
   type: {type: String, enum: ['fontain', 'tap', 'filter', 'bottle_refill']},
   status: {type: String, enum: ['active', 'maintenace', 'inactive']},
   coordinates: { lat: {type: Number, required: true}, lng: {type: Number, required: true}},
   opening_hours: {type: String, default: 24/7},
   last_maintenance_date: {type: Date}
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

const waterPoint = model('waterPoint', waterPointSchema);

export default waterPoint;