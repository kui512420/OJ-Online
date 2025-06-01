import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useIndexStore = defineStore('index', () => {
  const tabs = ref([
    {
      key: '0_1',
      title: '首页',
      path: '/management/index',
    },
  ])
  return { tabs }
})
