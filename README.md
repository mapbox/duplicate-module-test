# Duplicate module test

A small command line utility used to test for duplicate installs of a module or list of modules using NPM's `npm ls` command output. Particularly helpful for [node addons](https://github.com/mapbox/cpp/blob/master/node-cpp.md) where you want to be :100: sure there is only a single version of a binary installed before executing your code. More background as to why avoiding duplicate binaries is important [here](https://github.com/mapbox/cpp/blob/master/node-cpp.md#versioning).

## Usage

The primary usage is via the CLI command, `duplicate-module-test`, which assumes every argument passed in is the name of a module in the node_modules tree to test.

Example command
```
duplicate-module-test @mapbox/vtquery mapnik something-else
```

Output will look something like:
```
Checking for duplicate modules ...
✔ @mapbox/vtquery has only one version
✗ found 2 versions of mapnik
✔ something-else has only one version
```

#### Pretest

The command is particularly helpful added as a `pretest` command in your package.json document. This can be run in tandem with other pretest commands, like linters.

```json
{
  "scripts": {
    "test": "node tests.js",
    "pretest": "duplicate-module-test module-one module-two && eslint index.js"
  }
}
```
