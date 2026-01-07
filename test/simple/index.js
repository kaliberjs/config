const config = /** @type {any} */ (require('../../index'))

if (config.key !== 'value') throw new Error('invalid')
