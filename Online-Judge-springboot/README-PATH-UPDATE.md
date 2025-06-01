# Online Judge SpringBoot 文件路径修改说明

本文档说明了对项目文件存储路径的修改，使其与 Online-Judge-SpringCloud 项目保持一致。

## 修改内容

### 文件存储路径变更

**修改前（硬编码Windows路径）：**
- 用户头像存储路径：`C:\\Users\\30767\\Desktop\\git\\userHeader\\`
- 题目内容图片存储路径：`C:\\Users\\30767\\Desktop\\git\\questionContent\\`

**修改后（平台无关的相对路径）：**
- 用户头像存储路径：`System.getProperty("user.dir") + File.separator + "data" + File.separator + "userHeader" + File.separator`
- 题目内容图片存储路径：`System.getProperty("user.dir") + File.separator + "data" + File.separator + "questionContent" + File.separator`
- 代码沙箱临时目录：`System.getProperty("user.dir") + File.separator + "temp"`

### 新增文件

1. **PathInitializer.java** - 路径初始化器
   - 在应用启动时自动创建必要的目录
   - 检查安全策略文件是否存在
   - 位置：`src/main/java/space/kuikui/oj/config/PathInitializer.java`

### 修改的文件

1. **UserController.java**
   - 修改了 `USER_HEADER_PATH` 和 `QUESTION_CONTENT_PATH` 常量定义
   - 添加了必要的 `File` 类导入

2. **JavaDockerCodeSandBox.java**
   - 将 `TEMP_PATH` 从 "docker_temp" 修改为 "temp" 以保持一致性

3. **.gitignore**
   - 添加了 `data/` 目录的忽略规则

## 目录结构

修改后的系统会自动创建以下目录结构：

```
[项目根目录]
├── data/
│   ├── userHeader/      # 用户头像存储目录
│   └── questionContent/ # 题目内容图片存储目录
├── temp/                # 代码执行临时目录
└── security.policy      # Java安全策略文件（需要手动放置）
```

## 兼容性说明

- 修改后的路径配置支持 Windows、Linux 和 macOS 系统
- 使用 `File.separator` 确保路径分隔符的跨平台兼容性
- 使用相对路径，便于项目部署到不同环境

## 注意事项

1. 首次启动应用时，系统会自动创建必要的目录
2. 确保应用有权限在项目根目录下创建文件夹
3. 如需迁移现有文件，请手动将文件从旧路径移动到新路径
4. 建议在部署前备份重要的用户数据

## 与 SpringCloud 项目的一致性

此修改使 SpringBoot 项目的文件存储路径与 SpringCloud 项目完全一致，便于：
- 代码维护和管理
- 项目间的迁移
- 统一的部署配置 