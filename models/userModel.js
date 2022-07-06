const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "User must have username"],
        unique: true,
    },
    password: {
        type: String,
        require: [true, "User must have password"],
    },    
});

const User = mongoose.model("User", postSchema);
module.exports = User;