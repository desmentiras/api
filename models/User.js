import Sequelize from 'sequelize'
import sequelize from '../sequelize'

const User = sequelize.define('user', {
  name: Sequelize.STRING,
  link: Sequelize.STRING,
  picture: Sequelize.STRING,
  email: Sequelize.STRING,
  reputation: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  posts: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  upvotes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  downvotes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

export default User
