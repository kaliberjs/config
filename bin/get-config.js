#!/usr/bin/env node

try {
  const [configEnv, path] = process.argv.slice(2)

  if (!configEnv) exit('No configuration environment was passed in, make sure you supply it. Example `kaliber-config ... my_config_value`')
  if (!path) exit(`No path was passed in, make sure you supply it. Example \`kaliber-config ${configEnv} ...\``)

  const load = require('../load')
  const config = load(configEnv)
  const result = path.split('.').reduce((result, part) => result[part], config)
  process.stdout.write(result)
  process.exit(0)
} catch (e) {
  exit(e)
}

function exit(e) {
  console.error(e)
  process.exit(1)
}
