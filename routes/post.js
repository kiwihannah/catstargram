const express = require('express');
const Post = require('../models/post');
const Reply = require('../models/reply');
const User = require('../models/user');
const Like = require('../models/like');
const router = express.Router();
const nowDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' });

router.post('/posts', async (req, res) => {
  const { user_id, title, context } = req.body;
  await Post.create({
    user_id,
    title,
    context,
    hit: 0,
    like: 0,
    ins_date: nowDateTime,
    upd_date: nowDateTime,
  });
  console.log('[Router : createPost]');
  res.status(201).json({});
});

router.get('/posts', async function (req, res) {
  let nowPage = Math.max(1, parseInt(req.query.page)); // string -> int
  let limit = 5;
  let skip = (nowPage - 1) * limit;
  let count = await Post.countDocuments({});
  let maxPage = Math.ceil(count / limit);
  const posts = await Post.find({})
    .sort({ ins_date: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
  console.log('[Router : READ ALL]');
  res.status(200).json({ posts, nowPage, maxPage });
});

router.get('/posts/one/:post_no', async (req, res) => {
  const post_no = req.params.post_no;
  const post = await Post.findOne({ post_no });
  if (!post) {
    return res.status(400).json({
      success: false,
      msg: '해당 게시글을 불러오지 못했습니다.',
    });
  }
  console.log('[Router : READ ONE]', post_no);
  res.json({ post });
});

router.put('/posts/one/:post_no', async (req, res) => {
  const post_no = req.params.post_no;
  const { title, context } = req.body;
  const post = await Post.findOne({ post_no });
  if (post) {
    await Post.updateOne({ post_no }, { $set: { title, context } });
    res.status(200).json({});
  } else {
    res.status(400).json({});
  }
  console.log('[Router : MODIFY ONE]', post_no);
});

router.delete('/posts/:post_no', async (req, res) => {
  const post_no = req.params.post_no;
  const post = await Post.findOne({ post_no });

  if (post) {
    await Post.deleteOne({ post_no });
    res.status(200).json({});
  } else {
    res.status(400).json({});
  }
});

router.post('/replies', async (req, res) => {
  const { post_no, user_id, cmt } = req.body;
  await Reply.create({ post_no, user_id, cmt, ins_date: nowDateTime });
  console.log('[Router : cmted]');
  res.status(201).json({});
});

router.get('/replies/:post_no', async (req, res) => {
  const { post_no } = req.params;
  console.log(post_no);
  let replies = await Reply.find({ post_no }).sort({ ins_date: -1 }).exec();
  res.send({ replies });
});

router.get('/replies/one/:post_no/:cmt_no', async (req, res) => {
  const { post_no, cmt_no } = req.params;
  let reply = await Reply.find({ post_no, cmt_no }).exec();
  res.send({ reply });
});

router.put('/replies/one/:cmt_no', async (req, res) => {
  const { cmt_no } = req.params;
  const { cmt } = req.body;
  await Reply.updateOne({ cmt_no }, { $set: { cmt } });
  res.status(201).send({});
});

router.delete('/replies/one/:cmt_no', async (req, res) => {
  const { cmt_no } = req.params;
  await Reply.deleteOne({ cmt_no });
  res.status(200).send({});
});

router.get('/isExistLike/:user_id/:post_no', async (req, res) => {
  const { user_id, post_no } = req.params;
  let isExist = await Like.find({ $and: [{ user_id }, { post_no }] });
  res.send({ isExist });
});

router.put('/posts/hit/:post_no', async (req, res) => {
  const { post_no } = req.params;
  let [hit] = await Post.find({ post_no });
  let nowHit = 0;
  nowHit = hit['hit'];
  let nextHit = 0;
  nextHit = nowHit + 1;
  await Post.updateOne({ post_no }, { $set: { hit: nextHit } });
  res.status(201).send({});
});

router.put('/posts/like/:post_no', async (req, res) => {
  const { post_no } = req.params;
  const { val, user_id } = req.body;
  let [like] = await Post.find({ post_no });
  let nowLike = 0;
  nowLike = like['like'];
  let nextLike = 0;
  nextLike = nowLike + Number(val);
  await Post.updateOne({ post_no }, { $set: { like: nextLike } });
  Number(val) === 1
    ? await Like.create({ user_id, post_no })
    : await Like.deleteOne({ $and: [{ user_id }, { post_no }] });
  res.status(201).send({});
});

module.exports = router;
