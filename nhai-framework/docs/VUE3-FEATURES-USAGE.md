# 如何在 NHAI 中使用 Vue 3 特性

## 🎯 目前可以使用的 Vue 3 特性

### 1. ✅ Composition API (完全支持)

```typescript
class VueButton extends NHAIWidget {
  render() {
    const app = createApp({
      setup() {
        // ✅ 可以使用 ref
        const count = ref(0)
        
        // ✅ 可以使用 reactive
        const state = reactive({ name: 'button' })
        
        // ✅ 可以使用 computed
        const displayText = computed(() => state.name + count.value)
        
        // ✅ 可以使用 watch/watchEffect
        watch(count, (newVal) => {
          console.log('count changed:', newVal)
        })
        
        // ✅ 可以使用生命周期钩子
        onMounted(() => {
          console.log('mounted')
        })
        
        const handleClick = () => {
          count.value++
        }
        
        return () => h(ElButton, {
          onClick: handleClick
        }, {
          default: () => displayText.value
        })
      }
    })
    
    return app
  }
}
```

### 2. ✅ 响应式系统 (完全支持)

```typescript
import { ref, reactive, computed, watch, watchEffect } from 'vue'

setup() {
  const inputText = ref('')
  const buttonState = reactive({
    disabled: false,
    loading: false
  })
  
  // ✅ computed
  const canSubmit = computed(() => inputText.value.length > 0)
  
  // ✅ watch
  watch(inputText, (newVal) => {
    buttonState.disabled = newVal.length === 0
  })
  
  // ✅ watchEffect
  watchEffect(() => {
    console.log('Current state:', buttonState)
  })
  
  return () => h(ElButton, {
    disabled: buttonState.disabled,
    loading: buttonState.loading
  })
}
```

### 3. ✅ Teleport (支持)

```typescript
setup() {
  return () => h(Teleport, { to: 'body' }, {
    default: () => h('div', '传送的内容')
  })
}
```

### 4. ✅ Suspense (支持)

```typescript
setup() {
  return () => h(Suspense, {
    onFallback: () => h('div', '加载中...')
  }, {
    default: () => h(AsyncComponent)
  })
}
```

### 5. ✅ Transition 动画 (支持)

```typescript
import { Transition } from 'vue'

setup() {
  const show = ref(true)
  
  return () => h(Transition, {
    name: 'fade'
  }, {
    default: () => show.value ? h('div', '内容') : null
  })
}
```

## ⚠️ 受限的 Vue 3 特性

### 1. ❌ 模板语法

```typescript
// ❌ 不能使用
<template>
  <div>{{ count }}</div>
  <button @click="increment">Click</button>
</template>

// ✅ 必须用 h 函数替代
setup() {
  const count = ref(0)
  return () => h('div', {}, [
    count.value,
    h('button', { onClick: increment }, 'Click')
  ])
}
```

### 2. ❌ 指令

```typescript
// ❌ 不能直接使用 v-if, v-for 等
<div v-if="visible" />

// ✅ 需要用 JavaScript 条件
return () => visible.value ? h('div', 'content') : null

// ❌ 不能使用 v-for
<div v-for="item in list" />

// ✅ 需要用 map
return () => list.value.map(item => h('div', item))
```

### 3. ⚠️ 编译器优化受限

```vue
<!-- Vue 编译器会优化这个 -->
<template>
  <div class="static">{{ msg }}</div>
</template>
```

编译器会自动：
- ✅ 静态提升 (hoist static nodes)
- ✅ 补丁标志 (patch flags)  
- ✅ 属性排序 (attribute ordering)

```typescript
// 用 h 函数需要手动优化
return () => h('div', { class: 'static' }, msg.value)
```

## 🚀 如何充分利用 Vue 3 特性

### 方案1: 使用 <script setup> 的思路

虽然不能直接用 `.vue` 文件，但可以用类似的方式组织代码：

```typescript
class VueComplexButton extends NHAIWidget {
  private _text: string = ''
  private _count: number = 0
  
  render() {
    const self = this
    
    // 使用 Composition API
    const app = createApp({
      setup() {
        // ✅ 响应式状态
        const localCount = ref(0)
        const buttonText = ref(self._text)
        
        // ✅ 计算属性
        const displayText = computed(() => {
          return `${buttonText.value} (${localCount.value})`
        })
        
        // ✅ 监听器
        watch(localCount, (newVal) => {
          console.log('count changed to', newVal)
        })
        
        // ✅ 生命周期
        onMounted(() => {
          console.log('Button mounted')
        })
        
        onBeforeUnmount(() => {
          console.log('Button unmounted')
        })
        
        // ✅ 方法
        const handleClick = () => {
          localCount.value++
          if (self._onClick) {
            self._onClick()
          }
        }
        
        // ✅ 渲染函数
        return () => h(ElButton, {
          onClick: handleClick
        }, {
          default: () => displayText.value
        })
      }
    })
    
    return app.mount(this.createContainer())
  }
}
```

### 方案2: 自定义 Hook

