<template>
  <a-card>
    <div class="wapper">
      <a-spin :loading="aiLoading" tip="生成中...">
        <a-button type="dashed" status="success" @click="AIvisible = !AIvisible">
          AI一键生成
        </a-button>
        <div>
          题目标题：
          <a-input v-model="formData.title" :style="{ width: '320px' }" placeholder="题目标题" allow-clear />
        </div>
        <div>
          题目标签：
          <a-input-tag v-model="formData.tagsArray" :style="{ width: '320px' }" placeholder="题目标签" allow-clear />
        </div>
        <div>
          <div style="margin-bottom: 10px">题目内容：</div>
          <v-md-editor v-model="formData.content" height="400px"
            left-toolbar="undo redo | h bold italic strikethrough quote | ul ol table hr | link image code | save"
            :disabled-menus="[]" @upload-image="handleUploadImage"></v-md-editor>
        </div>
        <div style="display: flex; align-items: left; flex-direction: column">
          判题配置：
          <div>
            时间限制(ms)：
            <a-input-number style="margin-left: 3px; margin-bottom: 10px" v-model="formData.timeLimit"
              :style="{ width: '120px' }" placeholder="时间限制" :min="100" :max="5000" :step="100" mode="button"
              class="input-demo" />
          </div>
          <div>
            内存限制(MB)：
            <a-input-number v-model="formData.memoryLimit" :style="{ width: '120px' }" placeholder="内存限制" :min="10"
              :max="1024" :step="10" mode="button" class="input-demo" />
          </div>
        </div>

        <div class="test-cases">
          <div class="test-cases-header">
            测试用例配置：
            <a-button type="outline" status="warning" @click="addTestCase">新增用例</a-button>
          </div>
          <div class="test-case-list">
            <div v-for="(testCase, index) in formData.testCases" :key="index" class="test-case-item">
              <div class="test-case-title">用例 {{ index + 1 }}</div>
              <div class="test-case-input">
                <span>输入：</span>
                <a-textarea v-model="testCase.input" placeholder="请输入测试用例输入" :auto-size="{ minRows: 2, maxRows: 5 }" />
              </div>
              <div class="test-case-output">
                <span>输出：</span>
                <a-textarea v-model="testCase.output" placeholder="请输入测试用例预期输出"
                  :auto-size="{ minRows: 2, maxRows: 5 }" />
              </div>
              <a-button type="outline" status="danger" @click="removeTestCase(index)" class="remove-btn">
                删除
              </a-button>
            </div>
          </div>
        </div>

        <div class="actions">
          <a-button type="primary" @click="handleSubmit" :loading="loading">保存题目</a-button>
          <a-button type="outline" @click="handleReset" style="margin-left: 12px">重置</a-button>
        </div>
        <a-modal v-model:visible="AIvisible" @ok="handleOk" @cancel="handleCancel">
          <template #title> AI赋能OJ </template>
          <div>
            用例数量：
            <a-input-number v-model="questionCount" :style="{ width: '320px' }" class="input-demo" :min="1"
              :max="100" />
          </div>
          <div style="margin: 20px 0">
            出题难度：
            <a-select v-model="questionDaf" :style="{ width: '320px' }" placeholder="请选择题目难度">
              <a-option>高</a-option>
              <a-option>中</a-option>
              <a-option>低</a-option>
            </a-select>
          </div>
          <div style="align-items: center">
            出题描述：
            <a-textarea v-model="questionType" :style="{ width: '320px' }" placeholder="请输入题目生成描述"
              :auto-size="{ minRows: 2, maxRows: 5 }" />
          </div>
        </a-modal>
      </a-spin>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { AiControllerService, QuestionControllerService, FilleControllerService } from '@/generated'
const AIvisible = ref(false)
const aiLoading = ref(false)
const questionCount = ref(10)
const questionType = ref<string | undefined>()
const questionDaf = ref<string | undefined>()

const loading = ref(false)

const formData = ref<FormData>({
  title: '',
  tagsArray: [],
  content: '',
  timeLimit: 500,
  memoryLimit: 256,
  testCases: [],
})

// 处理图片上传
const handleUploadImage = async (event: Event, insertImage: Function, files: FileList) => {
  try {
    // 检查是否有文件
    if (!files || files.length === 0) {
      Message.error('请选择要上传的图片')
      return
    }

    // 检查文件类型
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      Message.error('请上传图片文件')
      return
    }

    // 显示上传中提示
    const loadingMsg = Message.loading({
      content: '图片上传中...',
      duration: 0
    })

    // 创建表单数据，避免与顶层 ref 重名
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    // 调用上传接口
    // 注意：FilleControllerService.uploadQuestionFile 的第二个参数是 options，其中包含 file
    // 如果您的 generated service 期望直接传递 FormData 对象，请相应调整
    FilleControllerService.uploadQuestionFile(undefined, { file: uploadFormData.get('file') as File }).then((res) => {
      // 关闭上传提示
      loadingMsg.close()
      console.log(res.data)
      insertImage({
        url: "http://oj.kuikui.space/api/file/questionContent/" + res + ".png",
        desc: file.name
      })
      Message.success('图片上传成功')
    })
  } catch (error: any) {
    Message.error(`图片上传失败: ${error.message || '未知错误'}`)
    console.error('图片上传失败:', error)
  }
}

