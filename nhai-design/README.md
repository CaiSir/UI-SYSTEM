# NHAI Vue Demo

这是一个使用NHAI框架的Vue演示项目，展示了如何在Vue项目中使用NHAI框架无关的UI组件系统。

## 🚀 项目特点

- ✅ **Vue 3 + TypeScript** - 现代化的Vue开发环境
- ✅ **NHAI框架集成** - 使用独立的NHAI包
- ✅ **框架切换演示** - 支持Vue、React、Svelte、原生JavaScript适配器
- ✅ **树形目录导航** - 清晰的示例组织结构
- ✅ **实时演示** - 动态切换框架并查看效果

## 📦 项目结构

```
UICompont/
├── src/
│   ├── App.vue              # 主应用组件
│   ├── main.ts              # 应用入口
│   ├── nhai-theme.css       # NHAI主题样式
│   └── style.css            # 全局样式
├── test-nhai-package.html   # NHAI包集成测试
├── package.json             # 项目配置
└── README.md                # 项目文档
```

## 🎯 功能演示

### 1. 框架切换
- 支持在Vue、React、Svelte、原生JavaScript之间切换
- 实时查看不同框架下的组件渲染效果
- 框架状态指示器显示当前适配器状态

### 2. 组件演示
- **基础控件**: 按钮、标签、输入框
- **容器组件**: 卡片、容器、窗口
- **布局管理**: 垂直布局、水平布局、网格布局
- **高级示例**: 复杂对象组合、方法调用、样式控制

### 3. 树形导航
- 清晰的目录结构
- 可展开/折叠的分类
- 实时示例预览

## 🛠️ 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **NHAI Framework** - 框架无关的UI组件系统

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3002` 查看演示。

### 构建生产版本

```bash
npm run build
```

## 📖 NHAI框架使用

### 基本用法

```javascript
import { 
  NHAIFrameworkRegistry, 
  VanillaAdapter, 
  VueAdapter,
  ReactAdapter,
  SvelteAdapter,
  nhaiFactory as NHAIObjectFactory
} from 'nhai-framework'

// 注册适配器
NHAIFrameworkRegistry.register(new VanillaAdapter())
NHAIFrameworkRegistry.use('vanilla')

// 创建组件
const button = NHAIObjectFactory.createButton('点击我')
button.setVariant('primary')
button.setOnClick(() => alert('Hello!'))

// 渲染组件
const element = button.render()
container.appendChild(element)
```

### 框架切换

```javascript
// 切换到Vue适配器
NHAIFrameworkRegistry.register(new VueAdapter())
NHAIFrameworkRegistry.use('vue')

// 切换到React适配器
NHAIFrameworkRegistry.register(new ReactAdapter())
NHAIFrameworkRegistry.use('react')

// 切换到Svelte适配器
NHAIFrameworkRegistry.register(new SvelteAdapter())
NHAIFrameworkRegistry.use('svelte')
```

## 🎨 样式系统

项目使用NHAI的内置主题系统：

```css
/* nhai-theme.css */
:root {
  --nhai-primary: #667eea;
  --nhai-secondary: #6c757d;
  --nhai-success: #28a745;
  --nhai-danger: #dc3545;
  --nhai-warning: #ffc107;
  --nhai-info: #17a2b8;
  /* ... 更多主题变量 */
}
```

## 🔧 开发说明

### 项目特点

1. **简化结构**: 移除了所有NHAI框架的源码文件，只保留演示代码
2. **包依赖**: 使用独立的NHAI包，通过npm安装
3. **类型安全**: 完整的TypeScript支持
4. **热重载**: Vite提供快速的开发体验

### 文件说明

- `src/App.vue`: 主演示组件，包含框架切换和示例展示
- `src/nhai-theme.css`: NHAI组件的主题样式
- `test-nhai-package.html`: NHAI包集成测试页面

## 📚 相关资源

- [NHAI框架文档](../nhai-framework/README.md)
- [NHAI框架源码](../nhai-framework/)
- [框架分离总结](NHAI-FRAMEWORK-SEPARATION-SUMMARY.md)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个演示项目！

## 📄 许可证

MIT License

---

**NHAI Vue Demo** - 展示NHAI框架在Vue中的强大功能！