#!/bin/bash
echo "=== Java 环境检测 ==="
echo "1. 检查当前 Java 版本："
java -version

echo ""
echo "2. 检查 javac 命令："
javac -version

echo ""
echo "3. 检查 Java 系统属性："
echo "java.home = $(java -Djava.awt.headless=true -jar -cp $(echo $CLASSPATH) - <<< 'System.out.println(System.getProperty("java.home"));' 2>/dev/null || echo $JAVA_HOME)"

echo ""
echo "4. 检查环境变量："
echo "JAVA_HOME = $JAVA_HOME"
echo "PATH = $PATH"

echo ""
echo "5. 查找 javac 位置："
which javac
whereis javac

echo ""
echo "=== 路径构建测试 ==="
# 模拟Java代码中的路径构建逻辑
JAVA_HOME_PROP=$(java -XshowSettings:properties -version 2>&1 | grep "java.home" | cut -d'=' -f2 | xargs)
echo "Java 属性 java.home: $JAVA_HOME_PROP"

# 构建 javac 路径
if [[ "$JAVA_HOME_PROP" == *jre ]]; then
    JAVAC_PATH="${JAVA_HOME_PROP%jre}bin/javac"
else
    JAVAC_PATH="$JAVA_HOME_PROP/bin/javac"
fi

echo "构建的 javac 路径: $JAVAC_PATH"
echo "javac 文件是否存在: $(test -f "$JAVAC_PATH" && echo "是" || echo "否")"

# 构建 java 路径
JAVA_PATH="$JAVA_HOME_PROP/bin/java"
echo "构建的 java 路径: $JAVA_PATH"
echo "java 文件是否存在: $(test -f "$JAVA_PATH" && echo "是" || echo "否")" 