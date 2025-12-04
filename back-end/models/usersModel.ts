import {Schema, model} from 'mongoose';

const UsersSchema = new Schema({
    name: {type : String, required : true},
    email: {type: String, required : true},
    password: {type: String, required: true},
    age: {type: Number},
    gender: {type: String, enum: ["male", "female"]},
    activity_level: {type: String, enum: ["sedentary", "light", "moderate", "active", "very_active"]},
    climate_type: {type: String, enum: ["hot", "moderate", "cold"]},
    height: {type: Number},
    }, {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);

const User = model('User', UsersSchema);

export default User;
