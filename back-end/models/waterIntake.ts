import {Schema, model} from 'mongoose';

const waterIntakeSchema = new Schema({
    user_id : {type: Schema.Types.ObjectId, ref : "User", required: true},
    amount: {type: Number, required: true, min: 0},
    timeStamp: {type: Date, default: Date.now}
}, {
    timestamps: {createdAt: 'created_at'}
});

const waterIntake = model('waterIntake', waterIntakeSchema);

export default waterIntake;