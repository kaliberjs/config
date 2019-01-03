const configEnv = process.env.CONFIG_ENV

if (!configEnv) exit('No configuration environment was passed in, make sure you supply it. Example `CONFIG_ENV=... npm run ...`')

const load = require('./load')

module.exports = load(configEnv)

function exit(error) {
  console.error(error)
  process.exit(1)
}
