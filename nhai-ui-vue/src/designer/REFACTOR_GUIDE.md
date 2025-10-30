# DesignerApp.vue 重构指南

## 重构目标
将 `DesignerApp.vue` (约5000行) 按功能模块拆分为多个 composables。

## 已完成的模块

### 1. 类型定义 (`types/designer.ts`)
- `CanvasComponent`
- `DialogChildInfo`
- `LayoutChildInfo`
- `ComponentDefinition`
- `PropertyConfig`

### 2. 组件库管理 (`composables/useComponentLibrary.ts`)
- 组件列表定义
- 按类别获取组件
- 组件查找

### 3. 画布管理 (`composables/useCanvas.ts`)
- 画布组件列表
- 选中组件
- 添加/删除组件
- 清空画布

### 4. 子组件管理 (`composables/useChildComponents.ts`)
- 对话框子组件管理
- 布局子组件管理
- 选中状态管理

### 5. 属性面板配置 (`composables/usePropertyPanel.ts`)
- 属性配置映射
- 获取属性列表

### 6. 组件工厂 (`composables/useComponentFactory.ts`)
- `createChildComponentInstance` - 创建子组件实例
- `createCanvasComponent` - 创建画布组件
- `createComponentElement` - 创建组件元素
- `extractPropsFromInstance` - 提取属性

## 待创建的模块

### 7. 拖拽处理 (`composables/useDragDrop.ts`)
功能包括：
- `handleDragStart` - 拖拽开始
- `handleDrop` - 放置处理
- `handleDialogDragOver` - 对话框区域拖拽悬停
- 画布组件拖拽移动 (`startDrag`, `handleMouseMove`, `handleMouseUp`)
- 对话框子组件拖拽移动 (`startDragDialogChild`, `handleDialogChildMouseMove`, `handleDialogChildMouseUp`)
- 布局子组件拖拽移动 (`startDragLayoutChild`, `handleLayoutChildMouseMove`, `handleLayoutChildMouseUp`)

**依赖关系：**
- `useCanvas` - 画布组件
- `useChildComponents` - 子组件管理
- `useComponentFactory` - 组件创建

### 8. 属性编辑器 (`composables/usePropertyEditor.ts`)
功能包括：
- `getPropValue` - 获取属性值
- `getSelectedPropValue` - 获取选中组件属性值
- `updateDynamicProp` - 更新动态属性
- `updateSelectedDynamicProp` - 更新选中组件属性
- `getSelectedPositionX/Y` - 获取位置
- `updateSelectedPosition` - 更新位置
- `updateDialogElement` - 更新对话框元素

**依赖关系：**
- `useCanvas` - 画布组件
- `useChildComponents` - 子组件管理
- `usePropertyPanel` - 属性配置

### 9. 代码生成器 (`composables/useCodeGenerator.ts`)
功能包括：
- `updateCode` - 生成代码（约1300行，复杂逻辑）
条件下转换各组件类型为命令式API代码

**依赖关系：**
- `useCanvas` - 画布组件
- `useChildComponents` - 子组件管理

## 重构步骤

1. **完成剩余 composables**
   - 创建 `useDragDrop.ts`
   - 创建 `usePropertyEditor.ts`
   - 创建 `useCodeGenerator.ts`

2. **重构 DesignerApp.vue**
   - 导入所有 composables
   - 替换原有函数调用为 composables 方法
   - 保持模板不变
   - 逐步迁移逻辑

3. **测试验证**
   - 确保所有功能正常工作
   - 修复可能的依赖问题

## 模块依赖图

```
DesignerApp.vue
├── useComponentLibrary (独立)
├── useCanvas (独立)
├── useChildComponents (独立)
├── usePropertyPanel (独立)
├── useComponentFactory (独立)
├── useDragDrop
│   ├── useCanvas
│   ├── useChildComponents
│   └── useComponentFactory
├── usePropertyEditor
│   ├── useCanvas
│   ├── useChildComponents
│   └── usePropertyPanel
└── useCodeGenerator
    ├── useCanvas
    └── useChildComponents
```

## 注意事项

1. **状态共享**：多个 composables 需要共享状态（如 `canvasComponents`, `dialogChildren`），应该在 `DesignerApp.vue` 中统一管理并通过参数传递

2. **事件处理**：拖拽、点击等事件处理逻辑复杂，需要仔细迁移

3. **代码生成**：代码生成逻辑非常长（约1300行），需要仔细测试

4. **类型安全**：保持 TypeScript 类型完整性

