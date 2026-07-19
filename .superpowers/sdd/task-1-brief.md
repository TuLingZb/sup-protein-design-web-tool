# Task 1 Brief — 固定深色三维检查台

目标文件：`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

## 约束

- 只调整视觉 CSS 和 `initialiseViewer()` 的 `backgroundColor`；不改动 PDB/CIF 解析、选择、删除、改链重编号、撤销/重做与导出逻辑。
- 不修改任何现有元素的 `id`、`data-od-id`、事件绑定、禁用条件或 ARIA 语义。
- 桌面端 `#viewer` 必须为 `900px × 600px`，JavaScript 与 CSS 的背景均为 `#111B2B`。
- 桌面端工作区最大约 `1260px`；画布与右侧残基面板不遮挡、裁切或重叠。

## 操作

1. 在 `initialiseViewer()` 仅将 `backgroundColor: '#FFFFFF'` 改为 `backgroundColor: '#111B2B'`。
2. 在 CSS 中将工作区替换为以下固定画布布局，同时移除/覆盖旧的全屏拉伸规则：

```css
body { min-width: 0; }
.appbar, .toolbar, .status-bar { padding-inline: max(var(--space-4), calc((100vw - 1260px) / 2)); }
.workspace {
  display: grid;
  grid-template-columns: 900px 300px;
  align-items: start;
  gap: var(--space-5);
  width: min(1260px, calc(100% - 32px));
  min-height: auto;
  margin: var(--space-5) auto var(--space-8);
}
.viewer-panel {
  display: grid;
  grid-template-rows: auto 600px auto auto;
  width: 900px;
  min-width: 0;
  overflow: hidden;
  background: var(--bg-quiet);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-raised);
}
#viewer {
  width: 900px;
  min-height: 0;
  height: 600px;
  background: #111B2B;
  border-block: 1px solid rgba(255, 255, 255, .12);
}
.residue-panel {
  height: 100%;
  max-height: 748px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
}
```

Do not make responsive media-query changes: a later task owns them.

## Report

Write a detailed report to `/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/task-1-report.md`: changed selectors and exact verification performed. In your final response return only `DONE` or `BLOCKED`, one-line result, and concerns.
