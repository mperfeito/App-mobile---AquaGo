import {Schema, model} from 'mongoose';

const feedbackSchema = new Schema({
    user_email: {type: String, ref: 'User', required: true},
    point_id: {type: Schema.Types.ObjectId, ref: 'waterPoint', required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String, trim: true, maxLength: 500},
    image_url : {type: String},
    favourite: {type: Boolean}
}, {
    timestamps: {createdAt: 'created_at'},
    versionKey: false
});

const feedback = model('feedback', feedbackSchema);

export default feedback;