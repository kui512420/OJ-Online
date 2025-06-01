# 🏆 OJ Online Judge 在线判题系统

一个功能完整的在线判题系统，支持多种编程语言的代码评测，提供安全、高效、用户友好的编程练习平台。

## 📋 项目介绍

OJ Online Judge 是一个现代化的在线编程判题平台，旨在为编程学习者和竞赛参与者提供专业的代码评测服务。系统采用前后端分离架构，支持多种技术栈实现，具有高度的可扩展性和安全性。

## ✨ 主要特性

- 🔒 **多层安全保障** - 代码静态检查、Java安全管理器、Docker容器隔离
- 💻 **多语言支持** - 支持 Java、C++、Python 等主流编程语言
- 🏃‍♂️ **实时判题** - 快速的代码编译和执行反馈
- 🏆 **竞赛系统** - 完整的编程竞赛管理功能
- 📊 **数据统计** - 详细的用户提交统计和排行榜
- 🤖 **AI 助手** - 集成 AI 功能，提供代码建议和错误分析
- 📝 **丰富编辑器** - 基于 Monaco Editor 的专业代码编辑体验
- 📱 **响应式设计** - 支持多设备访问

## 🏗️ 项目架构

```
OJ-Online/
├── Online-Judge-springboot/     # Spring Boot 单体版本
├── Online-Judge-springcloud/    # Spring Cloud 微服务版本
├── Online-Judge-qd/             # Vue3 + TypeScript 前端
└── sql/                         # 数据库初始化脚本
```

### 🖥️ 后端技术栈

#### Spring Boot 版本
- **框架**: Spring Boot 3.4.5
- **数据库**: MySQL 8.0+ 
- **缓存**: Redis
- **消息队列**: RabbitMQ
- **容器化**: Docker
- **AI**: Spring AI + OpenAI
- **安全**: JWT + Spring Security
- **文档**: SpringDoc OpenAPI

#### Spring Cloud 微服务版本
- **服务网关**: Spring Cloud Gateway
- **服务发现**: Nacos
- **微服务模块**:
  - 用户服务 (kuikuioj-bankend-user)
  - 题目服务 (kuikuioj-bankend-question)
  - 判题服务 (kuikuioj-bankend-questionsubmit)
  - 竞赛服务 (kuikuioj-bankend-competition)
  - AI 服务 (kuikuioj-bankend-ai)
  - 代码沙箱 (kuikuioj-bankend-codesandbox)

### 🎨 前端技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Arco Design Vue
- **状态管理**: Pinia
- **路由**: Vue Router
- **编辑器**: Monaco Editor
- **图表**: ECharts
- **Markdown**: V-MD-Editor

## 🔐 安全特性

系统实现了多层次的代码安全保障机制：

### 1. 代码静态检查
- 正则表达式检测恶意代码模式
- 禁止系统命令执行、反射操作、文件系统访问
- 禁止网络操作和线程操作

### 2. Java 安全管理器
- SecurityManager 限制代码执行权限
- 精细的权限控制配置
- 只允许基本的输入输出操作

### 3. Docker 容器隔离
- 完全隔离的代码执行环境
- 限制内存、CPU 使用
- 禁用网络访问，只读文件系统
- 自动超时和资源清理

## 🚀 快速开始

### 环境要求

- **Java**: JDK 17+
- **Node.js**: 16+
- **数据库**: MySQL 8.0+
- **缓存**: Redis 6.0+
- **容器**: Docker (可选)

### 后端部署 (Spring Boot 版本)

1. **克隆项目**
```bash
git clone https://github.com/your-username/OJ-Online.git
cd OJ-Online/Online-Judge-springboot
```

2. **配置数据库**
```bash
# 导入数据库
mysql -u root -p < ../sql/kuikuioj.sql
```

3. **修改配置**
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/kuikuioj
    username: your_username
    password: your_password
  redis:
    host: localhost
    port: 6379
```

4. **启动应用**
```bash
mvn clean package -DskipTests
java -jar target/oj-0.0.1-SNAPSHOT.jar
```

### 前端部署

1. **安装依赖**
```bash
cd Online-Judge-qd
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **生成 API 客户端**
```bash
npm install -g openapi-typescript-codegen
openapi --input http://127.0.0.1:8080/v3/api-docs --output ./generated --client axios
```

### 微服务版本部署

详细的微服务部署说明请参考 [README-LINUX.md](Online-Judge-springcloud/README-LINUX.md)

## 📚 功能模块

### 用户系统
- 用户注册/登录
- 个人中心管理
- 权限控制

### 题库系统
- 题目浏览与搜索
- 题目详情展示
- 题目分类管理

### 判题系统
- 在线代码编辑
- 多语言代码执行
- 实时判题反馈
- 提交历史查看

### 竞赛系统
- 竞赛创建与管理
- 实时排行榜
- 竞赛统计分析

### 数据分析
- 提交统计图表
- 用户能力分析
- 题目难度统计

## 🛠️ 开发指南

### 代码规范
- 后端遵循阿里巴巴 Java 开发手册
- 前端使用 ESLint + Prettier
- 提交信息遵循 Conventional Commits

### API 文档
- 后端 API 文档: http://localhost:8080/swagger-ui.html
- 使用 OpenAPI 3.0 规范

### 测试
```bash
# 后端测试
mvn test

# 前端测试
npm run test
```

## 📈 性能优化

- Redis 缓存热点数据
- 数据库索引优化
- Docker 容器资源限制
- 前端路由懒加载
- 组件按需导入

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Vue.js](https://vuejs.org/)
- [Arco Design](https://arco.design/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)


## 📞 联系方式

- 项目维护者: [kuikui](mailto:kui512420@163.com)


## 🔗 相关链接

- [在线演示](http://oj.kuikui.space)


---

⭐ 如果这个项目对你有帮助，请给它一个星标！ 
