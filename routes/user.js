const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const nowDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' });

router.post("/user/new", async (req, res) => {
  const { user_id, user_pw } = req.body;
  await User.create({ user_id, user_pw, reg_date : nowDateTime });
  console.log("[Router : registerUser]");
  res.status(201).json({ });
});

router.get("/user/id_dup_ckeck/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const user = await User.findOne({ user_id });
  !user ? res.json({ msg: 1 }) : res.json({ msg: -1 })
});

router.post("/user/auth", async (req, res) => {
    const { user_id, user_pw } = req.body;
    const user = await User.findOne({ $and: [{ user_id}, {user_pw }] }).exec();
    if (!user) { res.json({ msg: false }); return; } 
    const token = jwt.sign({ userId: user.user_id }, "hannah-key"); /* generate token */
    console.log("[Router : loginUser]", token);
    res.send({ msg: true, user, token, });
});

router.get("/user/me", auth, async (req, res) => {
  const { user } = res.locals;
  console.log(user);
  res.status(200).send({ user, });
});

 router.get("/user/info/:user_id", async (req, res) => {
  const {user_id} = req.params;
  const user = await User.findOne({ user_id });
  if (!user) {
    return res.status(400).json({ success: false, errorMessage: "User not exist" });
  }
  console.log("[Router : user info]", user_id);
  res.json({ user });
});

router.delete("/user/withdraw/:member_no", async (req, res) => { 
  const member_no = req.params.member_no;
  await User.deleteOne({ member_no });
  res.json({ result: "success" });
});

module.exports = router;