const assert = require('node:assert/strict');
const fs = require('node:fs');

const htmlPath = '/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html';
const html = fs.readFileSync(htmlPath, 'utf8');

assert.match(
  html,
  /selectedAtoms\.forEach\(atom => state\.viewer\.addStyle\(\{ chain: viewerChainFor\(atom\.chain\), resi: Number\(atom\.resid\), icode: String\(atom\.icode \|\| ''\)\.trim\(\) \}, \{ line: \{ color: '#E7EDF4', linewidth: 2 \} \}\)\);/,
  'Each selected residue must receive a neutral light line outline without changing chain color'
);

console.log('PASS: selected residues receive a neutral light outline overlay.');
