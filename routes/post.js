const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const router = express.Router();
const nowDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' });
/**
 * 0. create - method : post
 * member_no, title, context, img_url, like, mention, ins_date, upd_date
 **/ 
router.post("/posts", async (req, res) => {
  const { title_give, context_give, img_url_give, mention_give } = req.body;
  const createPost = await Post.create({
    member_no : 1,
    title     : title_give,
    context   : context_give,
    img_url   : img_url_give,
    like      : 0,
    mention   : mention_give, /*array, not required*/
    ins_date  : nowDateTime,
    upd_date  : nowDateTime,
  });
  console.log("[Router : createPost]");
  res.json({ post: createPost });
});

/**
 * 1. read All
 */
router.get("/posts", async function (req, res) {
  let page = Math.max(1, parseInt(req.query.page)); // string -> int
  let limit = 5;

  page = !isNaN(page) ? page : 1;
  let skip = (page - 1) * limit;
  let count = await Post.countDocuments({});
  let maxPage = Math.ceil(count / limit);

  const posts = await Post.find({}).sort({ ins_date : -1 });
  //.skip(skip).limit(limit).exec();

  console.log("[Router : READ ALL]");
  res.json({ posts: posts, currentPage: page, maxPage: maxPage });
});

/**
 * 2. read ONE
 */
 router.get("/post/one/:post_no", async (req, res) => {
  const post_no = req.params.post_no; /* 하나만 가져오는데 {} deconstruction 할 필요 없음 */
  const post = await Post.findOne({ post_no });
  if (!post) {
    return res.status(400).json({ success: false, errorMessage: "Cannot read an empty article" });
  }
  console.log("[Router : READ ONE]", post_no);
  res.json({ post });
});

/**
 * 3. read many by member_no
 */
router.get("/posts/member/:member_no", async (req, res) => {
  const member_no = req.params.member_no; /* 하나만 가져오는데 {} deconstruction 할 필요 없음 */
  const post = await Post.find({ member_no });
  if (!post) {
    return res.status(400).json({ success: false, errorMessage: "Cannot read an empty article" });
  }
  console.log("[Router : READ MEMBER POSTS]", member_no);
  res.json({ post });
});

/**
 * 4. update
 * member_no, title, context, img_url, like, mention, ins_date, upd_date
 **/ 
router.put("/post/:post_no", async (req, res) => {
  const post_no = req.params.post_no;
  const { title_give, context_give, img_url_give, mention_give } = req.body;
  const post = await Post.findOne({ post_no });
  if(post) {
    await Post.updateOne(
      { post_no: post_no },
      {$set: 
        {title: title_give, context: context_give, img_url: img_url_give, 
          mention: mention_give, upd_date: nowDateTime,},
      }
    );
    res.json({ result: "success" });
  } else {
    res.status(400).json({ result: "NO DATA" }); 
  }
  console.log("[Router : MODIFY ONE]", post_no);
});

/**
 * 5. delete filtered by post_no
*/
router.delete("/post/:post_no", async (req, res) => {
  const post_no = req.params.post_no;
  const post = await Post.findOne({ post_no });
  if (post) {
    await Post.deleteOne({ post_no });
    res.json({ result: "success" });
  } else {
    res.status(400).json({ result: "NO DATA" });
  }
  
});

module.exports = router;