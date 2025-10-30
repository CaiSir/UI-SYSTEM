# DesignerApp.vue 重构开始指南

## ✅ 已完成的模块化架构

所有核心 composables 已经创建完成，文件结构如下：

```
nhai-ui-vue/src/designer/
├── types/
│   └为进一步── designer.ts                    ✅ 类型定义
├── composables/
│   ├── index.ts                              ✅ 统一导出
│   ├── useComponentLibrary.ts                ✅ 组件库管理
│   ├── useCanvas.ts                          ✅ 画布管理
│   ├── useChildComponents.ts                 ✅ 子组件管理
│   ├── usePropertyPanel.ts                   ✅ 属性面板配置
│   ├── useComponentFactory.ts                ✅ 组件创建工厂
│   ├── useDragDrop.ts                        ⚠️  拖拽处理（handleDrop需完善）
│   ├── usePropertyEditor.ts                  ⚠️  属性编辑器（部分需完善）
│   └── useCodeGenerator.ts                   ⚠️  代码生成器（需完整实现）
├── DesignerApp.vue                           ⏳ 待重构（约5000行）
├── REFACTOR_GUIDE.md                         ✅ 重构指南
├── REFACTOR_STATUS.md                        ✅ 进度状态
└── REFACTOR_START_GUIDE.md                   ✅ 本文档
```

## 📝 重构步骤

### 阶段1：导入和使用基础 composables

在 `DesignerApp.vue` 的 `<script setup>` 中：

```typescript
import { ref, onMounted, watch, nextTick, markRaw } from 'vue'
import {
  useComponentLibrary,
  useCanvas,
  useChildComponents,
  usePropertyPanel Ihr,
  useComponentFactory,
  useDragDrop,
  usePropertyEditor,
  useCodeGenerator
} from './composables'

// 1. 初始化基础 composables
const componentLib = useComponentLibrary()
const canvas = useCanvas()
const childComponents = useChildComponents()
const propertyPanel = usePropertyPanel()
const { createChildComponentInstance, createCanvasComponent } = useComponentFactory()

// 2. 初始化依赖关系的 composables
const codeGen = useCodeGenerator({
  canvasComponents: canvas.canvasComponents,
  dialogChildren: childComponents.dialogChildren
})

const dragDrop = useDragDrop({
  canvasComponents: canvas.canvasComponents,
  dialogChildren: childComponents.dialogChildren,
  layoutChildren: childComponents.layoutChildren,
  selectedComponent: canvas.selectedComponent,
  selectedDialogChild: childComponents.selectedDialogChild,
  selectedLayoutChild: childComponents.selectedLayoutChild,
  selectComponent: canvas.selectComponent,
  selectDialogChild: childComponents.selectDialogChild,
  selectLayoutChild: childComponents.selectLayoutChild,
  clearDialogChildSelection: childComponents.clearDialogChildSelection,
  clearLayoutChildSelection: childComponents.clearLayoutChildSelection,
  updateCode: () => { codeGen.generateCode() },
  createChildComponentInstance,
  createComponent: createCanvasComponent
})

const propertyEditor = usePropertyEditor({
  canvasComponents: canvas.canvasComponents,
  dialogChildren: childComponents.dialogChildren,
  layoutChildren: childComponents.layoutChildren,
  selectedComponent: canvas.selectedComponent,
  selectedDialogChild: childComponents.selectedDialogChild,
  selectedLayoutChild: childComponents.selectedLayoutChild,
  getPropertyList: propertyPanel.getPropertyList,
  updateCode: () => { codeGen.generateCode() }
})

// 3. 导出给模板使用（使用解构重命名避免冲突）
const {
  components,
  componentCategories,
  getComponentsByCategory
} = componentLib

const {
  canvasComponents,
  selectedComponent,
  selectComponent,
  removeComponent,
  clearCanvas
} = canvas

const {
  dialogChildren,
  selectedDialogChild,
  layoutChildren,
  selectedLayoutChild,
  selectDialogChild,
  selectLayoutChild
} = childComponents

// ... 其他导出
```

### 阶段2：替换模板中的函数调用

在模板中，将原来的函数调用替换为 composables 的方法：

```vue
<!-- 原来 -->
<div @dragstart="handleDragStart(comp, $event)">

<!-- 替换为 -->
<div @dragstart="dragDrop.handleDragStart(comp, $event)">
```

### 阶段3：完善缺失的实现

需要从原 `DesignerApp.vue` 完整复制以下方法：

1. **`useDragDrop.ts` 的 `handleDrop` 方法** - 从原文件 `handleDrop`（约600行）完整复制
2. **`usePropertyEditor.ts` 的 `updateDynamicProp` 方法** - 从原文件 `updateDynamicProp`（约450行）完整复制
3. **`useCodeGenerator.ts` 的 `generateCode` 方法** - 从原文件 `updateCode`（约1300行）完整复制

### 阶段4：移除原代码

在确认所有功能正常后，从 `DesignerApp.vue` 中删除已经迁移到 composables 的代码。

## ⚠️ 注意事项

1. **依赖关系**：某些 composables 依赖其他 composables，需要按正确顺序初始化
2. **状态共享**：多个 composables 需要共享同一个状态（如 `canvasComponents`），通过参数传递
3. **事件处理**：事件处理器需要正确绑定到 composables 返回的函数
4. **逐步迁移**：建议分阶段迁移，每完成一部分就测试，确保功能正常

## 🎯 快速开始

1. 在 `DesignerApp.vue` 中导入需要的 composables
2. 初始化 composables（注意依赖关系）
3. 先在模板中替换简单的函数调用（如 `getComponentsByCategory`）
4. 测试功能是否正常
5. 逐步替换其他函数调用
6. 最后完善 `handleDrop`、`updateDynamicProp` 和 `generateCode` 的实现

## 📌 待完善的 TODO

- [ ] 从原文件复制 `handleDrop` 完整实现到 `useDragDrop.ts`
- [ ] 从原文件复制 `updateDynamicProp` 完整实现到 `usePropertyEditor.ts`
- [ ] 从原文件复制 `updateCode` 完整实现到 `useCodeGenerator.ts`
- [ ] 测试所有功能确保正常工作
- [ ] 删除原 `DesignerApp.vue` 中的重复代码

