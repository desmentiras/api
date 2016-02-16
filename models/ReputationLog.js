import Sequelize from 'sequelize'
import sequelize from '../sequelize'

import ReputationReference from './ReputationReference'

const ReputationLog = sequelize.define('reputationLog', {
  giver: Sequelize.STRING,
  recipient: Sequelize.STRING,
  reputationReferenceId: Sequelize.INTEGER
})

export default ReputationLog
