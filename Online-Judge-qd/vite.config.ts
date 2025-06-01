import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    monacoEditorPlugin({}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  //服务器配置
  server: {
    //配置端口
    host: '127.0.0.1', //本机地址
    port: 80,  //通过80端口号访问
    //配置反向代理
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',  // 后端服务地址（不带路径）
        rewrite: (path) => path.replace(/^\/management/, ''),
        changeOrigin: true        // 解决跨域，修改请求源为后端地址
      },
      '/management/api': {
        target: 'http://127.0.0.1:8080',
        rewrite: (path) => path.replace(/^\/management/, ''),
        changeOrigin: true
      }
    },
    // 禁用缓存
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
})
