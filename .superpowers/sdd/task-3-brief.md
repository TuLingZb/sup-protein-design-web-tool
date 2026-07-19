# Task 3 Brief — 响应式降级与浏览器验收

目标文件：`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

## 约束

- 不修改 PDB/CIF 解析、选择、删除、改链重编号、撤销/重做、导出逻辑。
- 不修改任何既有 `id`、`data-od-id`、按钮文字、监听器、禁用条件或 ARIA 语义。
- 保留 Task 1 桌面端 `900px × 600px` 深色画布及 Task 2 统一链色映射。
- 仅替换 `@media (max-width: 1024px)` 与 `@media (max-width: 768px)` 的布局规则；保留 `prefers-reduced-motion`。

## 实现

将现有两个单行断点规则替换为：

```css
@media (max-width: 1024px) {
  .appbar, .toolbar, .status-bar { padding-inline: var(--space-4); }
  .workspace {
    grid-template-columns: minmax(0, 1fr);
    width: min(900px, calc(100% - 32px));
    margin-inline: auto;
  }
  .viewer-panel { width: 100%; grid-template-rows: auto 540px auto auto; }
  #viewer { width: 100%; height: 540px; }
  .residue-panel { width: 100%; max-height: 420px; }
}
@media (max-width: 768px) {
  .appbar { align-items: flex-start; flex-direction: column; min-height: auto; }
  .toolbar { padding: var(--space-2) var(--space-4); }
  .tool-group { width: 100%; padding: var(--space-2) 0; border-right: 0; border-bottom: 1px solid var(--line); }
  .tool-label { width: auto; margin-right: auto; }
  .status-bar { align-items: flex-start; flex-direction: column; }
  .workspace { width: calc(100% - 24px); margin-block: var(--space-3) var(--space-6); }
  .viewer-panel { grid-template-rows: auto 380px auto auto; border-radius: var(--radius-sm); }
  #viewer { height: 380px; }
  .viewer-note { display: block; }
  .viewer-note span + span { display: block; margin-top: var(--space-1); }
  .editor-parameter-zone { grid-template-columns: 1fr; }
  .parameter-controls { width: 100%; }
  .parameter-controls button { flex: 1; }
}
```

完成后运行 JavaScript 语法验证，并确认：

- `1280 × 800`：桌面布局规则不被断点覆盖，画布仍为 `900 × 600`。
- `1024 × 800`：工作区单列，画布宽度为可用空间且高度为 `540px`；残基面板位于下方。
- `375 × 812`：画布高度为 `380px`、无页面横向溢出风险，工具栏和参数区可自然折行/堆叠。

报告写入 `/Users/zhangbai/Desktop/protein_design/网页设计/.superpowers/sdd/task-3-report.md`，包含修改内容、验证命令与结果。最终只返回 `DONE` 或 `BLOCKED`、一句摘要和 concerns。
