const { resolve } = require('path')
const fs = require('fs')

module.exports = load

/**
 * @arg {string} configEnv
 * @returns {unknown}
 */
function load(configEnv) {
  const configDir = resolve(process.cwd(), 'config')
  const configFiles = [
    { name: 'default', required: false },
    { name: configEnv, required: true  },
    { name: 'local', required: false }
  ]

  return configFiles.reduce(
    (result, { name, required }) => {
      const configFile = resolve(configDir, name)
      const exists = fs.existsSync(configFile + '.js')

      if (exists) {
        let config
        try { config = require(configFile) } catch (e) { exit(e) }

        return mergeDeep(result, config)
      } else {
        if (required) return exit(`Could not find configuration for '${name}'`)
        else return result
      }
    },
    /** @type {Record<string, any>} */ ({})
  )
}

/**
 * @arg {Record<string, any>} target
 * @arg {Record<string, any>} source
 */
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

/**
 * @arg {any} error
 * @returns {never}
 */
function exit(error) {
  console.error(error)
  process.exit(1)
}

/**
 * @template A
 * @template B
 * @arg {A} x
 * @arg {B} y
 * @returns {x is B}
 */
function canMerge(x, y) { return (isObject(x) && isObject(y)) || (isArray(x) && isArray(y)) }
/**
 * @arg {any} x
 * @returns {x is Record<string, any> | Array<any>}
 */
function shouldClone(x) { return isObject(x) || isArray(x) }
/**
 * @arg {any} x
 * @returns {x is Record<string, any>}
 */
function isObject(x) {
  const constructor = getConstructor(x)
  return constructor && constructor instanceof constructor
}
/**
 * @arg {any} x
 * @returns {x is Array<any>}
 */
function isArray(x) { return Array.isArray(x) }
/** @arg {any} x */
function getConstructor(x) { return isObjectLike(x) && Object.getPrototypeOf(x).constructor }
/**
 * @arg {any} x
 */
function isObjectLike(x) { return typeof x === 'object' && x !== null }
