const config = require('../../index')
const other = require('../../load')('otherEnvironment')

if (!config.nested.nested.fromDefault || !config.nested.nested.fromLocal || !config.nested.nested.fromSpecific || config.nested.nested.fromOther) throw new Error('invalid')

if (!other.nested.nested.fromDefault || !other.nested.nested.fromLocal || other.nested.nested.fromSpecific || !other.nested.nested.fromOther) throw new Error('invalid')
