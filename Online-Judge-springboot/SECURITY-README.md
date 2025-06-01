# 敏感信息配置说明

## ⚠️ 重要提醒
此项目的配置文件中包含敏感信息，请务必遵循以下安全实践：

## 🔒 敏感信息管理

### 1. 使用本地配置文件
- 复制 `application-example.yml` 为 `application-local.yml`
- 在 `application-local.yml` 中填入真实的配置信息
- `application-local.yml` 已被加入 `.gitignore`，不会被提交到git

### 2. 生产环境配置
- 在生产环境创建 `application-prod.yml`
- 包含生产环境的真实配置信息
- 此文件也已被加入 `.gitignore`

### 3. 配置文件优先级
Spring Boot 配置文件优先级（高到低）：
1. `application-local.yml` （本地开发）
2. `application-prod.yml` （生产环境）
3. `application.yml` （默认配置，可提交到git）

## 🚫 需要保护的敏感信息

### 数据库相关
- 数据库用户名和密码
- 数据库连接URL中的敏感信息

### API密钥
- 第三方服务的API Key
- Secret Key

### 邮箱配置
- 邮箱用户名和密码
- SMTP配置信息

### 其他敏感信息
- Redis密码
- RabbitMQ用户名密码
- JWT密钥
- 加密密钥

## 📝 最佳实践

1. **环境变量**: 生产环境优先使用环境变量配置敏感信息
2. **配置中心**: 考虑使用 Nacos、Apollo 等配置中心管理配置
3. **加密配置**: 对敏感配置进行加密存储
4. **定期轮换**: 定期更换密码和密钥
5. **权限控制**: 限制配置文件的访问权限

## 🔧 开发流程

1. 从模板文件复制配置
```bash
cp application-example.yml application-local.yml
```

2. 编辑本地配置文件，填入真实信息
3. 启动应用时指定环境
```bash
java -jar app.jar --spring.profiles.active=local
```

## ❌ 禁止操作

- ❌ 直接在 `application.yml` 中写入真实的敏感信息
- ❌ 将包含敏感信息的配置文件提交到git
- ❌ 在代码注释或日志中暴露敏感信息
- ❌ 将敏感信息硬编码在代码中 