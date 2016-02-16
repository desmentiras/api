/*
 * Para fazer: OS RETURNS ESTAO NEUTRALIZANDO OS VOTOS QUANDO VAI DE -1 PARA +1
 * E VICE VERSA. ENTÃO, TENHO QUE REMOVER OS NEUTRALIZATIONS DO REPUTAITONREFERENCES
 * E DEIXAR OS CALCULOS ACONTECEREM MODULARMENTE. (Y)
 */

import express from 'express'
import is from 'is_js'

import Post from '../models/Post'
import User from '../models/User'
import Source from '../models/Source'

import Reputation from '../utils/reputation'

const router = express.Router()

router.get('/posts', (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'title',
      'slug',
      'views',
      'references',
      'upvotes',
      'downvotes',
      'createdAt'
    ],
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'link', 'picture']
      },
      {
        model: Source,
        attributes: ['domain']
      }
    ]
  }).then(posts => {
    res.json(posts)
  })
})

router.get('/posts/:id', (req, res) => {
  const id = req.params.id

  Post.findById(id, {
    group: ['post.id', 'user.id', 'source.id'],
    attributes: [
      'id',
      'title',
      'slug',
      'upvotes',
      'downvotes',
      'references',
      'createdAt'
    ],
    include: [
      {
        model: User,
        attributes: [
          'id',
          'name',
          'slug',
          'picture',
          'link',
          'reputation'
        ]
      },
      {
        model: Source,
        attributes: [
          'id',
          'title',
          'description',
          'url',
          'domain',
          'cover'
        ]
      }
    ]
  }).then(post => {
    post.dataValues.balance = post.upvotes.length - (post.downvotes && post.downvotes.length) || 0

    if (post) {
      res.json(post)
    } else {
      res.sendStatus(404)
    }
  })
})

router.patch('/posts/:id/upvote', (req, res) => {
  const {id} = req.params
  const {user} = req.session

  if (!user) { res.sendStatus(401) }

  Post
    .findById(id, {attributes: ['userId', 'upvotes', 'downvotes']})
    .then(post => {
    const shallowUpvotes = post.upvotes
    const shallowDownvotes = post.downvotes

    const reputation = new Reputation({giver: user.id, recipient: post.userId})

    // remove from downvotes (-1 -> +1)
    if (is.inArray(user.id, shallowDownvotes)) {
      const userIdInShallowDownvotesIndex = shallowDownvotes.indexOf(user.id)

      if (userIdInShallowDownvotesIndex > -1) {
        shallowDownvotes.splice(userIdInShallowDownvotesIndex, 1)
      }

      Post.update({downvotes: shallowDownvotes}, {where: {id: id}}).then(post => {
        reputation.prepare('post upvote from downvote').save(() => {
          res.sendStatus(204)
        })
      })
    }

    // remove from upvotes (neutralize vote = +1 -> 0)
    if (is.inArray(user.id, shallowUpvotes)) {
      const userIdInShallowUpvotesIndex = shallowUpvotes.indexOf(user.id)

      if (userIdInShallowUpvotesIndex > -1) {
        shallowUpvotes.splice(userIdInShallowUpvotesIndex, 1)
        reputation.prepare('post upvote neutralization')
      }

    } else {
      // increase from 0 (0 -> +1)
      shallowUpvotes.push(user.id)

      reputation.prepare('post upvote')
    }

    Post.update({upvotes: shallowUpvotes}, {where: {id: id}}).then(post => {
      reputation.save(() => {
        res.sendStatus(204)
      })
    })
  })
})

router.patch('/posts/:id/downvote', (req, res) => {
  const {id} = req.params
  const {user} = req.session

  if (!user) { res.sendStatus(401) }

  Post.findById(id, {attributes: ['userId', 'upvotes', 'downvotes']}).then(post => {
    const shallowUpvotes = post.upvotes
    const shallowDownvotes = post.downvotes

    const reputation = new Reputation({giver: user.id, recipient: post.userId})

    // remove from upvotes (+1 -> -1)
    if (is.inArray(user.id, shallowUpvotes)) {
      const userIdInShallowUpvotesIndex = shallowUpvotes.indexOf(user.id)

      if (userIdInShallowUpvotesIndex > -1) {
        shallowUpvotes.splice(userIdInShallowUpvotesIndex, 1)
      }

      Post.update({upvotes: shallowUpvotes}, {where: {id: id}}).then(post => {
        reputation.prepare('post downvote from upvote').save(() => {
          res.sendStatus(204)
        })
      })
    }

    // remove from downvotes (neutralize vote = -1 -> 0)
    if (is.inArray(user.id, shallowDownvotes)) {
      const userIdInShallowDownvotesIndex = shallowDownvotes.indexOf(user.id)

      if (userIdInShallowDownvotesIndex > -1) {
        shallowDownvotes.splice(userIdInShallowDownvotesIndex, 1)
        reputation.prepare('post downvote neutralization')
      }
    } else {
      shallowDownvotes.push(user.id)
      reputation.prepare('post downvote')
    }

    Post.update({downvotes: shallowDownvotes}, {where: {id: id}}).then(post => {
      reputation.save(() => {
        res.sendStatus(204)
      })
    })
  })
})

export default router
