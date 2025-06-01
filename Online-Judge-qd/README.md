# Online-Judge-qd

## 项目介绍

Online-Judge-qd 是一个在线判题系统的前端仓库，提供编程题目的在线评判功能。该系统支持代码在线编辑、提交和自动评判，帮助用户提升编程能力。

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - JavaScript 的超集，提供类型系统
- Vite - 下一代前端构建工具
- Pinia - Vue 的状态管理库
- Vue Router - Vue.js 的官方路由
- Arco Design Vue - 字节跳动出品的企业级设计系统
- Monaco Editor - 强大的代码编辑器（VS Code 的核心编辑器）
- ECharts - 数据可视化图表库
- V-MD-Editor - Markdown 编辑器组件

## 主要功能

- 题库浏览与搜索
- 在线代码编辑
- 代码提交与评判
- 竞赛系统
- 排行榜
- 个人中心
- 用户管理

## 项目结构

```
src/
├── access/         # 权限控制
├── assets/         # 静态资源
├── components/     # 公共组件
├── generated/      # 生成的代码
├── layouts/        # 布局组件
├── router/         # 路由配置
├── stores/         # 状态管理
└── views/          # 页面视图
```

## 开发环境设置

1. 安装依赖

```bash
npm install
npm install -g openapi-typescript-codegen --save-dev

```

2. 启动开发服务器

```bash
npm run dev
```

3. 构建生产版本

```bash
npm run build
```

4. 生成openapi

```bash
openapi --input http://127.0.0.1:8080/v3/api-docs --output ./generated --client axios
```

## 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 类型规范

## 浏览器支持

- 推荐使用最新版本的 Chrome、Firefox、Safari 或 Edge 浏览器

## 贡献指南

欢迎提交 Issue 或 Pull Request 来帮助改进项目。

## 许可证

MIT License
