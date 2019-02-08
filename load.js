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

    if (canMerge(targetValue, sourceValue)) {
      result[key] = mergeDeep(targetValue, sourceValue)
    } else if (shouldClone(sourceValue)) {
      const emptyValue = isObject(sourceValue) ? {} : []
      result[key] = mergeDeep(emptyValue, sourceValue)
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

function canMerge(x, y) { return (isObject(x) && isObject(y)) || (isArray(x) && isArray(y)) }
function shouldClone(x) { return isObject(x) || isArray(x) }
function isObject(x) {
  const constructor = getConstructor(x)
  return constructor && constructor instanceof constructor
}
function isArray(x) { return Array.isArray(x) }
function getConstructor(x) { return isObjectLike(x) && Object.getPrototypeOf(x).constructor }
function isObjectLike(x) { return typeof x === 'object' && x !== null }
