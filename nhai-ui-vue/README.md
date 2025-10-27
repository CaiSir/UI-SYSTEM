# NHAI UI Vue

基于 Vue 3 + Element Plus 的组件库，为 NHAI 框架提供命令式组件封装。

## 🚀 特性

- ✅ Vue 3 + TypeScript
- ✅ Element Plus 组件库
- ✅ 命令式 API 封装
- ✅ 完整的类型支持
- ✅ Vite 快速构建
- ✅ 声明式和命令式双模式

## 📦 已实现的组件

### ✅ 基础组件
- Button 按钮
- Input 输入框
- Select 选择器
- Switch 开关
- Checkbox 复选框
- Card 卡片

### ⏳ 待实现
- Radio, Rate, Slider
- Dialog, Loading, Message
- Table, Tree, Tabs
- 更多组件...

完整列表见 [COMPONENTS-LIST.md](./COMPONENTS-LIST.md)

## 🛠️ 安装

```bash
# 开发模式（本地）
cd nhai-ui-vue
npm install
npm run dev

# 发布后安装
npm install nhai-ui-vue
```

## 💻 使用方式

### 1. 在 Vue 项目中使用（声明式）

```vue
<template>
  <div>
    <VueButton text="提交" type="primary" @click="handleSubmit" />
    <VueInput v-model="inputValue" placeholder="请输入" />
    <VueSelect v-model="selectValue" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { VueButton, VueInput, VueSelect } from 'nhai-ui-vue'

const inputValue = ref('')
const selectValue = ref('')
const options = ref([
  { label: '选项1', value: 'option1' }
])

const handleSubmit = () => {
  console.log('提交')
}
</script>
```

### 2. 命令式使用（NHAI 框架）

```typescript
import { 
  VueButtonCommand, 
  VueInputCommand, 
  VueSelectCommand 
} from 'nhai-ui-vue'

// 创建按钮
const button = new VueButtonCommand('提交')
button.setType('primary')
button.setOnClick(() => console.log('clicked'))
const btnElement = button.render()

// 创建输入框
const input = new VueInputCommand('请输入')
input.setValue('默认值')
input.setOnChange((value) => console.log(value))
const inputElement = input.render()

// 添加到页面
document.body.appendChild(btnElement)
document.body.appendChild(inputElement)
```

## 📂 项目结构

```
nhai-ui-vue/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.vue
│   │   │   ├── buttonCommand.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Select/
│   │   └── index.ts
│   ├── index.ts
│   └── App.vue
├── vite.config.ts
└── package.json
```

## 🔧 开发

```bash
# 启动开发服务器
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 📄 License

MIT
