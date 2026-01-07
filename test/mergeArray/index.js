const { arrayValue: [x, y] } = /** @type {any} */ (require('../../index'))

if (!x.fromDefault || !y.fromDefault || x.value !== 2 || y.value !== 2 || !x.fromMerge) throw new Error('failure')
