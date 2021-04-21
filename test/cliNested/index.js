const { execSync } = require('child_process')

const value = execSync('../../bin/get-config.js cliNested path.to.value', { encoding: 'utf8' })

if (value !== 'value') throw new Error('invalid')
