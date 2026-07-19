# Task 1 Brief — PDB 选择样式与相机保持

目标文件：`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

## 目标

将 3Dmol 渲染拆分为结构变化时的 `rebuildViewer({ fit = true })` 与选择/表示变化时的 `refreshViewerStyle()`。点击、清单勾选、批量选择、清空及表示法切换必须保持相机；选中残基叠加 `#60A5FA` 的高对比粗 stick/大 sphere。

## 约束

- 不修改 PDB/CIF 解析、删除、改链重编号、撤销/重做、导出、链映射、ID、`data-od-id`、ARIA、按钮文本、监听器、禁用逻辑或选择集合语义。
- 不引入 RFdiffusion3 的任何固定原子、YAML、contig、linker、IUM 或设计参数功能。
- 选择更新不得调用 `clear()`、`addModel()` 或 `zoomTo()`。
- 导入、恢复、删除、改链重编号、撤销、重做必须自动取景。
- `fit-view` 继续是唯一的手动相机复位入口。

## 操作

1. 创建回归检查文件：`/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/test-selection-preserves-view.js`：

```js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html', 'utf8');
assert.match(html, /function rebuildViewer\(\{ fit = true \} = \{\}\)/);
assert.match(html, /function refreshViewerStyle\(\)/);
assert.match(html, /function updateSelection[\s\S]*?refreshViewerStyle\(\);[\s\S]*?refresh\(\);/);
assert.doesNotMatch(html.match(/function updateSelection[\s\S]*?\n  \}/)?.[0] || '', /rebuildViewer\(|zoomTo\(|clear\(|addModel\(/);
assert.match(html, /selectedAtoms\.forEach\(atom => state\.viewer\.addStyle\([\s\S]*?color: '#60A5FA'[\s\S]*?radius: 0\.30[\s\S]*?scale: 0\.34/);
console.log('PASS: selection refreshes high-contrast style without resetting the camera.');
```

2. 先运行该检查，确认因缺少 `rebuildViewer` / `refreshViewerStyle` 或高亮值而失败。

3. 将现有 `renderViewer()` 改为：

```js
function rebuildViewer({ fit = true } = {}) {
  if (!state.viewer || !state.atoms.length) return;
  state.viewer.clear();
  state.viewerChainMap = Core.createPdbChainMap(state.atoms);
  const modelText = Core.serializePdb(state.atoms);
  state.model = state.viewer.addModel(modelText, 'pdb');
  state.viewer.setClickable({}, true, clickedAtom);
  refreshViewerStyle();
  if (fit) state.viewer.zoomTo();
  state.viewer.render();
}
```

4. 紧接着实现：

```js
function refreshViewerStyle() {
  if (!state.viewer || !state.model || !state.atoms.length) return;
  state.model.setStyle({}, {});
  const residues = Core.groupResidues(state.atoms);
  const chains = [...new Set(residues.map(residue => residue.chain))];
  const proteinChains = chains.filter(chain => state.atoms.some(atom => atom.chain === chain && atom.record.trim() === 'ATOM' && ProteinResidues.has(atom.resname)));
  if (state.representation === 'cartoon') {
    proteinChains.forEach(chain => state.viewer.setStyle({ chain: viewerChainFor(chain) }, { cartoon: { color: chainColorFor(chain) } }));
    chains.forEach(chain => state.viewer.setStyle({ chain: viewerChainFor(chain), hetflag: true }, { stick: { color: chainColorFor(chain), radius: 0.18 }, sphere: { color: chainColorFor(chain), scale: 0.28 } }));
  } else if (state.representation === 'stick') {
    state.viewer.setStyle({}, { stick: { radius: 0.16 } });
  } else {
    state.viewer.setStyle({}, { stick: { radius: 0.13 }, sphere: { scale: 0.25 } });
  }
  const selectedAtoms = state.atoms.filter(atom => state.selection.has(Core.residueKey(atom)));
  selectedAtoms.forEach(atom => state.viewer.addStyle(
    { chain: viewerChainFor(atom.chain), resi: Number(atom.resid), icode: String(atom.icode || '').trim() },
    { stick: { radius: 0.30, color: '#60A5FA' }, sphere: { scale: 0.34, color: '#60A5FA' } }
  ));
  state.viewer.render();
}
```

删除现有选中态的 `setStyle` 和浅色 `line` 描边，以防重叠。

5. 将 `updateSelection()` 改为调用 `refreshViewerStyle()`，不再调用旧模型重建函数。表示按钮同样改为 `refreshViewerStyle(); refresh();`。

6. 将导入、恢复、删除、改链重编号、撤销和重做路径中的旧 `renderViewer()` 调用改成 `rebuildViewer()`，保留默认 `fit: true`。

7. 运行：

```bash
node "/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/test-selection-preserves-view.js"
node "/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/test-responsive-and-chain-semantics.js"
node "/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/test-viewer-canvas-containment.js"
```

并编译内联 JavaScript。把完整报告写到 `/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/pdb-selection-camera-task-1-report.md`。最终只返回 DONE/BLOCKED、一句结果和 concerns。
