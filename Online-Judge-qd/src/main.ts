import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
import Prism from 'prismjs';
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
// arco-design 组件库
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import  '@/access/axios';
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueMarkdownEditor)
app.use(VMdPreview)
app.use(ArcoVue);
app.mount('#app')


