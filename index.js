const { resolve } = require('path')
const fs = require('fs')

const configDir = resolve(process.cwd(), 'config')
const configEnv = process.env.CONFIG_ENV

if (!configEnv) exit('No configuration environment was passed in, make sure you supply it. Example `CONFIG_ENV=... npm run ...`')

const configFiles = [
  { name: 'default', required: false },
  { name: configEnv, required: true  },
  { name: 'local'  , required: false }
]

module.exports = configFiles.reduce(
  (result, { name, required }) => {
    const configFile = resolve(configDir, name)
    const exists = fs.existsSync(configFile + '.js')

    if (exists) {
      let config
      try { config = require(configFile) }
      catch (e) { exit(e) }

      return mergeDeep(result, config)
    } else {
      if (required) exit(`Could not find configuration for '${name}'`)
      else return result
    }
  },
  {}
)

function mergeDeep(target, source) {
  return Object.keys(source).reduce((result, key) => {
    const targetValue = result[key]
    const sourceValue = source[key]
    if (typeof targetValue === 'object' && targetValue != null && typeof sourceValue === 'object '&& sourceValue != null) {
      result[key] = mergeDeep(targetValue, sourceValue)
    } else {
      result[key] = sourceValue
    }
    return result
  }, target)
}

function exit(error) {
  console.error(error)
  process.exit(1)
}
