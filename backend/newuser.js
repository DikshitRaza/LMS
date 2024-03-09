const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: Number,
    userType: String,
    status: Number
});

module.exports = mongoose.model("NewUser", userSchema);

