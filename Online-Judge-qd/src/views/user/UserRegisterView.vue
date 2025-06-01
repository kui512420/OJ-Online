<template>
  <div class="login-container">
    <a-form
      ref="formRef"
      class="login-form"
      :rules="rules"
      :model="form"
      @submit="handleSubmit"
      label-align="left"
      auto-label-width
    >
      <h2 class="form-title">用户注册</h2>
      <a-form-item field="name" :hide-label="true">
        <a-input v-model="form.name" placeholder="请输入您的用户名" class="custom-input">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" :hide-label="true">
        <a-input-password v-model="form.password" placeholder="请输入您的密码" class="custom-input">
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item field="password2" label="确认密码" :hide-label="true" validate-trigger="blur">
        <a-input-password
          v-model="form.password2"
          placeholder="请输入您的确认密码"
          class="custom-input"
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item field="email" label="邮箱" :hide-label="true">
        <a-input v-model="form.email" placeholder="请输入您的邮箱" class="custom-input">
          <template #prefix>
            <icon-email />
          </template>
        </a-input>
        <SendButton :email="form.email"></SendButton>
      </a-form-item>
      <a-form-item field="code" label="验证码" :hide-label="true">
        <a-input v-model="form.code" placeholder="请输入您的邮箱验证码" class="custom-input">
          <template #prefix>
            <icon-safe />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button :loading="registerLoding" html-type="submit" class="login-btn" type="primary">
          注册
        </a-button>
        <div class="action-links">
          <a-link @click="router.push('/user/login')">去登录</a-link>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { reactive, ref } from 'vue'
import { UserControllerService } from '@/generated'
import { Notification } from '@arco-design/web-vue'
import SendButton from '@/components/email/SendButton.vue'
import { IconUser, IconLock, IconEmail, IconSafe } from '@arco-design/web-vue/es/icon'
const registerLoding = ref(false)

const form = reactive({
  name: '',
  password: '',
  password2: '',
  email: '',
  code: '',
})
const handleSubmit = () => {
  registerLoding.value = true
  UserControllerService.register({
    userAccount: form.name,
    userPassword: form.password,
    userCheakPassword: form.password2,
    email: form.email,
    emailCode: form.code,
  }).then((res) => {
    if (res.code === 200) {
      Notification.success(res.message)
      // 本地存储双token
      localStorage.setItem('AccessToken', res.data.AccessToken)
      //返回首页
      router.push('/')
    } else {
      Notification.error(res.message)
    }
    registerLoding.value = false
  })
}

const rules = {
  name: [
    {
      required: true,
      message: '用户名 是必填项',
    },
  ],
  password: [
    {
      required: true,
      message: '密码 是必填项',
    },
  ],
  password2: [
    {
      required: true,
      message: '确认密码 是必填项',
    },
    {
      validator: (value: string, cb: (arg0: string | undefined) => void) => {
        if (value !== form.password) {
          cb('两次密码输出不一致！')
        } else {
          cb('')
        }
      },
    },
  ],
  email: [
    {
      type: 'email',
      required: true,
      message: '请输入正确的邮箱',
    },
  ],
  code: [
    {
      required: true,
      message: '邮箱验证码 是必填项',
    },
  ],
}
</script>
<style scoped>
.login-container {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 245, 255, 0.1);
}
.action-links {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}

.action-links a {
  color: #00f5ff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-links a:hover {
  color: #ffffff;
  text-shadow: 0 0 8px #00f5ff;
}

.form-title {
  text-align: center;
  margin-bottom: 32px;
  color: #00f5ff;
  font-size: 24px;
  text-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
  font-weight: 600;
}

.custom-input {
  height: 48px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(0, 245, 255, 0.3);
  color: #ffffff !important;
}

.custom-input:hover,
.custom-input:focus {
  border-color: #00f5ff;
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.3);
  background: rgba(255, 255, 255, 0.1) !important;
}

.custom-input :deep(.arco-input) {
  background: transparent !important;
  color: #ffffff !important;
}

.custom-input :deep(.arco-input:focus) {
  background: transparent !important;
  color: #ffffff !important;
}

.custom-input :deep(.arco-input::placeholder) {
  color: rgba(255, 255, 255, 0.6) !important;
}

.custom-input ::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.login-btn {
  width: 80%;
  height: 48px;
  font-size: 16px;
  background: linear-gradient(90deg, #646cff 0%, #747bff 100%);
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
}
</style>
