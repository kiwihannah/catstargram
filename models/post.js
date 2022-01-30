const mongoose = require("mongoose");
const autoIncresedId = require('mongoose-sequence')(mongoose);
/* post_no, member_no, title, img_url, star, like, mention, ins_date, upd_date */
const postSchema = new mongoose.Schema({
    post_no: { 
      type: Number, 
    },
    member_no: {
        type: Number
    },
    title: {
        type: String,
        required: true,
        unique: false,
    },
    context: {
        type: String,
        required: true,
        unique: false,
    },
    img_url: {
        type: String,
        unique: false,
    },
    like: {
        type: Number,
        unique: false,
    },
    mention: {
        type: String,
        unique: false,
    },
    ins_date: {
        type: String,
        required: true,
        unique: false,
    },
    upd_date: {
        type: String,
        required: true,
        unique: false,
    },
});
postSchema.plugin(autoIncresedId, {id:'post_seq', inc_field: 'post_no'});
module.exports = mongoose.model("Post", postSchema);
