const mongoose = require('mongoose');
const joi = require("joi");
const { commentSchema } = require('./reactions/comment');
const { likeSchema } = require('./reactions/like');

const researchSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    title: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
    },
    type: {
        type: String,
        minlength: 2,
        maxlength: 50
    },
    topic: {
        type: String,
        minlength: 10,
        required: true
    },
    reference: {
        type: String,
        minlength: 5,
    },
    comment: {
        type: [commentSchema]
    },
    like: {
        type: [likeSchema]
    }
});

const Research = mongoose.model('research', researchSchema);

function validateresearch(research) {
    const schema = {
        username: joi.string().min(5).max(100),
        email: joi.string().min(5).max(100).email(),
        title: joi.string().min(5).max(255).required(),
        type: joi.string().min(2).max(50),
        topic: joi.string().min(10).required(),
        reference: joi.string().min(5)
    }
    return joi.validate(research, schema);
};



exports.Research = Research;
exports.validateresearch = validateresearch;