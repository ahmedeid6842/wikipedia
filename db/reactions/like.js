const mongoose = require('mongoose');
const joi = require('joi');

const likeSchema = new mongoose.Schema({
    
    username: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true,
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    }
})

const Like = mongoose.model('likes', likeSchema);

function validateLike(like) {
    const schema = {
       
        username: joi.string().min(5).max(50).required(),
        title: joi.string().min(5).max(255).required()
    };
    return joi.validate(like, schema);
}

exports.Like = Like;
exports.likeSchema = likeSchema;
exports.validateLike = validateLike;
