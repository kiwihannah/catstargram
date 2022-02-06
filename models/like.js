const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
  post_no: { type: Number },
  user_id: { type: String },
});
module.exports = mongoose.model('Like', likeSchema);
