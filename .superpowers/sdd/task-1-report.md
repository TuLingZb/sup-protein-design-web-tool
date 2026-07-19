# Task 1 实施报告 — 固定深色三维检查台

## 目标文件

`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

## 已完成变更

### JavaScript

- `initialiseViewer()`：将唯一的 3Dmol 初始化背景配置从 `backgroundColor: '#FFFFFF'` 改为 `backgroundColor: '#111B2B'`。
- 未改动任何 PDB/CIF 解析、残基选择、删除、改链重编号、撤销/重做、导出或事件绑定逻辑。

### CSS

- 新增 `body { min-width: 0; }`。
- `.appbar`、`.toolbar`、`.status-bar`：将水平内边距改为 `max(var(--space-4), calc((100vw - 1260px) / 2))`，使其与 1260px 桌面工作区对齐。
- `.workspace`：替换旧的全屏弹性栅格，改为固定的 `900px 300px` 双列布局；设置顶部对齐、`var(--space-5)` 间距、最大 1260px 宽度、`calc(100% - 32px)` 窄屏宽度限制以及指定外边距。
- `.viewer-panel`：替换旧的弹性画布行，改为 `auto 600px auto auto`；设为 900px 宽，并补充隐藏溢出、边框、圆角和抬升阴影。
- `#viewer`：替换旧的 `min-height: 440px` 规则，设为 `width: 900px`、`height: 600px`、`min-height: 0`，CSS 背景为 `#111B2B`，并增加上下半透明白色边框。
- `.residue-panel`：保留既有网格行定义，补充 `height: 100%`、`max-height: 748px`、隐藏溢出、边框、圆角和阴影。

## 明确保留的内容

- 未修改任何 HTML `id`、`data-od-id`、ARIA 属性或初始 `disabled` 属性。
- 未修改 HTML 元素结构。
- 未修改 JavaScript 事件绑定、状态刷新或禁用逻辑。
- 未修改三个既有响应式媒体查询，包括 `max-width: 1024px`、`max-width: 768px` 和减少动态效果规则。

## 结构验证

使用 Python 正则结构检查，全部通过：

1. `createViewer('viewer', { backgroundColor: '#111B2B' })` 存在。
2. `body { min-width: 0; }` 存在。
3. `.appbar`、`.toolbar`、`.status-bar` 均使用 1260px 对齐的水平内边距公式。
4. `.workspace` 精确包含 `grid-template-columns: 900px 300px`、指定间距、宽度、最小高度与外边距。
5. `.viewer-panel` 精确包含 `grid-template-rows: auto 600px auto auto` 及 `width: 900px`。
6. `#viewer` 精确包含 900px 宽、600px 高以及 `#111B2B` CSS 背景。
7. `.residue-panel` 精确包含 100% 高度、748px 最大高度、溢出控制、边框、圆角和阴影。
8. 已确认旧的全屏工作区规则和旧的 440px 弹性画布规则均已移除。
9. 已确认两个断点媒体查询仍存在，未调整响应式规则。
10. `data-od-id` 属性数量保持为 30。
11. HTML 包含 3 个成对的 `<script>` 标签与 1 个成对的 `<style>` 标签，结构完整。

## 结论

固定桌面工作区总宽为 900 + 18 + 300 = 1218px，小于最大约束 1260px；画布与残基面板之间保留 18px 间隙，不会在桌面工作区中重叠或互相裁切。响应式覆盖规则按要求未改动，后续任务可单独处理窄屏行为。
