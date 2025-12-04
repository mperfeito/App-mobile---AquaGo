import {Schema, model} from 'mongoose';

const waterGoalSchema = new Schema({
    user_id : {type: Schema.Types.ObjectId, ref: 'User', required: true},
    daily_goal_ml : {type: Number, required: true, min: 0},
    active: {type: Boolean, default: true}
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

const waterGoal = model('WaterGoal', waterGoalSchema);

export default waterGoal