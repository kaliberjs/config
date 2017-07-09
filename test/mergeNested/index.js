const { nested: n } = require('../../index')

if (!n.default || !n.local || !n.mergeNested) throw new Error('failure')
