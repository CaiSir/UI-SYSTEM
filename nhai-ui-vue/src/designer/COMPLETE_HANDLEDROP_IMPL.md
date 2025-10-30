# handleDrop 完整实现说明

## 概述

`handleDrop` 函数需要从 `DesignerApp.vue` (319-908行) 完整复制到 `useDragDrop.ts`。

## 需要修改的地方

### 1. 函数签名

原文件使用普通变量 `draggedComponent`，composable 中使用 `draggedComponent.value`：

```typescript
// 原文件
if (!draggedComponent) return
const childInstance = await createChildComponentInstance(draggedComponent)

// composable 版本
if (!draggedComponent.value) return
const childInstance = await createChildComponentInstance(draggedComponent.value)
```

### 2. 变量作用域

以下变量需要从 deps 参数中获取：
- `canvasComponents` → `canvasComponents.value`
- `dialogChildren` → `dialogChildren.value`  
- `layoutChildren` → `layoutChildren.value`
- `createChildComponentInstance` → `createChildComponentInstance`
- `createComponent` → `createComponent`
- `updateCode` → `updateCode`
- `selectLayoutChild` → `selectLayoutChild`
- `selectDialogChild` → `selectDialogChild`
- `startDragLayoutChild` → `startDragLayoutChild`
- `startDragDialogChild` → `startDragDialogChild`
- `selectComponent` → `selectComponent`
- `nextTick` → 从 vue 导入

### 3. 完整实现步骤

1. 复制 `DesignerApp.vue` 319-908行的 `handleDrop` 函数
2. 将所有变量引用改为从 deps 或 composable 作用域获取
3. 将 `draggedComponent` 改为 `draggedComponent.value`
4. 将 `draggedComponent = null` 改为 `draggedComponent.value = null`
5. 确保所有函数调用都正确引用

### 4. 代码块结构

函数包含以下主要分支：
1. **布局组件（Grid/Container）处理** (324-594行)
   - 方法1：通过 data-id 查找 (326-464行)
   - 方法2：通过 .vue-grid/.vue-container 查找 (467-593行)
   
2. **Widget 内容区域处理** (596-751 Exercise行)

3. **对话框内容区域处理** (754-879行)

4. **画布上放置处理** (881-904行)

每个分支都需要保持完整的逻辑。

## 建议的实现方式

由于代码过长，建议：
1. 分块复制并测试
2. 先实现一个分支（如画布放置），测试通过后再添加其他分支
3. 或者创建一个辅助函数来减少重复代码

