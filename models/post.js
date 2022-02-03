const mongoose = require("mongoose");
const autoIncresedId = require('mongoose-sequence')(mongoose);
/* post_no, user_id, title, context, like, ins_date, upd_date */
const postSchema = new mongoose.Schema({
    post_no: { 
      type: Number, 
    },
    user_id: {
        type: String,
        required: true,
        unique: false,
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
    hit: {
        type: Number,
        required: true,
        unique: false,
    },
    like: {
        type: Number,
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
