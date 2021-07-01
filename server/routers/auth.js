const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const loginRequire = require('../middleware/loginRequire')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
// 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


const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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"
  }
}))

router.get('/protected', loginRequire, (req, res) => {
  res.send("hello user")
})

router.post('/signup', (req, res) => {
  // console.log(req.body.name)
  const { name, email, password, pic } = req.body

  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please provide information" })
  }
  // res.status(200).json({ message: "Information added successfully" })

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exits with this email" })
      }

      bcrypt.hash(password, 12)
        .then(hashedPassword => {

          // const profilePic = pic ? pic : "https://res.cloudinary.com/imagecloude/image/upload/v1622092837/no-profile-pic_zgr0m7.jpg"

          const user = new User({ name, email, password: hashedPassword, pic })

          user.save()
            .then(user => {
              transporter.sendMail({
                to: user.email,
                from: "aksh35956@gmail.com",
                subject: "Signup success",
                html: "<h1>Welcome to Instagram family!</h1>"
              })
              res.json({ message: "user added" })
            })
            .catch(err => {
              console.log(err)
              res.json({ error: "Something went wrong!!" })
            })
        })
    })
    .catch(err => {
      console.log(err)
    })

})

router.post('/signin', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).json({ error: "Plaese add email and password properly" })
  }
  User.findOne({ email: email })
    // .select("-password -__v")
    .then(savedUser => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email or password1" })
      }
      // console.log(savedUser);
      bcrypt.compare(password, savedUser.password)
        .then(isPassSame => {
          if (isPassSame) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
            const { _id, name, email, followers, following, pic } = savedUser
            res.json({ token, user: { _id, name, email, followers, following, pic } })
            // savedUser.password = undefined
            // res.json({ token, user: savedUser })
          } else {
            return res.status(422).json({ error: "Invalid email or password2" })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
})

router.post('/reset-password', (req, res) => {

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex')

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(422).json({ message: "No user found with this email." })
        }
        user.resetToken = token
        user.expireToken = Date.now() + 3600000
        user.save().then(result => {
          transporter.sendMail({
            to: user.email,
            from: "aksh35956@gmail.com",
            subject: "Reset Password",
            html: `
            <p>Dear ${user.name},</p>
            <p>You have requested to change instagram password.</p>
            <p>Click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password.</p>
            `
          })
          res.json({ message: "Check your mail." })
        })
      })
  })

})

router.post('/newpassword', (req, res) => {
  User.findOne({ resetToken: req.body.token, expireToken: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: "Session expired. Try again." })
      }
      bcrypt.hash(req.body.password, 12)
        .then(hashedPassword => {
          user.password = hashedPassword
          user.resetToken = undefined
          user.expireToken = undefined
          user.save().then(savedUser => {
            res.json({ message: "Password updated successfully." })
          })
        })
    }).catch(err => console.log(err))
})

module.exports = router



{
  // const express = require('express')
  // const router = express.Router()
  // const mongoose = require('mongoose')
  // const User = mongoose.model('User')
  // const bcrypt = require('bcryptjs')
  // const jwt = require('jsonwebtoken')
  // const { JWT_SECRET } = require('../keys')
  // const loginRequire = require('../middleware/loginRequire')

  // router.get('/', (req, res) => {
  //   res.send('Hello from auth.js')
  // })

  // router.get('/protected', loginRequire, (req, res) => {
  //   res.send("hello user")
  // })

  // router.post('/signup', (req, res) => {
  //   // console.log(req.body.name)
  //   const { name, email, password, pic } = req.body

  //   if (!name || !email || !password) {
  //     return res.status(422).json({ error: "Please provide information" })
  //   }
  //   // res.status(200).json({ message: "Information added successfully" })

  //   User.findOne({ email: email })
  //     .then((savedUser) => {
  //       if (savedUser) {
  //         return res.status(422).json({ error: "User already exits with this email" })
  //       }

  //       bcrypt.hash(password, 12)
  //         .then(hashedPassword => {

  //           // const profilePic = pic ? pic : "https://res.cloudinary.com/imagecloude/image/upload/v1622092837/no-profile-pic_zgr0m7.jpg"

  //           const user = new User({ name, email, password: hashedPassword, pic })

  //           user.save()
  //             .then(user => {
  //               res.json({ message: "user added" })
  //             })
  //             .catch(err => {
  //               console.log(err)
  //               res.json({ error: "Something went wrong!!" })
  //             })
  //         })
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })

  // })

  // router.post('/signin', (req, res) => {
  //   const { email, password } = req.body

  //   if (!email || !password) {
  //     return res.status(422).json({ error: "Plaese add email and password properly" })
  //   }
  //   User.findOne({ email: email })
  //     // .select("-password -__v")
  //     .then(savedUser => {
  //       if (!savedUser) {
  //         return res.status(422).json({ error: "Invalid email or password1" })
  //       }
  //       // console.log(savedUser);
  //       bcrypt.compare(password, savedUser.password)
  //         .then(isPassSame => {
  //           if (isPassSame) {
  //             const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
  //             const { _id, name, email, followers, following, pic } = savedUser
  //             res.json({ token, user: { _id, name, email, followers, following, pic } })
  //             // savedUser.password = undefined
  //             // res.json({ token, user: savedUser })
  //           } else {
  //             return res.status(422).json({ error: "Invalid email or password2" })
  //           }
  //         })
  //         .catch(err => {
  //           console.log(err)
  //         })
  //     })
  // })

  // module.exports = router
}