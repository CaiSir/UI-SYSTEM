# window.NHAIUIVue 全局变量定义说明

## 定义位置

`window.NHAIUIVue` 是在构建 UMD 格式时自动生成的全局变量。定义位置在：

### 1. Vite 构建配置

**文件：** `vite.config.ts`

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NHAIUIVue',  // 👈 这里定义了全局变量名
      formats: ['es', 'cjs', 'umd'],  // 👈 UMD 格式会生成全局变量
      // ...
    }
  }
})
```

### 2. 构建过程

当执行 `npm run build` 时：

1. **Vite/Rollup 构建 UMD 格式**
   - 读取 `name: 'NHAIUIVue'` 配置
   - 生成 `dist/index.umd.js` 文件
   - 自动将组件库绑定到 `window.NHAIUIVue`

2. **生成的 UMD 文件结构**

```javascript
// dist/index.umd.js (简化版)
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, 
   factory(global.NHAIUIVue = {}));  // 👈 这里赋值给 window.NHAIUIVue
})(this, (function (exports) {
  // 组件库代码...
  exports.NhaiButtonCommand = NhaiButtonCommand;
  exports.NhaiInputCommand = NhaiInputCommand;
  // ... 其他导出
}));
```

### 3. 实际使用

当在 HTML 中引入 UMD 文件后：

```html
<script src="./dist/index.umd.js"></script>
<script>
  // 此时 window.NHAIUIVue 已经被定义
  console.log(window.NHAIUIVue)  // ✅ 输出组件库对象
  
  const { NhaiButtonCommand } = window.NHAIUIVue
  // 使用组件...
</script>
```

## 如何查看定义

### 方法 1: 查看构建后的文件

```bash
# 构建项目
npm run build

# 查看生成的 UMD 文件
cat dist/index.umd.js | head -20
```

在文件开头可以看到类似这样的代码：

```javascript
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, 
   factory(global.NHAIUIVue = {}));  // 👈 这里
})(this, (function (exports) {
  'use strict';
  // ...
```

### 方法 2: 在浏览器控制台查看

```html
<!DOCTYPE html>
<html>
<head>
  <script src="./dist/index.umd.js"></script>
</head>
<body>
  <script>
    // 查看全局变量
    console.log('window.NHAIUIVue:', window.NHAIUIVue)
    console.log('可用的组件:', Object.keys(window.NHAIUIVue))
  </script>
</body>
</html>
```

## 修改全局变量名

如果需要修改全局变量名，只需修改 `vite.config.ts`：

```typescript
build: {
  lib: {
    name: 'MyCustomName',  // 👈 修改这里
    // ...
  }
}
```

构建后，全局变量将变为 `window.MyCustomName`。

## 不同格式的差异

| 格式 | 全局变量 | 说明 |
|------|---------|------|
| **UMD** | `window.NHAIUIVue` | ✅ 会生成全局变量 |
| **ES Module** | 无 | ❌ 不会生成全局变量，需要 import |
| **CommonJS** | 无 | ❌ 不会生成全局变量，需要 require |

## 总结

- **定义位置**：`vite.config.ts` 中的 `name: 'NHAIUIVue'`
- **生成时机**：执行 `npm run build` 构建 UMD 格式时
- **实际位置**：构建后的 `dist/index.umd.js` 文件中
- **使用方式**：通过 `<script>` 标签引入 UMD 文件后，自动绑定到 `window.NHAIUIVue`

## 验证方式

创建一个简单的测试文件：

```html
<!DOCTYPE html>
<html>
<head>
  <title>验证全局变量</title>
</head>
<body>
  <script src="./dist/index.umd.js"></script>
  <script>
    if (window.NHAIUIVue) {
      console.log('✅ window.NHAIUIVue 已定义')
      console.log('📦 可用组件:', Object.keys(window.NHAIUIVue))
    } else {
      console.error('❌ window.NHAIUIVue 未定义')
    }
  </script>
</body>
</html>
```

