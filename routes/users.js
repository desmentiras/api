import express from 'express'
import User from '../models/User'

const router = express.Router()

router.get('/me', (req, res) => {
  if (req.session.user) {
    User.findById(req.session.user.id).then(user => {
      res.json(user)
    })
  } else {
    res.sendStatus(400)
  }
})

router.post('/user/authenticate', (req, res) => {
  const user = req.body

  if (user) {
    user.picture = user.picture.data.url

    User.findOrCreate({
      where: {
        id: user.id,
        name: user.name,
        link: user.link,
        email: user.email,
        // picture: user.picture
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


export default router
