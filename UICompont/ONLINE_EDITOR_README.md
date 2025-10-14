# NHAI 在线编辑预览功能

## 🎉 功能概述

UICompont 项目现已支持在线编辑预览功能！用户可以在浏览器中实时编辑 NHAI 组件代码，并立即看到预览效果。

## ✨ 新增功能

### 1. 在线代码编辑器
- **简单易用**：基于 textarea 的代码编辑器，支持语法高亮样式
- **实时编辑**：代码修改时立即触发变更事件
- **多语言支持**：支持 JavaScript/TypeScript 语法

### 2. 实时预览
- **即时渲染**：代码执行后立即显示 NHAI 组件效果
- **交互支持**：支持按钮点击、输入框交互等用户操作
- **错误处理**：执行错误时显示详细的错误信息

### 3. 代码工具
- **语法检查**：智能检测代码语法错误和潜在问题
- **代码格式化**：自动格式化代码，保持代码风格一致
- **智能建议**：根据代码内容提供 NHAI 组件使用建议
- **代码复制**：一键复制代码到剪贴板

### 4. 安全执行环境
- **沙箱隔离**：在受控环境中安全执行用户代码
- **超时保护**：防止无限循环和长时间执行
- **错误捕获**：完善的错误处理和用户反馈

## 🚀 使用方法

### 启动应用
```bash
cd UICompont
npm run dev
```

### 使用在线编辑器
1. 在左侧选择"在线编辑"模式
2. 在代码编辑器中编写 NHAI 组件代码
3. 点击"运行代码"查看预览效果
4. 使用工具栏中的各种工具优化代码

### 示例代码
```javascript
// NHAI 组件示例
const container = NHAIObjectFactory.createContainer()

// 创建按钮
const button = NHAIObjectFactory.createButton('点击我')
button.setVariant('primary')
button.setWidth(120)
button.setHeight(40)
button.setOnClick(() => alert('按钮被点击！'))

// 创建标签
const label = NHAIObjectFactory.createLabel('欢迎使用NHAI')
label.setFontSize(16)
label.setColor('#2c3e50')

// 添加到容器
container.addChild(label)
container.addChild(button)

// 渲染到预览区域
const element = container.render()
document.querySelector('.preview-area')?.appendChild(element)
```

## 🛠️ 技术实现

### 核心组件
- **SimpleCodeEditor.vue**：代码编辑器组件
- **PreviewArea.vue**：预览区域组件
- **CodeExecutor.ts**：安全的代码执行器
- **SyntaxChecker.ts**：语法检查工具

### 技术栈
- **Vue 3 + TypeScript**：现代化的前端框架
- **NHAI Framework**：框架无关的 UI 组件系统
- **原生 JavaScript**：无需额外依赖的代码执行

### 安全特性
- **代码隔离**：使用 Function 构造函数创建隔离的执行环境
- **超时控制**：5秒执行超时，防止无限循环
- **错误处理**：完善的错误捕获和用户反馈机制

## 📁 文件结构

```
UICompont/
├── src/
│   ├── components/
│   │   ├── SimpleCodeEditor.vue    # 代码编辑器
│   │   └── PreviewArea.vue         # 预览区域
│   ├── utils/
│   │   ├── CodeExecutor.ts         # 代码执行器
│   │   └── SyntaxChecker.ts        # 语法检查器
│   └── App.vue                     # 主应用组件
├── online-editor-demo.html         # 功能演示页面
└── README.md                       # 说明文档
```

## 🎯 功能特点

### 编辑器功能
- ✅ 语法高亮样式
- ✅ 代码自动补全建议
- ✅ 实时语法检查
- ✅ 代码格式化
- ✅ 智能代码建议
- ✅ 一键复制代码

### 预览功能
- ✅ 实时渲染
- ✅ 交互支持
- ✅ 错误显示
- ✅ 执行信息统计
- ✅ 响应式设计

### 安全特性
- ✅ 代码沙箱隔离
- ✅ 执行超时保护
- ✅ 错误安全处理
- ✅ 用户输入验证

## 🔧 配置说明

### Vite 配置
```typescript
// vite.config.ts
export default defineConfig({
  // ... 其他配置
  define: {
    global: 'globalThis'  // 支持 Monaco Editor
  }
})
```

### 代码执行器配置
```typescript
// CodeExecutor.ts
const executionTimeout = 5000 // 5秒超时
```

## 🐛 故障排除

### 常见问题
1. **代码执行失败**：检查语法错误，使用语法检查功能
2. **预览不显示**：确保代码中包含了 `render()` 和 `appendChild()` 调用
3. **编辑器加载失败**：检查浏览器控制台错误信息

### 调试技巧
- 使用浏览器开发者工具查看控制台输出
- 检查网络请求是否正常
- 验证 NHAI 框架是否正确加载

## 📈 未来计划

- [ ] 集成 Monaco Editor 提供更专业的编辑体验
- [ ] 添加代码片段和模板功能
- [ ] 支持多文件编辑
- [ ] 添加代码版本管理
- [ ] 支持导入/导出功能

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个功能！

---

**享受在线编辑 NHAI 组件的乐趣！** 🎨✨
