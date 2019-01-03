const config = require('../../index')

if (!config.fromDefault || !config.fromLocal || !config.fromSpecific || config.fromOther) throw new Error('invalid')

const other = require('../../load')('otherEnvironment')

if (!other.fromDefault || !other.fromLocal || other.fromSpecific || !other.fromOther) throw new Error('invalid')
