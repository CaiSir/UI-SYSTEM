# NHAI Framework

NHAI是一个框架无关的UI组件系统，支持Vue、React、Svelte和原生JavaScript。

## 特性

- 🎯 **框架无关**: 支持Vue、React、Svelte、原生JavaScript
- 🎨 **统一API**: 所有框架使用相同的组件API
- ⚡ **自动检测**: 自动检测运行环境并选择合适的适配器
- 🔧 **类型安全**: 完整的TypeScript支持
- 📦 **轻量级**: 无依赖，体积小巧

## 安装

```bash
npm install nhai-framework
```

## 快速开始

### 原生JavaScript

```javascript
import { NHAIObjectFactory, VanillaAdapter, NHAIFrameworkRegistry } from 'nhai-framework'

// 注册适配器
NHAIFrameworkRegistry.register(new VanillaAdapter())
NHAIFrameworkRegistry.use('vanilla')

// 创建组件
const button = NHAIObjectFactory.createButton('点击我')
button.setVariant('primary')
button.setOnClick(() => alert('Hello NHAI!'))

// 渲染到DOM
const container = document.getElementById('app')
const element = button.render()
container.appendChild(element)
```

### Vue

```javascript
import { NHAIObjectFactory, VueAdapter, NHAIFrameworkRegistry, NHAIPlugin } from 'nhai-framework'
import { createApp } from 'vue'

// 注册适配器
NHAIFrameworkRegistry.register(new VueAdapter())
NHAIFrameworkRegistry.use('vue')

// 使用插件
const app = createApp(App)
app.use(NHAIPlugin)
app.mount('#app')

// 在组件中使用
import { useNHAI } from 'nhai-framework'
const { createElement } = useNHAI()
```

### React

```javascript
import { NHAIObjectFactory, ReactAdapter, NHAIFrameworkRegistry, useNHAI } from 'nhai-framework'

// 注册适配器
NHAIFrameworkRegistry.register(new ReactAdapter())
NHAIFrameworkRegistry.use('react')

// 在组件中使用
function MyComponent() {
  const { createElement } = useNHAI()
  
  const button = NHAIObjectFactory.createButton('React按钮')
  button.setVariant('success')
  
  return createElement('div', {}, [button.render()])
}
```

### Svelte

```javascript
import { NHAIObjectFactory, SvelteAdapter, NHAIFrameworkRegistry, createNHAIStore } from 'nhai-framework'

// 注册适配器
NHAIFrameworkRegistry.register(new SvelteAdapter())
NHAIFrameworkRegistry.use('svelte')

// 使用Store
const nhaiStore = createNHAIStore()
```

## API文档

### 核心API

#### NHAIObjectFactory

创建NHAI组件的工厂类。

```javascript
// 创建按钮
const button = NHAIObjectFactory.createButton('文本', parent)

// 创建标签
const label = NHAIObjectFactory.createLabel('文本', parent)

// 创建输入框
const input = NHAIObjectFactory.createInput(parent)

// 创建卡片
const card = NHAIObjectFactory.createCard(parent)

// 创建容器
const container = NHAIObjectFactory.createContainer(parent)

// 创建窗口
const window = NHAIObjectFactory.createWindow('标题', parent)

// 创建布局
const vbox = NHAIObjectFactory.createVBoxLayout(parent)
const hbox = NHAIObjectFactory.createHBoxLayout(parent)
const grid = NHAIObjectFactory.createGridLayout(parent)
```

#### 组件方法

所有组件都继承自NHAIWidget，提供以下方法：

```javascript
// 尺寸设置
widget.setWidth(100)
widget.setHeight(50)
widget.setMinimumWidth(80)
widget.setMaximumWidth(200)

// 样式设置
widget.setStyle({ backgroundColor: '#f0f0f0' })
widget.setCustomStyle({ borderRadius: '8px' })

// 属性设置
widget.setId('my-widget')
widget.setClassName('custom-class')
widget.setVisible(true)
widget.setEnabled(false)

// 事件处理
widget.addEventListener('click', handler)
widget.removeEventListener('click', handler)
widget.emit('custom-event', data)

// 渲染
const element = widget.render()
```

#### 布局管理

```javascript
// 垂直布局
const vbox = NHAIObjectFactory.createVBoxLayout()
vbox.setSpacing(10)
vbox.addChild(button1)
vbox.addChild(button2)

// 水平布局
const hbox = NHAIObjectFactory.createHBoxLayout()
hbox.setSpacing(15)
hbox.addChild(input)
hbox.addChild(button)

// 网格布局
const grid = NHAIObjectFactory.createGridLayout()
grid.setColumns(3)
grid.setRows(2)
grid.addChild(card1)
grid.addChild(card2)
```

## 📁 项目结构

```
nhai-framework/
├── 📁 src/                    # 源代码
│   ├── 📁 adapters/           # 框架适配器
│   ├── 📁 components/         # 组件库
│   ├── 📁 core/               # 核心系统
│   ├── 📁 examples/            # 示例代码
│   └── 📁 factory/             # 工厂模式
├── 📁 docs/                   # 文档
├── 📁 demos/                  # 演示页面
├── 📁 tests/                  # 测试页面
└── 📁 dist/                   # 构建输出
```

详细的项目结构说明请查看 [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)

## 🚀 演示和测试

### 查看演示
- **动态组件演示**: `demos/dynamic-components-demo.html`
- **框架封装演示**: `demos/framework-wrapper-demo.html`
- **框架对比演示**: `demos/react-vue-svelte-comparison.html`
- **UI框架对比**: `demos/framework-comparison-demo.html`

### 运行测试
- **性能测试**: `tests/actual-performance-test.html`
- **快速测试**: `tests/quick-test.html`
- **功能测试**: `tests/test-page.html`

## 📚 文档

- **性能分析**: [PERFORMANCE-ANALYSIS.md](./PERFORMANCE-ANALYSIS.md)
- **框架对比**: [REACT-VS-VUE-VS-SVELTE-ANALYSIS.md](./REACT-VS-VUE-VS-SVELTE-ANALYSIS.md)
- **UI框架封装**: [UIFRAMEWORK-WRAPPER-ANALYSIS.md](./UIFRAMEWORK-WRAPPER-ANALYSIS.md)
- **组件使用指南**: [NHAITextButton-Links-Guide.md](./NHAITextButton-Links-Guide.md)

## 构建

```bash
# 安装依赖
npm install

# 构建
npm run build

# 开发模式
npm run dev
```

## 许可证

MIT License
