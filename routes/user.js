const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const nowDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'UTC' });
/**
 * 0. register
 * member_no, cat_name, user_id, user_pw, level, reg_date
 **/ 
router.post("/user/new", async (req, res) => { /* pw 유효성 비동기 구현 예정 */
  const { cat_name_give, user_id_give, user_pw_give } = req.body;
  const user = await User.find({ user_id : user_id_give });
  if (user.length) {
    res.status(400).send({ errorMessage: "이미 가입된 아이디가 있습니다.", });
    return;
  } else {
    const registerUser = await User.create({
      cat_name  : cat_name_give,
      user_id   : user_id_give,
      user_pw   : user_pw_give,
      level     : 0, /* like > 100 , lvl =1 */ 
      reg_date  : nowDateTime,
    });
    console.log("[Router : registerUser]");
    res.status(201).json({ });
  }
});

/**
 * 1. login api/user/id_dup_ckeck?user_id_give=1234
 */
router.get("/user/id_dup_ckeck/:user_id_give", async (req, res) => {
  const user_id = req.params.user_id_give;
  const user = await User.findOne({ user_id });
  !user ? res.json({ msg: 1 }) : res.json({ msg: -1 })
});

router.post("/user/auth", async (req, res) => {
    const { user_id_give, user_pw_give } = req.body;
    const user = await User.findOne({ $and: [{ user_id: user_id_give }, { user_pw: user_pw_give }] });
    if (!user) {
      res.status(400).json({ msg: "입력하신 아이디 또는 패스워드가 알맞지 않습니다.", });
      return;
    } 
    const token = jwt.sign({ user_id: user.user_id }, "hannah-key"); /* generate token */
    console.log("[Router : loginUser]");
    res.status(200).send({ msg: true, token, });
});

router.get("/user/me", auth, async (req, res) => {
  const { user } = res.locals;
  console.log(user);
  res.send({ user, });
});

/**
 * 1. read one (before update)
 */
 router.get("/user/info/:user_id_give", async (req, res) => {
  const user_id = req.params.user_id_give;
  const user = await User.findOne({ user_id });
  if (!user) {
    return res.status(400).json({ success: false, errorMessage: "User not exist" });
  }
  console.log("[Router : user info]", user_id);
  res.json({ user });
});

/**
 * 3. update
 * member_no, cat_name, user_id, user_pw, level, reg_date 
 **/ 
router.put("/user/info/:member_no", async (req, res) => {
  const member_no = req.params.member_no;
  const { cat_name_give, user_pw_give, level_give } = req.body;
  const user = await User.findOne({ member_no });
  if(user) {
    await User.updateOne(
      { member_no: member_no },
      {$set: 
        {cat_name: cat_name_give, user_pw: user_pw_give, level: level_give,},
      }
    );
    res.json({ result: "success" });
  } else {
    res.status(400).json({ result: "NO DATA" }); 
  }
  console.log("[Router : MODIFY ONE]", member_no);
});

/**
 * 4. withdraw user filtered by member_no
*/
router.delete("/user/withdraw/:member_no", async (req, res) => { 
  const member_no = req.params.member_no;
  await User.deleteOne({ member_no });
  res.json({ result: "success" });
});

module.exports = router;