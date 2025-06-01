<template>
  <a-card>
    <div class="wapper">
      <div>
        题目标题：
        <a-input
          v-model="formData.title"
          :style="{ width: '320px' }"
          placeholder="题目标题"
          allow-clear
        />
      </div>
      <div>
        题目标签：
        <a-input-tag
          v-model="formData.tagsArray"
          :style="{ width: '320px' }"
          placeholder="题目标签"
          allow-clear
        />
      </div>
      <div>
        <div style="margin-bottom: 10px">题目内容：</div>
        <v-md-editor 
          v-model="formData.content" 
          height="400px"
          left-toolbar="undo redo | h bold italic strikethrough quote | ul ol table hr | link image code | save"
          :disabled-menus="[]"
          @upload-image="handleUploadImage"
        ></v-md-editor>
      </div>
      <div style="display: flex; align-items: left; flex-direction: column">
        判题配置：
        <div>
          时间限制(ms)：
          <a-input-number
            style="margin-left: 3px; margin-bottom: 10px"
            v-model="formData.timeLimit"
            :style="{ width: '120px' }"
            placeholder="时间限制"
            :min="100"
            :max="5000"
            :step="100"
            mode="button"
            class="input-demo"
          />
        </div>
        <div>
          内存限制(MB)：
          <a-input-number
            v-model="formData.memoryLimit"
            :style="{ width: '120px' }"
            placeholder="内存限制"
            :min="10"
            :max="1024"
            :step="10"
            mode="button"
            class="input-demo"
          />
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
              <a-textarea
                v-model="testCase.input"
                placeholder="请输入测试用例输入"
                :auto-size="{ minRows: 2, maxRows: 5 }"
              />
            </div>
            <div class="test-case-output">
              <span>输出：</span>
              <a-textarea
                v-model="testCase.output"
                placeholder="请输入测试用例预期输出"
                :auto-size="{ minRows: 2, maxRows: 5 }"
              />
            </div>
            <a-button
              type="outline"
              status="danger"
              @click="removeTestCase(index)"
              class="remove-btn"
            >
              删除
            </a-button>
          </div>
        </div>
      </div>

      <div class="actions">
        <a-button type="primary" @click="handleSubmit" :loading="loading">保存题目</a-button>
        <a-button type="outline" @click="handleReset" style="margin-left: 12px">重置</a-button>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { QuestionControllerService, FilleControllerService } from '@/generated'
import { useRoute } from 'vue-router'

interface TestCase {
  input: string
  output: string
}

interface FormData {
  id: bigint
  title: string
  tagsArray: string[] // 用于前端展示和编辑
  content: string
  timeLimit: number
  memoryLimit: number
  testCases: TestCase[]
}

const route = useRoute()
const questionId = ref(route.params.id)
const formData = ref<FormData>({
  id: 0,
  title: '',
  tagsArray: [],
  content: '',
  timeLimit: 1000,
  memoryLimit: 256,
  testCases: [],
})

const loading = ref(false)

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

    // 创建表单数据
    const formData = new FormData()
    formData.append('file', file)

    // 调用上传接口
     FilleControllerService.uploadQuestionFile(undefined, { file }).then((res)=>{
    // 关闭上传提示
    loadingMsg.close()
      console.log(res.data)
    insertImage({
        url: "http://oj.kuikui.space/api/file/questionContent/"+res+".png",
        desc: file.name
      })
      Message.success('图片上传成功')
     })


  } catch (error: any) {
    Message.error(`图片上传失败: ${error.message || '未知错误'}`)
    console.error('图片上传失败:', error)
  }
}

// 处理获取到的题目数据
const processQuestionData = (data: any) => {
  try {
    const judgeConfig = JSON.parse(data.judgeConfig || '{}')
    const judgeCase = JSON.parse(data.judgeCase || '[]')

    formData.value = {
      id: data.id || 0,
      title: data.title || '',
      tagsArray: JSON.parse(data.tags || '[]'),
      content: data.content || '',
      timeLimit: judgeConfig.timeLimit || 1000,
      memoryLimit: judgeConfig.memoryLimit || 256,
      testCases: judgeCase.map((item: any) => ({
        input: item.input || '',
        output: item.output || '',
      })),
    }

    // 如果没有任何测试用例，添加一个空的
    if (formData.value.testCases.length === 0) {
      formData.value.testCases.push({
        input: '',
        output: '',
      })
    }
  } catch (error) {
    console.error('解析题目数据失败:', error)
    Message.error('解析题目数据失败')
  }
}

onMounted(() => {
  QuestionControllerService.questionInfoDetail(questionId.value)
    .then((res) => {
      if (res.code === 200) {
        processQuestionData(res.data)
      } else {
        Message.error('获取题目信息失败')
      }
    })
    .catch((error) => {
      console.error('获取题目信息失败:', error)
      Message.error('获取题目信息失败')
    })
})

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
      id: questionId.value,
      title: formData.value.title,
      tags: JSON.stringify(formData.value.tagsArray),
      content: formData.value.content,
      judgeCase: JSON.stringify(formData.value.testCases),
      judgeConfig: JSON.stringify({
        timeLimit: formData.value.timeLimit,
        memoryLimit: formData.value.memoryLimit,
      }),
    }

    // 调用API - 这里假设是更新题目
    const response = await QuestionControllerService.updateQuestion(requestData)

    Message.success('题目保存成功')
    console.log('保存成功，返回数据:', response)
  } catch (error: any) {
    Message.error(`保存失败: ${error.message || '未知错误'}`)
    console.error('保存题目失败:', error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  // 重置为从服务器获取的原始数据

  QuestionControllerService.questionInfoDetail(questionId.value).then((res) => {
    if (res.code === 200) {
      processQuestionData(res.data)
      Message.success('已重置表单')
    }
  })
}
</script>

<style scoped>
.wapper {
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
