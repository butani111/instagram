const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Post = mongoose.model('Post')
const loginRequire = require('../middleware/loginRequire')
const { ObjectId } = mongoose.Schema.Types


router.get("/user/:id", loginRequire, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then(user => {
      // console.log(user)
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name followers")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err })
          }
          // console.log(posts)
          res.json({ user, posts })
        })//.catch(err => console.log(err))
    }).catch(err => console.log(err))
})

router.put("/follow", loginRequire, (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {
    $push: { followers: req.user._id }
  }, {
    new: true
  }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    }
    User.findByIdAndUpdate(req.user._id, {
      $push: { following: req.body.followId }
    }, {
      new: true
    })
      .select("-password")
      .then(result => res.json(result))
      .catch(err => {
        return res.status(422).json({ error: err })
      })
  })
})

router.put("/unfollow", loginRequire, (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: { followers: req.user._id }
  }, {
    new: true
  }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    }
    User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.body.unfollowId }
    }, {
      new: true
    })
      .select("-password")
      .then(result => res.json(result))
      .catch(err => {
        return res.status(422).json({ error: err })
      })
  })
})


router.put('/updatepic', loginRequire, (req, res) => {
  // User.findOne({ email: email })
  // console.log(req.user);
  User.findByIdAndUpdate(req.user._id, {
    pic: req.body.pic
  }, {
    new: true
  })
    // .populate("comments.postedBy", "_id name")
    // .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err })
      } else {
        result.password = undefined
        res.json(result)
      }
    })
})

module.exports = router