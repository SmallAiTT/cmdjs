# cmdjs
A cmd tool.

## Vision
To make the best tool for cmd.

## Example
See `test`.

It's very easy to write a `bin.js` for cmd:

```js
#!/usr/bin/env node

var cmdJs = require("cmdJs");
require("cmdJs").bin({
    configDir : cmdJs.path2.join(__dirname, "config"),
    pluginDir : cmdJs.path2.join(__dirname, "plugin")
});
```

Cd to `test`, and execute `npm link ./`. In this way, you can use the `test` command.
