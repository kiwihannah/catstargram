const mongoose = require("mongoose");
const autoIncresedId = require('mongoose-sequence')(mongoose);
/* post_no, user_id, cat_name, cmt, ins_date */
const replySchema = new mongoose.Schema({
    cmt_no: { type: Number,},
    post_no: { type: Number,},
    user_id: { type: String, required: true, unique: false, },
    cmt: { type: String, unique: false, },
    ins_date: { type: String, unique: false, }
});
replySchema.plugin(autoIncresedId, {id:'cmt_seq', inc_field: 'cmt_no'});
module.exports = mongoose.model("Reply", replySchema);
