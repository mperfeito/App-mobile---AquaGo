import {Schema, model} from 'mongoose';

const waterPointSchema = new Schema({
   name: {type: String, required: true, trim: true},
   type: {type: String, enum: ['fountain', 'tap', 'filter', 'bottle_refill'], default: 'fountain'},
   status: {type: String, enum: ['active', 'maintenace', 'inactive'], default:'active'},
   coordinates: { lat: {type: Number, required: true}, lng: {type: Number, required: true}},
   address: {type: String},
   rating: {type: Number, default: 3.0},
   schedule: {opening_hour: {type: String, default: 8}, closing_hour: {type: String, default: 18}},
   last_maintenance_date: {type: Date}
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    versionKey: false
});

const waterPoint = model('waterPoint', waterPointSchema);

export default waterPoint;