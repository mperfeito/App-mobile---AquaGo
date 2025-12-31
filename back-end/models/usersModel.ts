import {Schema, model} from 'mongoose';

const UsersSchema = new Schema({
    name: {type : String, required : true},
    email: {type: String, required : true},
    password: {type: String, required: true},
    age: {type: Number},
    phone_number: {type: String},
    gender: {type: String, enum: ["male", "female"]},
    activity_level: {type: String, enum: ["sedentary", "light", "moderate", "active", "very_active"]},
    climate_type: {type: String, enum: ["hot", "moderate", "cold"]},
    height: {type: Number},
    weight: {type: Number},
    }, {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        versionKey: false
    },
);

const User = model('User', UsersSchema);

export default User;
