import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import ShowcaseApp from './showcase/ShowcaseApp.vue'

// 使用 ShowcaseApp 作为主应用
const app = createApp(ShowcaseApp)
app.use(ElementPlus)
app.mount('#app')

