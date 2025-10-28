import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import MainApp from './MainApp.vue'

// 使用 MainApp（包含展示器和设计器）
const app = createApp(MainApp)
app.use(ElementPlus)
app.mount('#app')

