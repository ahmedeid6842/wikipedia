const { Research, validateresearch } = require('../db/research');
const { User } = require('../db/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const express = require('express');
const joi = require('joi');

const router = express.Router();


router.post('/', auth, async (req, res) => {
    const { error } = validateresearch(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('no user with that token ');

    const research = new Research({
        username: user.username,
        email: user.email,
        title: req.body.title,
        type: req.body.type,
        topic: req.body.topic,
        reference: req.body.reference
    });

    await research.save();
    res.send(research);
});

router.get('/:title', async (req, res) => {
    const research = await Research.find({ title: req.params.title });
    if (!research) return res.send('no research with that title');
    res.send(research);
});

router.put('/:title', auth, async (req, res) => {
    const { error } = validateupdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('no user with that token');
    let research;
    if (user.username === req.body.username && user.email === req.body.email) {
        research = await Research.findOneAndUpdate({ title: req.params.title }, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                title: req.body.title,
                type: req.body.type,
                topic: req.body.topic,
                reference: req.body.reference
            }
        }, { new: true });
    } else {
        return res.status(403).send(`you can't update that reseatch`);
    }

    if (!research) return res.status(404).send('no research with that title');
    
    res.send(research);

});

router.delete('/:title', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('no user with that token');
    let research;
    if (user.username === req.body.username && user.email === req.body.email) {
        research = await Research.findOneAndDelete({ title: req.params.title });
    } else {
        return res.status(403).send(`you can't update that reseatch`);
    }

    if (!research) return res.status(404).send('no research with that title');
    res.send(research);

});
router.delete('/', [auth, admin], async (req, res) => {
    const research = await Research.findOneAndDelete({ title: req.body.title ,username:req.body.username});

    if (!research) return res.status(404).send('no research with that title');
    res.send(research);

});


function validateupdate(research) {
    const schema = {
        username: joi.string().min(5).max(50).required(),
        email: joi.string().min(5).max(100).email().required(),
        title: joi.string().min(5).max(255),
        type: joi.string().min(2).max(50),
        topic: joi.string().min(10),
        reference: joi.string().min(5)
    };
    return joi.validate(research, schema);
}
module.exports = router;