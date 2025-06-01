<template>
  <div>
    <div>
      <a-select v-model="selectedLanguage" placeholder="请选择编程语言">
        <a-option value="java">java</a-option>
        <a-option value="python">python</a-option>
        <a-option value="javascript">javascript</a-option>
      </a-select>
    </div>
    <div style="position: relative">
      <div id="container" style="width: auto; height: 90vh"></div>
      <a-collapse
        v-if="!hideDebug"
        style="background-color: black; width: 100%; z-index: 999; position: absolute; bottom: 0"
      >
        <div style="width: 30%; margin: 0 auto">
          <a-button type="primary" status="warning">调试</a-button>
          <a-button type="primary" style="margin-left: 20px" @click="submit">提交检测</a-button>
        </div>
        <a-collapse-item header="打开调试器" key="1">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" title="测试用例">
              <a-textarea placeholder="请输入测试用例" allow-clear />
            </a-tab-pane>
            <a-tab-pane key="2" title="代码执行结果">
              <div>暂无执行结果</div>
            </a-tab-pane>
          </a-tabs>
        </a-collapse-item>
      </a-collapse>
      <div v-else-if="!hideSubmitButton" style="position: absolute; bottom: 20px; right: 20px; z-index: 999">
        <a-button type="primary" @click="submit">提交代码</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as monaco from 'monaco-editor'
import { Message } from '@arco-design/web-vue'
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
// 导入编辑器格式化支持
import 'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions'

const props = defineProps({
  questionId: {
    type: [String, Number],
    required: true,
  },
  competitionMode: {
    type: Boolean,
    default: false,
  },
  competitionId: {
    type: [String, Number],
    default: null,
  },
  hideDebug: {
    type: Boolean,
    default: false,
  },
  hideSubmitButton: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submission-created'])

const selectedLanguage = ref('java')
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// 格式化Java代码的函数
const formatJavaCode = (code: string): string => {
  // 简单的Java代码格式化逻辑
  try {
    // 处理缩进
    let formattedCode = ''
    let indentLevel = 0
    const lines = code.split('\n')

    for (const line of lines) {
      const trimmedLine = line.trim()

      // 减少缩进的情况（右花括号）
      if (trimmedLine.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1)
      }

      // 添加适当的缩进
      if (trimmedLine.length > 0) {
        formattedCode += '  '.repeat(indentLevel) + trimmedLine + '\n'
      } else {
        formattedCode += '\n'
      }

      // 增加缩进的情况（左花括号）
      if (trimmedLine.endsWith('{')) {
        indentLevel++
      }
    }

    return formattedCode.trim()
  } catch (error) {
    console.error('Java代码格式化失败:', error)
    return code // 如果格式化失败，返回原始代码
  }
}

// 格式化Python代码的函数
const formatPythonCode = (code: string): string => {
  // 简单的Python代码格式化逻辑
  try {
    // 处理缩进和空行
    let formattedCode = ''
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()

      // 跳过多余的空行
      if (trimmedLine.length === 0 && i > 0 && lines[i - 1].trim().length === 0) {
        continue
      }

      // 保持原有的缩进
      const indentMatch = line.match(/^\s*/)
      const indent = indentMatch ? indentMatch[0] : ''

      if (trimmedLine.length > 0) {
        formattedCode += indent + trimmedLine + '\n'
      } else {
        formattedCode += '\n'
      }
    }

    return formattedCode.trim()
  } catch (error) {
    console.error('Python代码格式化失败:', error)
    return code // 如果格式化失败，返回原始代码
  }
}

// 格式化JavaScript代码的函数
const formatJavaScriptCode = (code: string): string => {
  // 简单的JavaScript代码格式化逻辑
  try {
    // 处理缩进
    let formattedCode = ''
    let indentLevel = 0
    const lines = code.split('\n')

    for (const line of lines) {
      const trimmedLine = line.trim()

      // 减少缩进的情况（右花括号）
      if (trimmedLine.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1)
      }

      // 添加适当的缩进
      if (trimmedLine.length > 0) {
        formattedCode += '  '.repeat(indentLevel) + trimmedLine + '\n'
      } else {
        formattedCode += '\n'
      }

      // 增加缩进的情况（左花括号）
      if (trimmedLine.endsWith('{')) {
        indentLevel++
      }
    }

    return formattedCode.trim()
  } catch (error) {
    console.error('JavaScript代码格式化失败:', error)
    return code // 如果格式化失败，返回原始代码
  }
}

// 代码模板
const codeTemplates = {
  java: `
import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    scanner.close();
  }
}`,
  python: `print("Hello, Python!")`,
  javascript: `console.log("Hello, JavaScript!");`,
}

