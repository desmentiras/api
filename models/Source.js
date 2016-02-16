import Sequelize from 'sequelize'
import sequelize from '../sequelize'

import Post from './Post'

const Source = sequelize.define('source', {
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  url: Sequelize.STRING,
  domain: Sequelize.STRING,
  cover: Sequelize.STRING
})

export default Source
