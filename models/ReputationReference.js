import Sequelize from 'sequelize'
import sequelize from '../sequelize'

import ReputationLog from './ReputationLog'

const ReputationReference = sequelize.define('reputationReference', {
  reason: Sequelize.STRING,
  quantity: Sequelize.INTEGER
})

export default ReputationReference
