# cmdjs
A cmd tool.

## Vision
To make the best tool for cmd.

## Example
See `test`.

It's very easy. `test/bin.js`:

```js
#!/usr/bin/env node

var cmdJs = require("../index.js");
cmdJs.init({
    configDir : cmdJs.path2.join(__dirname, "config"),
    pluginDir : cmdJs.path2.join(__dirname, "plugin")
}).bin();
```

Then cd to `test`, and execute `npm link ./`. In this way, you can use the `test` command.
