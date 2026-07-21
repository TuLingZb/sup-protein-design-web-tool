# SUP Protein Design Web Tool

> 面向蛋白结构预处理与 **RFdiffusion3** 设计输入准备的纯前端工作台。

[![License: MIT](https://img.shields.io/badge/License-MIT-4c6ef5.svg)](LICENSE)

SUP Protein Design Web Tool 将常用的 PDB / mmCIF 结构操作集中到一个可直接在浏览器运行的静态页面集合中。它适合在进入扩散设计、结构预测和后续分析前，先完成结构检查、链操作、坐标对齐及 RFdiffusion3 输入配置。

> **本地优先：** 结构文件在浏览器会话中处理；本项目不包含后端服务，也不会将文件上传到项目服务器。

## 功能

### PDB 文件重新编辑

在 `pdb_editor_workbench.html` 中加载 PDB、ENT 或标准 mmCIF 文件，并在浏览器内完成残基选择、删除、重编号、残基/链重命名等结构整理操作。编辑结果可下载为 PDB 或 mmCIF 格式。

### 链复制与骨架对齐

`chain_alignment_workbench.html` 支持导入 PDB、ENT、PQR 与 CIF 结构，浏览和复制链，并基于主链原子执行刚体对齐。可在三维查看器中检查结果，并导出更新后的 PDB 文件。

### RFdiffusion3 骨架输入构建

`rfd3_scaffold_studio.html` 用于将结构选择整理为 RFdiffusion3 设计输入。页面提供三维结构查看、固定区域选择、contig 组装、连接肽长度、扩散和采样参数、YAML 配置及运行命令生成，并可下载 YAML 与归一化 PDB 输入。

### 工作流入口

`index.html` 是蛋白设计工作流总览，`step-scaffold.html` 集中链接当前可用的骨架设计工具。靶点分析、序列优化、结构预测、分子动力学、结合分析和序列比对等导航项保留为后续扩展入口；对应页面尚未包含在当前仓库中。

## 快速开始

这是一个静态前端项目，无需安装依赖或启动后端。克隆仓库后，任选一种方式打开首页：

```bash
git clone https://github.com/TuLingZb/sup-protein-design-web-tool.git
cd sup-protein-design-web-tool
open index.html
```

也可以启动本地静态服务器：

```bash
python3 -m http.server 8000
```

然后在浏览器访问 [http://localhost:8000](http://localhost:8000)。

## 使用建议

先从 `index.html` 或 `step-scaffold.html` 进入骨架设计工具。若需要清理原始结构，先使用 PDB 文件重新编辑工具；若需要复制或对齐链，使用链复制与骨架对齐工作台；随后在 RFdiffusion3 骨架输入构建器中选择需要固定或扩散的区域，检查自动生成的 YAML 和命令，再将下载的文件交给你的 RFdiffusion3 运行环境。

本项目生成的是结构文件和设计配置，不会在浏览器中运行 RFdiffusion3 推理。请结合自己的计算环境、模型版本和实验验证流程使用输出结果。

## 页面说明

| 页面 | 用途 |
| --- | --- |
| `index.html` | 蛋白设计工作流总览与工具入口 |
| `step-scaffold.html` | 骨架设计工具选择页 |
| `pdb_editor_workbench.html` | PDB/mmCIF 结构编辑与导出 |
| `chain_alignment_workbench.html` | PDB 链复制、主链刚体对齐与导出 |
| `rfd3_scaffold_studio.html` | RFdiffusion3 骨架输入、YAML 与命令构建 |

## 技术说明

项目以原生 HTML、CSS 和 JavaScript 编写，页面可作为静态站点部署。三维结构可视化依赖 [3Dmol.js](https://3dmol.csb.pitt.edu/)，字体与该外部脚本通过 CDN 加载，因此首次使用时需要网络连接。文件解析、编辑状态和下载操作均在浏览器端完成。

## 浏览器支持

建议使用最新版 Chrome、Edge、Firefox 或 Safari。为了获得完整的三维结构视图与文件下载体验，请在桌面浏览器中使用。

## 许可证

本项目采用 [MIT License](LICENSE)。
