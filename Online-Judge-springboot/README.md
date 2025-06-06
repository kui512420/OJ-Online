# Online-Judge-hd
OJ 判题系统 后端仓库

# Online Judge 系统

一个在线判题系统，支持多种编程语言的代码评测。

## 代码安全性保障

本系统实现了多层次的代码安全保障机制，防止用户提交恶意代码：

### 1. 代码静态检查

- 使用正则表达式匹配模式检测潜在的危险代码
- 禁止使用系统命令执行（如Runtime.exec()）
- 禁止反射操作
- 禁止文件系统访问
- 禁止网络操作
- 禁止线程操作等

### 2. Java安全管理器

- 使用Java内置的SecurityManager限制代码执行权限
- 通过security.policy文件配置精细的权限控制
- 只允许基本的标准输入输出和必要的系统操作

### 3. Docker容器隔离

- 使用Docker容器完全隔离用户代码的执行环境
- 限制容器的内存、CPU使用
- 禁用容器网络访问
- 设置根文件系统为只读，防止文件系统修改
- 设置超时机制，防止无限循环等恶意代码

### 4. 资源限制

- 限制程序执行时间
- 限制内存使用
- 限制线程创建
- 自动清理临时文件和容器

这些机制一起工作，确保用户提交的代码在安全的环境中执行，防止对系统造成危害。
