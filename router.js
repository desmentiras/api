import fs from 'fs'
import path from 'path'

export default class {
  constructor(app) {
    const normalizedPath = path.join(__dirname, 'routes')

    this.app = app

    this.routes = fs.readdirSync(normalizedPath).map(this.routing.bind(this))
  }

  routing(file) {
    const finalFile = `./routes/${file}`

    this.app.use(require(finalFile))
  }
}
