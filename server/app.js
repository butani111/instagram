const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 5000
const { MONGOURL } = require('./keys')
const cors = require('cors')

app.use(cors())

mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
mongoose.connection.on('connected', () => {
  console.log('connected to mongo.')
})
mongoose.connection.on('error', (err) => {
  console.log('error while connecting to mongo.')
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routers/auth'))
app.use(require('./routers/post'))
app.use(require('./routers/user'))

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}.....`)
})