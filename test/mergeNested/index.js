const { nested: n } = /** @type {any} */ (require('../../index'))

if (!n.default || !n.local || !n.mergeNested) throw new Error('failure')
