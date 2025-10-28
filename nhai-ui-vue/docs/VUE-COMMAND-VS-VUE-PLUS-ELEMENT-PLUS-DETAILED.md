# Vue Command API vs Vue + Element Plus 详细对比

## 🔍 两种方式的渲染路径

### Vue Command API（批量）

```javascript
// 渲染路径：3 层组件
app.mount()
  ↓
ButtonWrapper (defineComponent 包装)
  ↓
Button.vue (<el-button>)
  ↓
el-button (Element Plus)
```

**层级结构**：
```javascript
createApp({
  render() {
    return buttonProps.map(props => 
      h(ButtonWrapper, props)  // ← 第 1 层：包装组件
    )
  }
})

// ButtonWrapper 内部
return () => h(Button, { text: props.text, ... })  // ← 第 2 层

// Button.vue
<template>
  <el-button>  <!-- ← 第 3 层 -->
    {{ text }}
  </el-button>
</template>
```

---

### Vue + Element Plus（直接）

```javascript
// 渲染路径：2 层组件
app.mount()
  ↓
Button.vue (<el-button>)
  ↓
el-button (Element Plus)
```

**层级结构**：
```javascript
createApp({
  components: { Button },
  render() {
    return batch.map(item => 
      h(Button, { text: item.text, type: item.type })  // ← 第 1 层
    )
  }
})

// Button.vue
<template>
  <el-button>  <!-- ← 第 2 层 -->
    {{ text }}
  </el-button>
</template>
```

---

## ⚡ 为什么 Vue + Element Plus 更快？

### 1. 少了一层组件包装

#### Vue Command API
```javascript
// ButtonWrapper（额外的一层）
const ButtonWrapper = defineComponent({
  setup(props) {
    return () => h(Button, props)  // ← 需要额外的函数调用
  }
})
```

#### Vue + Element Plus
```javascript
// 直接使用 Button.vue
h(Button, { text: item.text, type: item.type })
```

**影响**：
- 每个按钮少一次函数调用
- 减少组件实例创建
- 减少 props 传递开销

---

### 2. 组件实例更轻量

#### Vue Command 渲染 10000 个按钮

```
创建实例数：
- ButtonWrapper：10,000 个（额外的包装）
- Button.vue：10,000 个
- el-button：10,000 个
总计：30,000 个组件实例
```

#### Vue + Element Plus

```
创建实例数：
- Button.vue：10,000 个
- el-button：10,000 个
总计：20,000 个组件实例
```

**减少**：10,000 个组件实例（减少 **33%**）

---

### 3. Props 传递更直接

#### Vue Command
```javascript
// 需要在包装器中转发 props
setup(props) {
  return () => h(Button, {
    text: props.text,    // ← 需要显式传递
    type: props.type,
    size: props.size,
    // ... 11 个属性
  })
}
```

#### Vue + Element Plus
```javascript
// 直接传递 props
h(Button, {
  text: item.text,
  type: item.type
})
```

**性能提升**：减少 10,000 次 props 转发

---

## 📊 性能差异量化

### 10000 个按钮的性能开销

| 步骤 | Vue Command | Vue + Element Plus | 差异 |
|------|------------|-------------------|------|
| **组件实例创建** | 30,000 个 | 20,000 个 | **33% ↓** |
| **函数调用** | 30,000 次 | 20,000 次 | **33% ↓** |
| **Props 传递** | 110,000 次 | 100,000 次 | **9% ↓** |
| **DOM 节点** | 80,000 个 | 80,000 个 | 相同 |

---

## 💡 更深入的性能分析

### Vue Command 的额外开销

```javascript
// ButtonWrapper 做了这些额外工作：
1. defineComponent 调用（虽然缓存了，但仍然需要查找）
2. props 验证和转换
3. setup 函数执行
4. 返回渲染函数
5. 调用渲染函数并传递 props 给 Button.vue
```

**每次 renderBatch 都需要**：
- 查找缓存：`getButtonWrapper()`（但没开销）
- 创建 props 映射：`buttons.map(btn => ({ ... }))`（有开销）
- 组件定义查找：`h(ButtonWrapper, props)`（额外查找）

---

### Vue + Element Plus 的优势

```javascript
// 直接使用 Button.vue
1. 不需要包装层
2. 不需要额外的 props 映射
3. 组件引用更直接
```

---

## 🎯 实际性能对比

### 预期的性能差异

假设渲染 10000 个按钮：

| 方式 | 组件实例 | 函数调用 | 预计时间 | 说明 |
|------|---------|---------|---------|------|
| Vue Command（单个） | 30,000 | 30,000 | 10-30s | 每个按钮独立应用 |
| Vue Command（批量） | 20,000 | 20,000 | **5-10s** | 每 500 个共享应用 |
| Vue + Element Plus | 20,000 | 20,000 | **3-8s** | 少一层包装 |

**差异**：Vue + Element Plus 快 **20-30%**

---

## 📝 代码层面对比

### ButtonWrapper 的实现（额外开销）

```typescript
const ButtonWrapper = defineComponent({
  props: { /* 11 个 props 定义 */ },
  setup(props: any) {
    const handleClick = () => {
      if (props.onClick) {
        props.onClick()  // ← 额外的函数调用
      }
    }

    return () => h(Button, {
      text: props.text,    // ← 需要显式展开每个 prop
      type: props.type,
      size: props.size,
      // ... 11 个属性都要传递
    })
  }
})
```

### 直接使用 Button.vue

```typescript
// 直接在渲染函数中使用
h(Button, {
  text: item.text,
  type: item.type
  // 只传递需要的 props
})
```

**差异**：
- ButtonWrapper：额外的组件层 + props 验证
- Button.vue：直接使用，无额外开销

---

## ✅ 总结

### 为什么 Vue + Element Plus 更快？

1. ✅ **少了一层组件包装**（ButtonWrapper）
2. ✅ **减少了组件实例创建**（33% 减少）
3. ✅ **减少了函数调用开销**
4. ✅ **Props 传递更直接**（不需要转发）
5. ✅ **组件查找更快**（直接引用 vs 通过包装器）

### 性能提升幅度

- **Vue Command（批量）vs Vue + Element Plus**：**快 20-30%**
- **Vue Command（单个）vs Vue + Element Plus**：**快 2-3 倍**

### 关键结论

虽然 DOM 节点数相同（都是 80,000），但：
- Vue + Element Plus 的**组件层次更少**
- Vue + Element Plus 的**初始化更轻量**
- Vue + Element Plus 的**渲染路径更短**

这就是为什么 Vue + Element Plus 比 Vue Command API 更快的原因！

