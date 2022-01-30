const mongoose = require("mongoose");
const conn = () => {
    //mongoose.connect('mongodb://username:password@host:port/database?options...');
    mongoose.connect("mongodb://test:test@3.35.169.150:27017/catstargram?authSource=admin", {ignoreUndefined: true}).catch((err) => {
        console.log(err);
    });
};

module.exports = conn;