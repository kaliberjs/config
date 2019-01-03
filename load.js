const { resolve } = require('path')
const fs = require('fs')

module.exports = function load(configEnv) {
  const configDir = resolve(process.cwd(), 'config')
  const configFiles = [
    { name: 'default', required: false },
    { name: configEnv, required: true  },
    { name: 'local'  , required: false }
  ]

  return configFiles.reduce(
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
}

function mergeDeep(target, source) {
  return Object.keys(source).reduce((result, key) => {
    const targetValue = result[key]
    const sourceValue = source[key]
    const targetIsObject = typeof targetValue === 'object' && targetValue !== null
    const sourceIsObject = typeof sourceValue === 'object' && sourceValue !== null
    if (sourceIsObject) {
      const emptyValue = Array.isArray(sourceValue) ? [] : {}
      result[key] = mergeDeep(targetIsObject ? targetValue : emptyValue, sourceValue)
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
