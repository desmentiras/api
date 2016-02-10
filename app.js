import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import User from './models/User'

const app = express()
const PORT = 3000

app.set('trust proxy', 1)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', 'http://app.localhost')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  next()
})

app.use(morgan('dev'))

app.use(cookieParser())
app.use(session({
  secret: 'psh',
  resave: true,
  saveUnintialized: true,
  cookie: {
    httpOnly: false
  }
}))

app.use(bodyParser())

app.get('/me', (req, res) => {
  if (req.session.user) {
    User.findById(req.session.user.id).then(user => {
      res.json(user)
    })
  } else {
    res.sendStatus(400)
  }
})

app.post('/user/authenticate', (req, res) => {
  const user = req.body

  if (user) {
    user.picture = user.picture.data.url

    User.findOrCreate({
      where: {
        id: user.id,
        name: user.name,
        link: user.link,
        picture: user.picture,
        email: user.email
      },
    }).spread((dbUser, created) => {
      req.session.user = dbUser
      req.session.save()
      res.json(dbUser)
    })
  } else {
    res.sendStatus(400)
  }
})

app.listen(PORT, () => {
  console.log(`Listening at :${PORT}`)
})