// 初始化编辑器
const initEditor = () => {
  const container = document.getElementById('container')
  if (!container) return

  editor = monaco.editor.create(container, {
    value: codeTemplates[selectedLanguage.value as keyof typeof codeTemplates],
    language: selectedLanguage.value,
    theme: 'vs-dark',
    automaticLayout: true,
    lineNumbers: 'on',
    wordWrap: 'on',
    fontSize: 14,
    scrollBeyondLastLine: false,
    contextmenu: true, // 启用右键菜单
    formatOnPaste: true, // 粘贴时自动格式化
    formatOnType: true, // 输入时自动格式化
  })

  // 添加右键菜单项和快捷键支持
  const shouldShowFormatAction = editor.createContextKey('shouldShowFormatAction', true)

  // 添加格式化代码操作
  editor.addAction({
    id: 'format-code',
    label: '格式化代码',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1.5,
    precondition: 'shouldShowFormatAction',
    run: function (ed) {
      // 执行格式化代码操作
      formatCode()
    },
  })

  // 添加Ctrl+S保存并格式化的快捷键
  editor.addAction({
    id: 'save-and-format',
    label: '保存并格式化',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run: function (ed) {
      formatCode()
      // 这里可以添加保存代码的逻辑
      Message.success('代码已保存并格式化')
    },
  })

  // 设置上下文键为true，确保菜单项显示
  shouldShowFormatAction.set(true)

  // 配置编辑器的格式化选项 - 为每种语言注册格式化提供程序
  // Java格式化配置
  monaco.languages.registerDocumentFormattingEditProvider('java', {
    provideDocumentFormattingEdits: function (model) {
      // Java特定的格式化规则
      return [
        {
          range: model.getFullModelRange(),
          text: formatJavaCode(model.getValue()),
        },
      ]
    },
  })

  // Python格式化配置
  monaco.languages.registerDocumentFormattingEditProvider('python', {
    provideDocumentFormattingEdits: function (model) {
      // Python特定的格式化规则
      return [
        {
          range: model.getFullModelRange(),
          text: formatPythonCode(model.getValue()),
        },
      ]
    },
  })

  // JavaScript格式化配置
  monaco.languages.registerDocumentFormattingEditProvider('javascript', {
    provideDocumentFormattingEdits: function (model) {
      // JavaScript特定的格式化规则
      return [
        {
          range: model.getFullModelRange(),
          text: formatJavaScriptCode(model.getValue()),
        },
      ]
    },
  })
}

// 切换语言
const changeLanguage = () => {
  if (!editor) return
  editor.setValue(codeTemplates[selectedLanguage.value as keyof typeof codeTemplates])
  editor.getModel()?.updateOptions({ language: selectedLanguage.value })

  // 切换语言时重新注册当前语言的格式化提供程序
  const currentLanguage = selectedLanguage.value
  Message.info(`已切换到${currentLanguage}编程语言`)

  // 更新编辑器的右键菜单和格式化选项
  const shouldShowFormatAction = editor.createContextKey('shouldShowFormatAction', true)
  shouldShowFormatAction.set(true)
}

// 生命周期钩子
onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  // 清理编辑器实例
  if (editor) {
    editor.dispose()
  }
})

// 提交代码
const submit = () => {
  if (!editor) return

  const requestBody = {
    language: selectedLanguage.value,
    code: editor.getValue(),
    questionId: props.questionId,
  }

  // 触发提交事件，将数据传递给父组件
  emit('submission-created', requestBody)
}

// 监听语言变化
watch(selectedLanguage, changeLanguage)

// 获取编辑器的值
const getEditorValue = () => {
  return editor?.getValue() || ''
}

// 格式化代码函数
const formatCode = () => {
  if (!editor) return

  try {
    // 获取当前编辑器的语言
    const currentLanguage = selectedLanguage.value

    // 获取当前编辑器的内容
    const currentValue = editor.getValue()

    // 使用Monaco编辑器内置的格式化功能
    editor
      .getAction('editor.action.formatDocument')
      .run()
      .then(() => {
        // 检查格式化是否成功（比较格式化前后的内容是否有变化）
        const formattedValue = editor.getValue()
        if (formattedValue !== currentValue) {
          Message.success(`${currentLanguage}代码格式化成功`)
        } else {
          // 如果内容没有变化，可能是当前语言的格式化器不可用
          // 尝试使用编辑器的其他格式化方法
          const model = editor.getModel()
          if (model) {
            monaco.editor.getModelMarkers({ resource: model.uri }).length > 0
              ? Message.warning('代码存在语法错误，格式化可能不完整')
              : Message.success('代码已格式化')
          }
        }
      })
      .catch((error) => {
        console.error('格式化代码失败:', error)
        Message.error(`${currentLanguage}代码格式化失败: ${error.message || '未知错误'}`)
      })
  } catch (error) {
    console.error('格式化过程中发生错误:', error)
    Message.error('格式化过程中发生错误，请稍后重试')
  }
}

// 暴露给父组件的方法和属性
defineExpose({
  getEditorValue,
  formatCode,
  selectedLanguage,
})
</script>

<style scoped>
/* 解决容器高度塌陷问题 */
#container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
</style>