```typescript
// composables/useButtonState.ts
import { ref, computed } from 'vue'

export function useButtonState(initialText: string) {
  const text = ref(initialText)
  const count = ref(0)
  const loading = ref(false)
  
  const displayText = computed(() => `${text.value} (${count.value})`)
  
  const increment = () => {
    count.value++
  }
  
  const setLoading = (value: boolean) => {
    loading.value = value
  }
  
  return {
    text,
    count,
    loading,
    displayText,
    increment,
    setLoading
  }
}

// 在组件中使用
class VueButton extends NHAIWidget {
  render() {
    const app = createApp({
      setup() {
        // ✅ 使用自定义 hook
        const {
          displayText,
          loading,
          increment,
          setLoading
        } = useButtonState(this._text)
        
        return () => h(ElButton, {
          onClick: increment,
          loading: loading.value
        }, {
          default: () => displayText.value
        })
      }
    })
  }
}
```

### 方案3: 状态管理 (Pinia)

```typescript
import { createPinia } from 'pinia'

// 可以在 createApp 中使用 Pinia
const app = createApp({
  setup() {
    // ✅ 可以使用 Pinia store
    const store = useCounterStore()
    
    return () => h(ElButton, {
      onClick: () => store.increment()
    }, {
      default: () => `Count: ${store.count}`
    })
  }
})

app.use(createPinia())
```

## 💡 实用技巧

### 技巧1: 使用 JSX 获得更好的开发体验

安装 `@vitejs/plugin-vue-jsx`：

```typescript
import { defineComponent } from 'vue'

class VueButton extends NHAIWidget {
  render() {
    return defineComponent({
      setup() {
        const count = ref(0)
        
        // ✅ 使用 JSX 语法
        return () => (
          <el-button onClick={() => count.value++}>
            Count: {count.value}
          </el-button>
        )
      }
    })
  }
}
```

### 技巧2: 抽象通用逻辑

```typescript
// utils/vueRenderer.ts
export function createVueRenderer(config: {
  setup: () => () => any
}) {
  return (container: HTMLElement) => {
    const app = createApp({ setup: config.setup })
    app.mount(container)
    return app
  }
}

// 使用
class VueButton extends NHAIWidget {
  render() {
    const self = this
    return createVueRenderer({
      setup() {
        const count = ref(0)
        return () => h(ElButton, {
          onClick: () => count.value++
        }, {
          default: () => count.value
        })
      }
    })(this.createContainer())
  }
}
```

### 技巧3: 使用 defineComponent 获得更好的类型支持

```typescript
import { defineComponent } from 'vue'

class VueButton extends NHAIWidget {
  render() {
    return defineComponent({
      setup() {
        // 更好的 TypeScript 类型推断
        const state = reactive({
          count: 0,
          text: 'Click me'
        })
        
        return () => h('div', [
          h('p', state.text),
          h(ElButton, {
            onClick: () => state.count++
          }, {
            default: () => `Count: ${state.count}`
          })
        ])
      }
    })
  }
}
```

## 🎯 最佳实践总结

### ✅ 应该做的

1. **充分利用 Composition API**
   ```typescript
   setup() {
     // ref, reactive, computed, watch 等
   }
   ```

2. **使用生命

周期钩子**
   ```typescript
   onMounted(() => {})
   onBeforeUnmount(() => {})
   onUpdated(() => {})
   ```

3. **创建自定义 Hooks**
   ```typescript
   function useCustomLogic() {
     // 可复用的逻辑
   }
   ```

4. **使用 defineComponent**
   ```typescript
   defineComponent({ setup() {} })
   ```

### ❌ 不应该做的

1. **不要尝试使用模板语法**
   ```typescript
   // ❌ 不行
   return '<div>{{ text }}</div>'
   
   // ✅ 可以
   return h('div', text.value)
   ```

2. **不要依赖编译时优化**
   ```typescript
   // 运行时创建，无法使用编译优化
   ```

3. **不要创建过多独立的 Vue app**
   ```typescript
   // ❌ 每渲染一次创建一个新 app
   app1, app2, app3...
   
   // ✅ 考虑缓存和复用
   ```

## 📚 完整的 Vue 3 特性支持表

| 特性 | 支持度 | 说明 |
|------|-------|------|
| Composition API | ✅ 完全支持 | ref, reactive, computed 等 |
| Options API | ❌ 不支持 | 不能使用 export default |
| Template 语法 | ❌ 不支持 | 必须用 h 函数 |
| 指令 | ⚠️ 部分支持 | 需要用 JS 逻辑替代 |
| Teleport | ✅ 支持 | h(Teleport, ...) |
| Suspense | ✅ 支持 | h(Suspense, ...) |
| Transition | ✅ 支持 | h(Transition, ...) |
| 生命周期 | ✅ 完全支持 | onMounted, onUnmounted 等 |
| Provide/Inject | ✅ 支持 | provide, inject |
| 响应式系统 | ✅ 完全支持 | 所有响应式 API |
| TypeScript | ✅ 完全支持 | 原生 TypeScript |
| DevTools | ✅ 支持 | Vue DevTools 可调试 |
| 编译优化 | ❌ 不支持 | 无模板编译器 |

## 💡 总结

**当前方式可以使用的 Vue 3 特性**：
- ✅ 所有 Composition API
- ✅ 完整的响应式系统  
- ✅ 生命周期钩子
- ✅ Teleport, Suspense, Transition
- ✅ Provide/Inject
- ✅ TypeScript 支持

**受限的特性**：
- ❌ Template 语法
- ❌ 指令 (v-if, v-for 等)
- ❌ 编译时优化

**建议**：
1. 充分利用 Composition API
2. 创建自定义 Hooks 复用逻辑
3. 使用 defineComponent 获得更好的类型支持
4. 考虑使用 JSX 获得更好的开发体验

