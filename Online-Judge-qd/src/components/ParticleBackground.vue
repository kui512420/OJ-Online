<template>
  <div class="particle-background">
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
    <div class="overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationId: number

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  connections: number[]
}

class ParticleSystem {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private particles: Particle[] = []
  private mouseX = 0
  private mouseY = 0
  private colors = ['#00f5ff', '#0080ff', '#4169e1', '#9370db', '#ff6347', '#00ffab']

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.resize()
    this.createParticles()
    this.bindEvents()
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000)
    this.particles = []

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        connections: []
      })
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize()
      this.createParticles()
    })

    this.canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    })
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 更新粒子位置
    this.particles.forEach((particle, i) => {
      // 鼠标吸引效果
      const dx = this.mouseX - particle.x
      const dy = this.mouseY - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        const force = (100 - distance) / 100
        particle.vx += dx * force * 0.0003
        particle.vy += dy * force * 0.0003
      }

      particle.x += particle.vx
      particle.y += particle.vy

      // 边界检测
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1

      // 保持粒子在画布内
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x))
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y))

      // 绘制粒子
      this.ctx.save()
      this.ctx.globalAlpha = particle.alpha
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      this.ctx.fillStyle = particle.color
      this.ctx.fill()

      // 添加发光效果
      this.ctx.shadowColor = particle.color
      this.ctx.shadowBlur = 10
      this.ctx.fill()
      this.ctx.restore()

      // 连接附近的粒子
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j]
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          this.ctx.save()
          this.ctx.globalAlpha = (120 - distance) / 120 * 0.3
          this.ctx.beginPath()
          this.ctx.moveTo(particle.x, particle.y)
          this.ctx.lineTo(other.x, other.y)
          this.ctx.strokeStyle = particle.color
          this.ctx.lineWidth = 0.5
          this.ctx.stroke()
          this.ctx.restore()
        }
      }
    })
  }

  start() {
    const loop = () => {
      this.animate()
      animationId = requestAnimationFrame(loop)
    }
    loop()
  }

  stop() {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }
}

onMounted(() => {
  if (canvasRef.value) {
    const particleSystem = new ParticleSystem(canvasRef.value)
    particleSystem.start()
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #000000 100%);
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
}
</style> 