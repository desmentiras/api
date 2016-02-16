import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import Router from './router'

const app = express()
const PORT = 3000

app.set('trust proxy', 1)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', 'http://app.localhost')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE')
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

new Router(app)

app.listen(PORT, () => {
  console.log(`Listening at :${PORT}`)
})
