<template>
  <div ref="chartRef" style="width: 100%; height: 300px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, watch } from 'vue'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts/theme/dark' // 导入暗色主题

// 定义接收的属性
const props = defineProps({
  chartData: {
    type: Array,
    default: () => [
      { value: 85, name: '数组' },
      { value: 70, name: '字符串' },
      { value: 60, name: '动态规划' },
      { value: 55, name: '树' },
      { value: 45, name: '图论' },
    ]
  },
  title: {
    type: String,
    default: '刷题数据统计'
  },
  subtitle: {
    type: String,
    default: '各题目类型通过率'
  }
})

// 注册组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
])

const chartRef = ref<HTMLElement>()
let myChart: echarts.ECharts | null = null

const updateChart = () => {
  if (!myChart) return

  // 准备配置
  const option = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 'right',
    },
    series: [
      {
        name: '题目类型',
        type: 'pie',
        radius: '50%',
        data: props.chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  // 应用配置
  myChart.setOption(option)
}

const initChart = () => {
  if (!chartRef.value) return

  // 1. 初始化图表（使用暗色主题）
  myChart = echarts.init(chartRef.value, 'dark')
  
  // 2. 更新图表
  updateChart()
}

// 监听数据变化
watch(() => props.chartData, () => {
  updateChart()
}, { deep: true })

// 窗口缩放处理
const handleResize = () => myChart?.resize()

onMounted(() => {
  try {
    initChart()
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('图表初始化失败:', err)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  myChart?.dispose()
})
</script>
