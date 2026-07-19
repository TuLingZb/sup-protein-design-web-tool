const assert = require('node:assert/strict');
const fs = require('node:fs');

const htmlPath = '/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html';
const html = fs.readFileSync(htmlPath, 'utf8');

assert.match(html, /@media \(max-width: 1266px\)/, 'The single-column breakpoint must reserve space for a fixed desktop grid and a traditional vertical scrollbar');
assert.match(html, /createPdbChainMap,/, 'The core must expose its PDB chain mapping for the viewer model');
assert.match(html, /state\.viewerChainMap = Core\.createPdbChainMap\(state\.atoms\);/, 'Rendering must record the original-to-viewer PDB chain map');
assert.match(html, /function viewerChainFor\(chain\) \{[\s\S]*state\.viewerChainMap\.get\(chain\)[\s\S]*return mapped === '_' \? '' : mapped;/, 'Viewer selectors must use the PDB-mapped chain ID');
assert.match(html, /const viewerChain = atom\.chain \|\| '';/, 'Viewer click handling must preserve a blank PDB chain value before reverse lookup');
assert.match(html, /const originalChain = \[\.\.\.state\.viewerChainMap\.entries\(\)\]\.find\(\(\[, mapped\]\) => \(mapped === '_' \? '' : mapped\) === viewerChain\)\?\.\[0\] \|\| viewerChain \|\| '_';/, 'Viewer clicks must map PDB chain IDs back to original chain IDs');
assert.match(html, /chains\.forEach\(chain => state\.viewer\.setStyle\(\{ chain: viewerChainFor\(chain\), hetflag: true \}, \{ stick: \{ color: chainColorFor\(chain\), radius: 0\.18 \}, sphere: \{ color: chainColorFor\(chain\), scale: 0\.28 \} \}\)\);/, 'Cartoon-mode HETATM atoms must use the stable chain color and mapped viewer chain');
assert.doesNotMatch(html, /stick: \{ color: '#292929', radius: 0\.27 \}, sphere: \{ color: '#292929', scale: 0\.32 \}/, 'Selected atoms must not be overwritten with dark gray');
assert.match(html, /chain: viewerChainFor\(atom\.chain\), resi: Number\(atom\.resid\)/, 'Selected atoms must target the PDB-mapped viewer chain');
assert.match(html, /stick: \{ radius: 0\.30, color: '#60A5FA' \}, sphere: \{ scale: 0\.34, color: '#60A5FA' \}/, 'Selected atoms must receive the approved high-contrast overlay while the base chain style remains intact');

console.log('PASS: responsive breakpoint and molecular color semantics satisfy final review constraints.');
