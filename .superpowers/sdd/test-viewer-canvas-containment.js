const assert = require('node:assert/strict');
const fs = require('node:fs');

const htmlPath = '/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const viewerRule = html.match(/#viewer\s*\{([\s\S]*?)\n\}/);

assert.ok(viewerRule, 'Expected a #viewer CSS rule');
assert.match(viewerRule[1], /position:\s*relative\s*;/, 'The #viewer must establish a positioning context for 3Dmol absolute canvas children');
assert.match(viewerRule[1], /overflow:\s*hidden\s*;/, 'The #viewer must clip 3Dmol canvas children to the viewer bounds');

console.log('PASS: #viewer contains the 3Dmol canvas within its own bounds.');
