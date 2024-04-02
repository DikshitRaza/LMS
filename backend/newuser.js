const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: Number,
    category: String, // Changed from Category to category
    experience: Number, // New field for experience
    subject: String
});

module.exports = mongoose.model("NewUser", userSchema);