const addTestCase = () => {
  formData.value.testCases.push({
    input: '',
    output: '',
  })
}

const removeTestCase = (index: number) => {
  formData.value.testCases.splice(index, 1)
}

const handleSubmit = async () => {
  console.log(formData.value.tagsArray)
  // 简单验证
  if (!formData.value.title) {
    Message.error('请输入题目标题')
    return
  }

  if (!formData.value.content) {
    Message.error('请输入题目内容')
    return
  }

  if (formData.value.testCases.length === 0) {
    Message.error('请至少添加一个测试用例')
    return
  }

  // 检查所有测试用例是否填写完整
  for (const [index, testCase] of formData.value.testCases.entries()) {
    if (!testCase.input || !testCase.output) {
      Message.error(`请完善测试用例 ${index + 1} 的输入和输出`)
      return
    }
  }

  loading.value = true

  try {
    // 构造请求参数
    const requestData = {
      title: formData.value.title,
      tags: JSON.stringify(formData.value.tagsArray),
      content: formData.value.content,
      judgeCase: JSON.stringify(formData.value.testCases),
      judgeConfig: JSON.stringify({
        timeLimit: formData.value.timeLimit,
        memoryLimit: formData.value.memoryLimit,
      }),
      // userId 可以从用户信息中获取或留空让后端处理
    }

    // 调用API

    const response = await QuestionControllerService.question(requestData)

    Message.success('题目保存成功')
    console.log('保存成功，返回数据:', response)

    // 可以在这里跳转到题目列表或其他页面
    // router.push('/question/list');
  } catch (error: any) {
    Message.error(`保存失败: ${error.message || '未知错误'}`)
    console.error('保存题目失败:', error)
  } finally {
    loading.value = false
  }
}
const handleOk = () => {
  aiLoading.value = true
  AiControllerService.ai({
    questionCount: questionCount.value + '',
    questionType: questionType.value,
    questionDifficulty: questionDaf.value
  })
    .then((res) => {
      aiLoading.value = false
      if (res && typeof res.data === 'string') {
        const jsonStr = res.data.replace('```json', '').replace('```', '').trim()
        try {
          const aiData = JSON.parse(jsonStr)
          formData.value = {
            title: aiData.title || '未命名题目',
            tagsArray: aiData.tags || [],
            content: aiData.content || '暂无题目描述',
            timeLimit: aiData.judgeConfig?.timeLimit || 1000,
            memoryLimit: aiData.judgeConfig?.memoryLimit || 256,
            testCases: aiData.judgeCase || []
          }
          Message.success('AI 生成题目成功')
          AIvisible.value = false
          questionCount.value = 10
          questionDaf.value = undefined
          questionType.value = ''
          console.log('AI生成数据已填充:', {
            title: formData.value.title,
            tags: formData.value.tagsArray,
            contentLength: formData.value.content.length,
            timeLimit: formData.value.timeLimit,
            memoryLimit: formData.value.memoryLimit,
            testCasesCount: formData.value.testCases.length
          })
        } catch (error) {
          Message.error('AI数据解析失败: ' + (error instanceof Error ? error.message : '未知解析错误'))
          console.error('解析AI返回的JSON字符串失败:', error, '原始字符串:', jsonStr)
          formData.value.content = jsonStr
          formData.value.title = 'AI内容 (待解析)'
          Message.info('AI返回内容已部分加载，请检查并手动整理题目信息。')
          AIvisible.value = false
        }
      } else {
        Message.error('AI 服务返回数据为空或格式不正确')
        console.error('AI 服务返回数据问题:', res)
      }
    })
    .catch((error) => {
      aiLoading.value = false
      Message.error(`AI 生成失败: ${error.message || '未知错误'}`)
      console.error('AI 生成失败:', error)
    })
}
const handleReset = () => {
  formData.value = {
    title: '',
    tagsArray: ['test'],
    content: '',
    timeLimit: 500,
    memoryLimit: 256,
    testCases: [],
  }
  Message.success('已重置表单')
}

const handleCancel = () => {
  AIvisible.value = false
}
</script>

<style scoped>
.wapper {
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  padding-bottom: 40px;
}

.test-cases {
  margin-top: 10px;
}

.test-cases-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.test-case-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.test-case-item {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 4px;
  position: relative;
}

.test-case-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.test-case-input,
.test-case-output {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}

.test-case-input span,
.test-case-output span {
  font-size: 14px;
}

.remove-btn {
  position: absolute;
  top: 15px;
  right: 15px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
