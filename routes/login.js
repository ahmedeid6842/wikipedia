const { User } = require('../db/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const express = require('express');
const joi = require('joi');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user.id }).select('-password');
    res.send(user);
});

router.get('/all', [auth, admin], async (req, res) => {
    const user = await User.find();
    res.send(user);
})
router.get('/all/:id', [auth, admin], async (req, res) => {
    const user = await User.findById(id);
    res.send(user);
})

router.post('/', async (req, res) => {
    const { error } = validateuser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('invalid email or password');

    const validpassword = await bcrypt.compare(req.body.password, user.password);
    if (!validpassword) return res.status(400).send('invalid email or password');
    const token = user.createToken();
    res.header('x-auth-token', token).send('login successfuly');
});

function validateuser(user) {
    const schema = {
        password: joi.string().min(5).max(1024).required(),
        email: joi.string().min(10).max(100).required().email()
    }
    return joi.validate(user, schema);
}

module.exports = router