const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }, pic: {
    type: String,
    default: "https://res.cloudinary.com/imagecloude/image/upload/v1622092837/no-profile-pic_zgr0m7.jpg"
  },
  resetToken: String,
  expireToken: Date,
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }]
})

mongoose.model('User', userSchema)