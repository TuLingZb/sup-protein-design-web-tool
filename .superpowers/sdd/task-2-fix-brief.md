# Task 2 修复 Brief — 统一三维与链清单颜色映射

目标文件：`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

## 必须修复的问题

当前 `renderViewer()` 用经过 `proteinChains` 过滤的索引分配 Cartoon 链色，而 `renderResidueList()` 用局部可见分组的 `chainIndex` 分配 `.chain-mark`。若先出现非蛋白链，或筛选只保留后续链，同一链两处颜色会不一致。

## 约束

- 仅修改颜色索引的展示性逻辑；不得修改 PDB/CIF 解析、选择、删除、改链重编号、撤销/重做、导出、ID、`data-od-id`、按钮文本、监听器、禁用条件或 ARIA。
- 使用一份基于完整当前 `state.atoms` 残基顺序的稳定链顺序，不能基于 `proteinChains` 或 `visibleResidues()` 的局部顺序。
- 三维 Cartoon 蛋白链和侧栏 `.chain-mark` 对同一链必须调用同一颜色解析逻辑。
- 非蛋白链沿用既有 HETATM 表示样式；不增加交互或新编辑功能。

## 实现

在 `visibleResidues()` 后、`renderViewer()` 前定义：

```js
function chainColorFor(chain) {
  const chains = [...new Set(Core.groupResidues(state.atoms).map(residue => residue.chain))];
  const index = chains.indexOf(chain);
  return ChainColors[(index >= 0 ? index : 0) % ChainColors.length];
}
```

在 `renderViewer()` 的 Cartoon 分支中，把：

```js
proteinChains.forEach((chain, index) => state.viewer.setStyle({ chain: chain === '_' ? '' : chain }, { cartoon: { color: ChainColors[index % ChainColors.length] } }));
```

替换为：

```js
proteinChains.forEach(chain => state.viewer.setStyle({ chain: chain === '_' ? '' : chain }, { cartoon: { color: chainColorFor(chain) } }));
```

在 `renderResidueList()` 中：

```js
.map(([chain, residues], chainIndex) => {
```

改回：

```js
.map(([chain, residues]) => {
```

并将：

```js
chainMark.style.backgroundColor = ChainColors[chainIndex % ChainColors.length];
```

替换为：

```js
chainMark.style.backgroundColor = chainColorFor(chain);
```

验证最少两个场景：

1. 当前完整链顺序为“非蛋白链 A、蛋白链 B”，B 的 `.chain-mark` 与 B 的 Cartoon 同为 `ChainColors[1]`。
2. 过滤后仅显示链 B，B 的 `.chain-mark` 仍为 `ChainColors[1]`，不退化成 `ChainColors[0]`。

将报告追加至 `/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/task-2-report.md`，写明代码变更和验证结果。最终只返回 `DONE` 或 `BLOCKED`、一句摘要和 concerns。
