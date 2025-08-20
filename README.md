# InstallmentTracker

[![CI](https://github.com/JackyCZJ/installment-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/jackyczj/payslip/actions/workflows/ci.yml)
[![Deploy](https://github.com/JackyCZJ/installment-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/jackyczj/payslip/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5-green)](https://vuejs.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

一个基于 Vue 3 + TypeScript + Tailwind CSS 的分期账单追踪器，用于计算和管理分期还款计划。

## 功能特性

- 📊 **实时计算**：输入账单信息后实时计算还款计划
- 💰 **等额本息**：支持等额本息还款方式计算
- 📈 **详细统计**：显示总利息、还款进度等统计信息
- 📋 **还款计划表**：详细的每期还款计划表格
- 📊 **数据可视化**：图表分析账单分布、利率对比、还款进度等
- 💳 **账单管理**：支持多账单管理，总账单统计
- 📱 **数据持久化**：基于 localStorage 的数据存储
- 📤 **数据导出**：支持导出 Excel 和 PDF 格式
- 💼 **工资分析**：月工资与还款能力分析
- 🌍 **国际化支持**：支持简体中文、繁体中文、英文三种语言
- 💰 **多币种支持**：支持 20 种常用货币，包括人民币、美元、欧元等
- 🔄 **多种还款方式**：支持等额本息和等本等息两种计算方式
- 🎨 **响应式设计**：支持桌面端和移动端
- ✅ **输入验证**：完善的表单验证和错误提示
- 📱 **PWA 支持**：可安装为桌面/移动应用，支持离线使用

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **样式框架**：Tailwind CSS
- **构建工具**：Vite
- **包管理器**：pnpm
- **国际化**：Vue I18n
- **币种管理**：自定义币种配置系统
- **图表库**：Chart.js + Vue-ChartJS
- **PWA 支持**：Service Worker + Web App Manifest
- **代码规范**：ESLint + Prettier

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码格式化

```bash
pnpm format
```

### 生成 PWA 图标

```bash
pnpm generate-icons
```

## 使用说明

1. **语言和币种设置**：
   - 点击页面右上角的语言切换器选择语言
   - 点击币种选择器选择货币（支持 20 种常用货币）
   - 设置会自动保存到本地

2. **输入账单信息**：
   - 账单名称：为账单设置一个名称
   - 账单来源：账单的来源（如银行、平台等）
   - 还款方式：选择等额本息或等本等息
   - 账单总金额：分期账单的总金额
   - 分期数：总的分期还款期数
   - 年利率：年化利率（百分比）
   - 已还分期数：已经还款的期数
   - 已还金额：自动计算（基于年利率和已还期数）

3. **管理账单**：
   - 点击"确认"按钮将账单添加到总账单表
   - 在总账单表中查看所有账单的汇总信息
   - 支持删除和选择账单

4. **数据分析**：
   - 点击"数据分析"按钮查看图表分析
   - 支持金额分布、利率对比、还款进度等多种图表
   - 输入月工资进行还款能力分析

5. **数据导出**：
   - 支持导出 Excel 格式的账单数据
   - 支持导出 PDF 格式的分析报告

6. **PWA 安装**：
   - 在 Chrome 浏览器中访问应用
   - 点击地址栏右侧的安装图标
   - 或等待安装提示自动出现
   - 安装后可在桌面/主屏幕启动应用
   - 支持离线使用基本功能

## 项目结构

```
src/
├── components/          # Vue 组件
│   ├── InstallmentForm.vue      # 输入表单组件
│   ├── StatisticsCard.vue       # 统计信息卡片
│   ├── PaymentPlanTable.vue     # 还款计划表格
│   ├── BillList.vue             # 账单列表组件
│   └── BillAnalysis.vue         # 数据分析组件
├── composables/         # 组合式函数
│   ├── useInstallmentCalculator.ts  # 计算逻辑
│   └── useBillManager.ts            # 账单管理逻辑
├── i18n/                # 国际化
│   ├── index.ts         # i18n 配置
│   └── locales/         # 语言文件
│       ├── zh-CN.json   # 简体中文
│       ├── zh-TW.json   # 繁体中文
│       └── en.json      # 英文
├── config/              # 配置文件
│   └── currencies.ts    # 币种配置
├── types/               # TypeScript 类型定义
│   └── installment.ts   # 分期账单相关类型
├── assets/              # 静态资源
└── App.vue              # 主应用组件
```

## 计算逻辑

### 还款方式

#### 等额本息 (Equal Payment)

每月还款额相同，前期利息多，后期本金多。

**计算公式**：

```
月还款额 = 本金 × 月利率 × (1 + 月利率)^期数 / [(1 + 月利率)^期数 - 1]
```

**特点**：

- 每月还款压力相同
- 前期主要还利息，后期主要还本金
- 总利息支出较多

#### 等本等息 (Equal Principal)

每月本金相同，利息递减，总还款额递减。

**计算公式**：

```
月本金 = 剩余本金 ÷ 剩余期数
月利息 = 剩余本金 × 月利率
月还款额 = 月本金 + 月利息
```

**特点**：

- 前期还款压力大，后期压力小
- 每月本金固定，利息递减
- 总利息支出较少

### 通用参数

- 月利率 = 年利率 ÷ 12
- 本金 = 账单总金额 - 已还金额
- 期数 = 总分期数 - 已还分期数

## 开发说明

### 添加新功能

1. 在 `src/types/` 中添加类型定义
2. 在 `src/composables/` 中添加业务逻辑
3. 在 `src/components/` 中创建 Vue 组件
4. 在 `src/App.vue` 中集成新组件

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 规范
- 使用 Tailwind CSS 进行样式设计
- 保持代码简洁和可维护性

### 代码质量工具

项目集成了多个代码质量工具，确保代码的规范性和可维护性：

#### ESLint
- 使用 Vue.js 官方推荐的 ESLint 配置
- 集成 TypeScript ESLint 规则
- 自动修复常见代码问题

#### Prettier
- 统一代码格式
- 与 ESLint 集成，避免规则冲突

#### TypeScript
- 严格的类型检查
- 提供更好的 IDE 支持

### 可用脚本

```bash
# 代码检查
pnpm lint:check        # 检查代码规范
pnpm lint:fix          # 自动修复代码问题

# 代码格式化
pnpm format:check      # 检查代码格式
pnpm format            # 格式化代码

# 类型检查
pnpm type-check        # TypeScript 类型检查

# 一键检查所有
pnpm quality           # 运行所有检查（格式、规范、类型）
pnpm quality:fix       # 自动修复所有可修复的问题

# 提交前检查
pnpm pre-commit        # 运行提交前的质量检查
```

### 最佳实践

1. **提交前检查**：在提交代码前运行 `pnpm quality` 确保代码质量
2. **自动修复**：使用 `pnpm quality:fix` 自动修复大部分问题
3. **类型安全**：避免使用 `any` 类型，确保类型安全
4. **组件规范**：遵循 Vue.js 组件命名和结构规范
5. **注释规范**：为复杂逻辑添加清晰的注释

## 部署

### 在线演示

项目已部署到 GitHub Pages，可以通过以下地址访问：
[在线演示](https://[你的用户名].github.io/installment-tracker/)

### 自动部署

本项目配置了 GitHub Actions 来自动部署到 GitHub Pages。详细设置说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 手动部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 许可证

本项目采用 Creative Commons Attribution-NonCommercial 4.0 International License (CC-BY-NC-4.0) 许可证。

### 您可以：

- ✅ **分享** — 在任何媒介以任何形式复制、发行本作品
- ✅ **演绎** — 修改、转换或以本作品为基础进行创作

### 惟须遵守下列条件：

- 📝 **署名** — 您必须给出适当的署名，提供指向本许可协议的链接，同时标明是否（对原始作品）作了修改
- 🚫 **非商业性使用** — 您不得将本作品用于商业目的

### 免责声明

⚠️ 本工具计算结果仅供参考，实际还款请以银行账单为准。用户需确保输入信息的准确性。

详细许可证内容请查看 [LICENSE](./LICENSE) 文件或访问：https://creativecommons.org/licenses/by-nc/4.0/
