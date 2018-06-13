#!/usr/bin/env node

const args = require('minimist')(process.argv.slice(2));
const dmt = require('..');

const usage = `Usage:
duplicate-module-test <module 1> <module 2> <module ...n>
`

if (!args._.length) {
  console.error('No modules provided in command');
  console.log(usage);
  process.exit(1);
}

const checks = args._.map((m) => {
  return dmt.npmList(m).then(dmt.testModule);
});

console.log('Checking for duplicate modules ...');
Promise.all(checks).then((modules) => {
  let code = 0;
  modules.forEach((module) => {
    if (!module.duplicates) {
      console.log(`✔ ${module.name} has only one version`);
    } else {
      console.log(`✗ found ${module.count} versions of ${module.name}`);
      code = 1;
    }
  });

  process.exit(code);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
