# Task 2 实施报告

## 目标文件

`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

## 精确变更

### 链级标记

- 在 `renderResidueList()` 的链分组映射回调中新增 `chainIndex` 参数。
- 在链标题文本创建后、残基计数创建前插入 `span.chain-mark`：
  - 背景色取自 `ChainColors[chainIndex % ChainColors.length]`；
  - 设置 `aria-hidden="true"`；
  - 通过 `summaryLabel.prepend(chainMark)` 放入原有链标题标签。
- 原有链 ID 文本、残基数量、`选择本链` 按钮文字、按钮监听器和残基渲染流程均未改变。

### 残基清单样式

- 残基面板头部保持 `display: block`，并设置 `padding: var(--space-4)`。
- 将残基面板标题字号设为 `16px`。
- 链控制区改为紧凑留白并使用 `var(--bg-soft)` 背景。
- 链摘要设为最小高度 40px、紧凑内边距；标题内部 `span` 使用 inline-flex。
- 新增 8px × 20px 的圆角 `.chain-mark`，仅表示链归属。
- 残基行设为最小高度 34px 和指定紧凑内边距。
- `.residue-row.selected` 改为深色中性轻背景及 `var(--ink)` 左侧内阴影；移除了旧的 `color-mix(... var(--ink) ...)` 选中规则，未使用链色。
- 残基名称加强等宽字体字距，并为残基列表启用 `overscroll-behavior: contain`。

### 工具栏、状态栏与删除按钮

- 工具栏使用 stretch 对齐、最小高度 68px 和紧凑的纵向留白。
- 工具分组最小高度改为 52px，水平留白改为 `var(--space-3)`；首组左留白仍为 0。
- 工具标签字号改为 10px。
- 状态栏最小高度改为 32px，纵向留白改为 6px。
- `#delete-selected` 使用危险色边框与文字；悬停状态使用危险色 10% 混合背景。
- `#export-pdb` 仍有 `.primary`；`#export-cif` 未新增 `.primary`，保持次级样式。

## 结构验证

执行的验证项均通过：

1. 链级映射包含 `chainIndex`，并创建、着色、隐藏并前置 `.chain-mark`。
2. 选中残基样式为中性深色，不包含旧的 `color-mix(in srgb, var(--ink) 8%, var(--bg-quiet))` 规则。
3. Task 1 固定三维画布保持 `width: 900px`、`height: 600px`、`background: #111B2B`。
4. 保留桌面工作区尺寸和 `max-width: 1024px`、`max-width: 768px` 响应式媒体查询。
5. 导出按钮样式语义保持：PDB 为 primary，CIF 为次级。
6. 从两个内联脚本提取后运行 `node --check`，JavaScript 语法通过。

## Concerns

无。浏览器预览服务未在当前会话中运行，因此未进行交互式视觉截图验证；已完成静态结构与脚本语法验证。

---

## Task 2 颜色映射修复（2026-07-18）

### 代码变更

目标：`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

- 在 `visibleResidues()` 后新增 `chainColorFor(chain)`。该函数从完整当前 `state.atoms` 的 `Core.groupResidues(state.atoms)` 残基顺序构建稳定链顺序并解析 `ChainColors`。
- `renderViewer()` 的 Cartoon 蛋白链着色改为调用 `chainColorFor(chain)`，不再依据已过滤的 `proteinChains` 局部索引。
- `renderResidueList()` 移除了局部分组的 `chainIndex` 参数，`.chain-mark` 改为调用同一 `chainColorFor(chain)`。
- 未改动 PDB/CIF 解析、选择、删除、改链重编号、历史、导出、ID/data-od-id、按钮文本/监听器、禁用条件、ARIA 或 HETATM 表示样式。

### 命令与结果

执行命令：

```sh
python3 - <<'PY'
# 读取目标 HTML，提取两个内联脚本并分别执行 node --check；
# 静态确认四处规定补丁且旧局部颜色索引已删除；
# 构造 A(HETATM) → B(ATOM/ALA) 的顺序，验证 chainColorFor(B)。
PY
```

结果：

```text
syntax: PASS (2 inline scripts)
scenario 1: PASS (B Cartoon and chain mark resolve #5b6750 = ChainColors[1])
scenario 2: PASS (filtered visible B chain mark resolves #5b6750 = ChainColors[1])
```

### 场景验证证据

1. 完整残基链顺序为非蛋白链 `A`、蛋白链 `B` 时，`chainColorFor('B')` 使用完整顺序中索引 `1`，Cartoon 与 `.chain-mark` 均解析为 `ChainColors[1]`（`#5b6750`）。
2. 仅筛选显示链 `B` 时，侧栏仍传入 `chainColorFor('B')`；函数仍读取完整 `state.atoms`，故解析为 `ChainColors[1]`，不会退化为 `ChainColors[0]`。

### Concerns

无。验证为代码级静态场景与 JavaScript 语法检查；未启动浏览器进行交互式渲染验证。
