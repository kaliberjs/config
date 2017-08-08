A small, simple and dependency-free library for configuration

# Recommendations

Do not use `default.js` for development values that are different in other environments. In other words: only use `default.js` for values that are the same for all environments.

Add `local.js` to your `.gitignore` file.

# Usage

Define a configuration file
```
// config/test.js
module.exports = {
  my_config_value: 'test'
}

```

Use the configuration
```
// index.js
const { my_config_value } = require('@kaliber/config')
console.log(my_config_value)
```

Run the command with the correct environment
```
CONFIG_ENV=test node index.js
```

# Features

### `default.js` and `local.js`

Order:
1. `default.js`
2. `${CONFIG_ENV}.js`
3. `local.js`

So any value from `local.js` will override a value from one of the previous configuration files.

### objects

Any nested objects will be combined.

# Motivation

We used the [config npm package](https://www.npmjs.com/package/config) but ran into trouble with out staging/acceptance environment. In that environment we wanted to compile with `NODE_ENV=production` for performance benefits of certain libraries.

We also ran into trouble when we forgot to set an environment variable, the `config` library provided a default instead of throwing an error.

Another motivation was that we only needed a very simple library, the `config` library is 1750 line file full of usefull options that we did not need.
