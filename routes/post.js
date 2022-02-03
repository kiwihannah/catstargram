const express = require("express");
const Post = require("../models/post");
const Reply = require("../models/reply");
const User = require("../models/user");
const router = express.Router();
const nowDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' });

router.post("/posts", async (req, res) => {
  const { user_id, title, context } = req.body;
  await Post.create({ user_id, title, context, hit : 0, like : 0, ins_date  : nowDateTime, upd_date  : nowDateTime, });
  console.log("[Router : createPost]");
  res.status(201).json({ });
});

router.get("/posts", async function (req, res) {
  let page = Math.max(1, parseInt(req.query.page)); // string -> int
  let limit = 10;

  page = !isNaN(page) ? page : 1;
  let skip = (page - 1) * limit;
  let count = await Post.countDocuments({});
  let maxPage = Math.ceil(count / limit);

  const posts = await Post.find({}).sort({ ins_date : -1 }).skip(skip).limit(limit).exec();

  console.log("[Router : READ ALL]");
  res.status(200).json({ posts: posts, currentPage: page, maxPage: maxPage });
});

 router.get("/posts/one/:post_no", async (req, res) => {
  const post_no = req.params.post_no; 
  const post = await Post.findOne({ post_no });
  if (!post) { return res.status(400).json({ success: false, msg: "해당 게시글을 불러오지 못했습니다." }); }
  console.log("[Router : READ ONE]", post_no);
  res.json({ post });
});

// router.get("/posts/member/:member_no", async (req, res) => {
//   const member_no = req.params.member_no; /* 하나만 가져오는데 {} deconstruction 할 필요 없음 */
//   const post = await Post.find({ member_no });
//   if (!post) {
//     return res.status(400).json({ success: false, errorMessage: "Cannot read an empty article" });
//   }
//   console.log("[Router : READ MEMBER POSTS]", member_no);
//   res.json({ post });
// });

router.put("/posts/one/:post_no", async (req, res) => {
  const post_no = req.params.post_no; const { title, context } = req.body;
  const post = await Post.findOne({ post_no });
  if( post ) { 
    await Post.updateOne({ post_no }, {$set: { title, context, },});
    res.status(200).json({ });
  } else {
    res.status(400).json({ }); 
  }
  console.log("[Router : MODIFY ONE]", post_no);
});

router.delete("/posts/:post_no", async (req, res) => {
  const post_no = req.params.post_no;
  const post = await Post.findOne({ post_no });

  if (post) { await Post.deleteOne({ post_no }); res.status(200).json({ }); } 
  else { res.status(400).json({ }); }
});

router.post("/replies", async (req, res) => {
  const { post_no, user_id, cmt } = req.body;
  await Reply.create({ post_no, user_id, cmt, ins_date  : nowDateTime });
  console.log("[Router : cmted]");
  res.status(201).json({ });
});

router.get("/replies/:post_no", async (req, res) => {
  const { post_no } = req.params;
  console.log(post_no);
  let replies = await Reply.find({post_no}).sort({ ins_date : -1 }).exec();
  res.send({ replies });
});

router.get("/replies/one/:post_no/:cmt_no", async (req, res) => {
  const { post_no, cmt_no } = req.params; 
  let reply = await Reply.find({ post_no, cmt_no }).exec(); 
  res.send({reply}); 
});

router.put("/replies/one/:cmt_no", async (req, res) => {
  const { cmt_no } = req.params; const { cmt } = req.body;
  await Reply.updateOne({ cmt_no }, {$set: { cmt, },});
  res.status(201).send({ });
});

router.delete("/replies/one/:cmt_no", async (req, res) => {
  const { cmt_no } = req.params; await Reply.deleteOne({ cmt_no });
  res.status(200).send({ });
});

module.exports = router;