

<template>
<div>
  <a-button @click="sendEmail" :loading="sendLoding">{{ sendTitle }}</a-button>
</div>
</template>

<script setup lang='ts'>
import { ref, watch } from "vue"
import { UserControllerService } from '@/generated';
import { Notification } from '@arco-design/web-vue';
import { defineProps } from 'vue';
const sendLoding = ref(false)
const sendTitle = ref("发送验证码")
const props = defineProps<{
  email: string; // 确保类型定义正确
}>();


//发送邮箱验证码
const sendEmail = ()=>{
  sendLoding.value = true
  UserControllerService.sendEmail({"email":props.email}).then((res)=>{

    if(res.code===200){
      Notification.success(res.message)
      let time = 60000
      const dsq = setInterval(() => {
        sendTitle.value = (time-1000) / 1000 + "秒"
        if (time <= 0) {
          sendTitle.value = "发送验证码"
          sendLoding.value = false
          clearInterval(dsq)
        }
        time -= 1000
      }, 1000)
    }else{
      sendLoding.value = false
      Notification.error(res.message)
    }
  })
}
</script>
<style scoped>
</style>
