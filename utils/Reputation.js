import User from '../models/User'
import ReputationLog from '../models/ReputationLog'
import ReputationReference from '../models/ReputationReference'

export default class {
  constructor({giver, recipient}) {
    this.giver = giver
    this.recipient = recipient
  }

  prepare(reason) {
    this.reason = reason

    return this
  }

  save(successCallback) {
    const {giver, recipient, reason} = this

    ReputationReference.find({where: {reason: reason}}).then(reputationReference => {
      const quantity = reputationReference.quantity

      User
        .findById(recipient, {attributes: ['reputation']})
        .then(user => {
          let reputation = quantity + user.reputation

          if (reputation < 0) {
            reputation = 0
          }

          User
            .update({reputation: reputation}, {where: {id: recipient}})
            .then(() => {
            ReputationLog.create({
              giver: giver,
              recipient: recipient,
              reputationReferenceId: reputationReference.id
            })

            successCallback()
          })
        })
    })
  }
}
