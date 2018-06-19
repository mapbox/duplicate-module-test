const exec = require('child_process').exec;

/**
 * Get the output of `npm ls <module name>`
 *
 */
const npmList = (module) => {
  return new Promise((resolve, reject) => {
    exec(`npm ls ${module}`, (err, stdout, stderr) => {
      if (err && stdout && stdout.match('(empty)')) return reject(new Error(`${module} was not found in the node_modules tree`));
      if (err) return reject(err);
      return resolve({name: module, stdout: stdout});
    });
  });
};

/**
 * Determine if `npm ls` has deduped to a single module
 * or if multiple versions exist in the node_modules tree
 *
 * `npm ls` should only print the module's name once if it has
 * been deduped (in NPM >=5.x the deduped modules will have a
 * "deduped" string that we test for)
 *
 * Returns an object with the module name, a duplicates boolean,
 * and a count of the number of modules found
 *
 */
const testModule = (module) => {
  const match = module.stdout.match(new RegExp(module.name + '@','g'));
  const dedupeMatch = module.stdout.match(new RegExp('deduped','g'));

  let duplicates = true;
  if (dedupeMatch) {
    if (match && dedupeMatch && (match.length - 1 === dedupeMatch.length)) duplicates = false;
  } else {
    if (match && match.length === 1) duplicates = false;
  }

  if (!duplicates) return { duplicates: false, count: 1, name: module.name };
  return { duplicates: true, count: match.length, name: module.name };
};

module.exports = {
  npmList: npmList,
  testModule: testModule
};
