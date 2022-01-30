const mongoose = require("mongoose");
const autoIncresedId = require('mongoose-sequence')(mongoose);

/* member_no, cat_name, user_id, user_pw, level, reg_date */
const userSchema = new mongoose.Schema({
    member_no: {
        type: Number
    },
    cat_name: {
        type: String,
        required: true,
        unique: false
    },
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    user_pw: {
        type: String,
        required: true,
        unique: false
    },
    level: {
        type: Number,
        unique: false
    },
    reg_date: {
        type: String,
        required: true,
        unique: false
    }
});

userSchema.plugin(autoIncresedId, {id:'member_seq', inc_field: 'member_no'});
module.exports = mongoose.model("User", userSchema);
