const mongoose = require('mongoose');
const joi = require('joi');
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        minlength: 1,
        required: true
    },
    username: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        minlength: 10,
        maxlength: 200,
    },
});

const Comment = mongoose.model('comments', commentSchema);

function validateComment(comments) {
    const schema = {
        username: joi.string().min(5).max(100).required(),
        title: joi.string().min(5).max(255).required(),
        comment: joi.string().min(1).required(),
    };
    return joi.validate(comments, schema);
}
exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validateComment = validateComment;
