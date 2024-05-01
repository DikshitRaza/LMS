const mongoose = require('mongoose');

const subscribedCourseSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: String
});

const SubscribedCourse = mongoose.model('SubscribedCourse', subscribedCourseSchema);

module.exports = SubscribedCourse;
