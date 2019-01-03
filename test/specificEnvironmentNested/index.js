const config = require('../../index')
const other = require('../../load')('otherEnvironment')

if (!config.nested.fromDefault || !config.nested.fromLocal || !config.nested.fromSpecific || config.nested.fromOther) throw new Error('invalid')

if (!other.nested.fromDefault || !other.nested.fromLocal || other.nested.fromSpecific || !other.nested.fromOther) throw new Error('invalid')
