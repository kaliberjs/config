const config = require('../../index')
const other = require('../../load')('otherEnvironment')

if (!config.fromDefault || !config.fromLocal || !config.fromSpecific || config.fromOther) throw new Error('invalid')

if (!other.fromDefault || !other.fromLocal || other.fromSpecific || !other.fromOther) throw new Error('invalid')
