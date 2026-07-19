# Task 3 Report — 响应式降级与浏览器验收

## 修改内容

目标文件：`/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html`

仅替换了以下两个响应式媒体查询的布局规则，保留了 `@media (prefers-reduced-motion: reduce)`：

- `@media (max-width: 1024px)`
  - 应用栏、工具栏和状态栏改用统一的行内边距。
  - 工作区转为单列，宽度限制为 `min(900px, calc(100% - 32px))` 并水平居中。
  - 查看器面板及画布宽度为 `100%`，画布高度为 `540px`。
  - 残基面板全宽，最大高度为 `420px`。
- `@media (max-width: 768px)`
  - 保留原有应用栏、工具栏、状态栏、工具组、提示信息和参数区的堆叠行为。
  - 工作区宽度调整为 `calc(100% - 24px)`，使用指定块向边距。
  - 查看器网格中的画布行和画布高度调整为 `380px`，面板圆角降为 `var(--radius-sm)`。

未更改 JavaScript、HTML 结构、ID、`data-od-id`、按钮文本、事件监听器、禁用逻辑、ARIA 属性、桌面端查看器尺寸、链色映射或减少动态效果规则。

## 验证命令与结果

```sh
node -e "const fs=require('fs'); const vm=require('vm'); const html=fs.readFileSync('/Users/zhangbai/Library/Application Support/Open Design/namespaces/release-stable/data/projects/76e284b0-af2c-40f2-bb57-f3b5f6037737/pdb_editor_workbench.html','utf8'); const scripts=[...html.matchAll(/<script(?![^>]*\\bsrc=)[^>]*>([\\s\\S]*?)<\\/script>/gi)].map((m)=>m[1]); if(scripts.length!==2) throw new Error('Expected 2 inline scripts, found '+scripts.length); scripts.forEach((source,index)=>new vm.Script(source,{filename:'inline-script-'+(index+1)+'.js'})); console.log('JavaScript syntax validation passed: '+scripts.length+' inline scripts compiled.');"
```

结果：通过。两个内联 JavaScript 块均成功编译。

结构化 CSS 规则检查及视口计算结果：

| 视口 | 结果 |
| --- | --- |
| `1280 × 800` | 不命中两个最大宽度断点；工作区为 `1248px`，查看器仍为 `900 × 600px`。 |
| `1024 × 800` | 命中 `1024px` 断点；工作区和查看器宽度均为 `900px`，单列布局，画布高度 `540px`，残基面板在查看器下方。 |
| `375 × 812` | 命中两个断点；工作区和查看器宽度为 `351px`，画布高度 `380px`。工作区为视口减 `24px`，工具栏具有 `16px` 行内边距，规则未保留固定宽度画布，因而无页面横向溢出风险。 |

## Concerns

无。浏览器预览服务器未启动，因此验收使用 CSS 规则存在性检查与指定视口的结构化尺寸计算；JavaScript 语法验证已实际执行并通过。
