import Sequelize from 'sequelize'
import sequelize from '../sequelize'

import User from './User'
import Source from './Source'

const Post = sequelize.define('post', {
  title: Sequelize.STRING,
  slug: Sequelize.STRING,
  content: Sequelize.STRING,
  views: Sequelize.INTEGER,
  upvotes: Sequelize.ARRAY(Sequelize.STRING),
  downvotes: Sequelize.ARRAY(Sequelize.STRING)
})

Post.belongsTo(User)
Post.hasOne(Source)

export default Post
