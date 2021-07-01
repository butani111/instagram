const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const loginRequire = require('../middleware/loginRequire')


router.get('/mypost', loginRequire, (req, res) => {
  // console.log(req.user)
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', 'name _id')
    .then(mypost => {
      res.json(mypost)
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/allpost', loginRequire, (req, res) => {
  // console.log('allpost requested')
  Post.find()
    .populate("postedBy", "name _id")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
      // console.log(posts)
      res.json({ posts })
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/allsubpost', loginRequire, (req, res) => {
  // console.log('allpost requested')
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "name _id")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
      // console.log(posts)
      res.json({ posts })
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/createpost', loginRequire, (req, res) => {
  const { title, body, pic } = req.body
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Provide all info for post" })
  }
  req.user.password = undefined
  const post = new Post({ title, body, photo: pic, postedBy: req.user, likes: [] })

  post.save()
    .then(savedPost => {
      res.json({ post: savedPost })
    })
    .catch(err => {
      console.log(err)
    })
})

router.put('/like', loginRequire, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: { likes: req.user._id }
  }, {
    new: true
  })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err })
      } else {
        res.json(result)
      }
    })
})
router.put('/unlike', loginRequire, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull: { likes: req.user._id }
  }, {
    new: true
  })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err })
      } else {
        res.json(result)
      }
    })
})
router.put('/comment', loginRequire, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId, {
    $push: { comments: comment }
  }, {
    new: true
  })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err })
      } else {
        res.json(result)
      }
    })
})
router.put('/deletecomment', loginRequire, (req, res) => {

  Post.findByIdAndUpdate(req.body.postId, {
    $pull: { comments: {_id:req.body.commentId} }
  }, {
    new: true
  })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err })
      } else {
        res.json(result)
      }
    })
})

router.delete("/deletepost/:postId", (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err })
      }
      // if (post.postedBy._id.toString() === req.user._id.toString()) {
      post.remove()
        .then(result => {
          res.json({ message: "Post deleted successfully." })
        })
        .catch(err => console.log(err))
      // }
    })
})

module.exports = router