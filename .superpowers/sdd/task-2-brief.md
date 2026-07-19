# Task 2 Brief — 明亮紧凑控制区与链级残基清单

目标文件：`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

## 约束

- 不修改 PDB/CIF 解析、选择、删除、改链重编号、撤销/重做或 PDB/CIF 导出逻辑。
- 不修改任何既有元素 `id`、`data-od-id`、按钮文本、事件绑定、禁用条件或 ARIA 语义。
- 链色只表达链归属：在三维模型与链分组标记中一致；残基选中态不得使用链色背景。
- 删除按钮可使用危险红色；不可将链色用于按钮状态或状态栏背景。
- Task 1 的深色固定画布与桌面布局不得被改写。

## 操作

1. 在 `renderResidueList()` 中将：

```js
.map(([chain, residues]) => {
```

改为：

```js
.map(([chain, residues], chainIndex) => {
```

并在创建 `summaryLabel` 后、创建 `count` 前插入：

```js
const chainMark = document.createElement('span');
chainMark.className = 'chain-mark';
chainMark.style.backgroundColor = ChainColors[chainIndex % ChainColors.length];
chainMark.setAttribute('aria-hidden', 'true');
summaryLabel.prepend(chainMark);
```

保留原有链 ID、残基数量、选择本链按钮和全部既有监听器。

2. 在既有 CSS 中添加/覆盖以下清单规则：

```css
.residue-panel .panel-head { padding: var(--space-4); }
.residue-panel h2 { font-size: 16px; }
.chain-controls { padding: var(--space-2) var(--space-3); background: var(--bg-soft); }
.chain-summary { min-height: 40px; padding: var(--space-2) var(--space-3); }
.chain-summary > span { display: inline-flex; align-items: center; gap: var(--space-2); }
.chain-mark { width: 8px; height: 20px; flex: 0 0 auto; border-radius: var(--radius-pill); }
.residue-row { min-height: 34px; padding: 6px var(--space-3) 6px var(--space-4); }
.residue-row.selected { background: rgba(17, 27, 43, .08); box-shadow: inset 3px 0 0 var(--ink); }
.residue-name strong { font-family: var(--font-mono); letter-spacing: .02em; }
.residue-list { overscroll-behavior: contain; }
```

删除或覆盖旧 `.residue-row.selected { background: color-mix(...) }` 规则，确保没有通过链色表现选择。

3. 添加/覆盖紧凑工具栏与状态栏规则：

```css
.toolbar { align-items: stretch; min-height: 68px; padding-block: var(--space-2); }
.tool-group { min-height: 52px; padding: var(--space-2) var(--space-3); }
.tool-label { font-size: 10px; }
.tool-group:first-child { padding-left: 0; }
.status-bar { min-height: 32px; padding-block: 6px; }
button#delete-selected { border-color: var(--danger); color: var(--danger); }
button#delete-selected:hover:not(:disabled) { background: color-mix(in srgb, var(--danger) 10%, var(--bg-quiet)); }
```

`export-pdb` 必须继续使用 `.primary`；`export-cif` 必须保持次级样式。

## Report

写详细报告至 `/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/task-2-report.md`，说明精确变更与结构验证。最终只返回 `DONE` 或 `BLOCKED`、一句摘要和 concerns。
