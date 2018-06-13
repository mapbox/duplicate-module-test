const test = require('tape');
const fs = require('fs');
const dmt = require('..');

test('handles error for module that does not exist', (assert) => {
  dmt.npmList('fake-module').then((stdout) => {
    assert.fail();
  })
  .catch((err) => {
    assert.ok(err);
    assert.equal(err.message, 'fake-module was not found in the node_modules tree');
    assert.end();
  })
});

test('catch duplicates for OG `npm ls` output (npm version 2.x)', (assert) => {
  const npm2dupes = dmt.testModule({ name: 'test-module', stdout: fs.readFileSync(__dirname + '/fixtures/npm2-ls-dupes', 'utf-8') });
  assert.ok(npm2dupes.duplicates, 'found duplicates');
  assert.equal(npm2dupes.count, 2, 'found 2 duplicates');
  assert.equal(npm2dupes.name, 'test-module', 'has name');

  const npm2nodupes = dmt.testModule({ name: 'test-module', stdout: fs.readFileSync(__dirname + '/fixtures/npm2-ls-no-dupes', 'utf-8') });
  assert.notOk(npm2nodupes.duplicates, 'found no duplicates');
  assert.equal(npm2nodupes.count, 1, 'only one version installed');
  assert.equal(npm2nodupes.name, 'test-module', 'has name');

  assert.end();
});

test('catch duplicates for new-school `npm ls` output which includes the "deduped" text', (assert) => {
  const dupes = dmt.testModule({ name: 'test-module', stdout: fs.readFileSync(__dirname + '/fixtures/npm-ls-dupetext-dupes', 'utf-8') });
  assert.ok(dupes.duplicates, 'found duplicates');
  assert.equal(dupes.count, 2, 'found 2 duplicates');
  assert.equal(dupes.name, 'test-module', 'has name');

  const nodupes = dmt.testModule({ name: 'test-module', stdout: fs.readFileSync(__dirname + '/fixtures/npm-ls-dupetext-deduped', 'utf-8') });
  assert.notOk(nodupes.duplicates, 'found no duplicates');
  assert.equal(nodupes.count, 1, 'only one version installed');
  assert.equal(nodupes.name, 'test-module', 'has name');

  const nodupesMany = dmt.testModule({ name: 'test-module', stdout: fs.readFileSync(__dirname + '/fixtures/npm-ls-dupetext-deduped-many', 'utf-8') });
  assert.notOk(nodupesMany.duplicates, 'found no duplicates from many installs');
  assert.equal(nodupesMany.count, 1, 'only one version installed');
  assert.equal(nodupesMany.name, 'test-module', 'has name');

  const multipleDedupes = dmt.testModule({ name: 'hoek', stdout: fs.readFileSync(__dirname + '/fixtures/npm-ls-multiple-deduped-versions', 'utf-8') })
  assert.ok(multipleDedupes.duplicates, 'found duplicates');
  assert.equal(multipleDedupes.count, 3, 'three dupes');
  assert.equal(multipleDedupes.name, 'hoek', 'has name');

  assert.end();
});
