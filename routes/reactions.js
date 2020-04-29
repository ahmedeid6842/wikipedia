const { Comment, validateComment } = require('../db/reactions/comment');
const { Like, validateLike } = require('../db/reactions/like');
const { Research } = require('../db/research');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/comment', auth, async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const search = await Research.findOne({ username: req.body.username, title: req.body.title });
    if (!search) return res.status(404).send('no title or username with that names');

    const newcomment = new Comment({
        comment: req.body.comment,
        username: req.user.username,
        email: req.user.email
    });

    search.comment.push(newcomment);
    await search.save();
    res.send(search);

});

router.post('/like', auth, async (req, res) => {
    const { error } = validateLike(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const search = await Research.findOne({ username: req.body.username, title: req.body.title });
    if (!search) return res.status(404).send('no title or username with that names');

    let flag = 0;
    search.like.forEach(element => {
        if (element.username === req.user.username && element.email === req.user.email) {
            flag = 1;
            return res.status(400).send('you already like this research')
        }

    });
    if (flag === 0) {
        const newlike = new Like({

            username: req.user.username,
            email: req.user.email
        });


        search.like.push(newlike);
        await search.save();
        res.send(search);
    }

});

router.get('/counting', async (req, res) => {
    const comment_like = await Research.find({ title: req.body.title, username: req.body.username }).select('comment like');
    if (!comment_like) return res.status(404).send('no research with that title or this username');
    let comment_likeCount = "comment count : " + comment_like[0].comment.length;
    comment_likeCount += "\n" + "like count :" + comment_like[0].like.length;
    res.send(comment_likeCount);
})
router.get('/comment', async (req, res) => {
    const comment = await Research.find({ title: req.body.title, username: req.body.username }).select('comment');
    if (!comment) return res.status(404).send('no research with that title or this username');
    res.send(comment);
})
router.get('/like', async (req, res) => {
    const like = await Research.find({ title: req.body.title, username: req.body.username }).select('like');
    if (!like) return res.status(404).send('no research with that title or this username');
    res.send(like);
})

module.exports = router