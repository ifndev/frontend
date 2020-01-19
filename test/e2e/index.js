import { resolve } from 'path'
import test from 'ava'
import { Nuxt, Builder } from 'nuxt'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null

// Init Nuxt.js and create a server listening on localhost:4000
test.before(async () => {
  const config = {
    dev: false,
    rootDir: resolve(__dirname, '../../')
  }
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.server.listen(4000, 'localhost')
}, 30000)

// Tests here...

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.js', (t) => {
  nuxt.close()
})