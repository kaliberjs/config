const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const tests = fs.readdirSync(__dirname).filter(file => fs.lstatSync(path.resolve(__dirname, file)).isDirectory())

Promise.all(
  tests.map(test => {
    const testDir = path.resolve(__dirname, test)
    const expect = require(`${testDir}/expect`)

    const options = {
      cwd: testDir,
      env: { PATH: process.env.PATH }
    }
    if ((expect.config || {}).passConfigEnv !== false) options.env.CONFIG_ENV = test

    return new Promise(resolve => {

      exec('node index.js', options, (err, stdout, stderr) => {
        const [firstLine] = stderr && stderr.split('\n') || []
        resolve(
          err
            ? ( expect.error
              ? ( firstLine === expect.output
                ? { test }
                : { test, failure: `Expected: "${expect.output}"\nOutput: "${firstLine}"` }
              )
              : { test, failure: `Unexpected ${err}`}
            )
            : ( expect.error
              ? { test, failure: `Expected error with output ${expect.output}` }
              : { test }
            )
        )
      })
    })
  })
)
  .then(results => results.reduce((result, { test, failure }) => {
    console.log(`${ failure ? 'x' : '✓' } ${test}`)
    if (failure) console.log(failure)

    return result || failure
  }, false))
  .then(failed => {
    if (failed) process.exit(1)
    else process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
