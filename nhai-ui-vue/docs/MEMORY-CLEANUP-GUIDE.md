# 性能测试内存清理指南

## 🐛 问题

HTML 测试页面每次执行测试后没有释放内存，导致：
1. 多次测试后内存持续增长
2. 测试结果不准确
3. 浏览器可能卡顿

---

## ✅ 解决方案

### 1. 自动清理内存

每次测试前自动清理：
```javascript
window.runInlineTest = async function() {
    // 先清理内存并等待完成
    await cleanup()
    
    // 然后执行测试
    const { fragment, time } = createButtonsInline()
    // ...
}
```

### 2. cleanup 函数的功能

```javascript
function cleanup() {
    // 1. 清理所有 Vue 应用实例
    vueAppInstances.forEach(app => {
        if (app && typeof app.unmount === 'function') {
            app.unmount()
        }
    })
    vueAppInstances.length = 0
    
    // 2. 清理所有 DOM
    document.getElementById('buttonsContainer').innerHTML = ''
    
    // 3. 等待垃圾回收
    return new Promise(resolve => {
        setTimeout(() => {
            if (window.gc) {
                window.gc()  // 强制垃圾回收
            }
            resolve()
        }, 100)
    })
}
```

### 3. 手动清理

如果需要手动清理内存：
```javascript
// 在浏览器控制台执行
window.cleanupMemory()

// 或点击"清除结果"按钮
```

---

## 📊 测试前后对比

### 测试前清理内存
```javascript
// 第一次测试
await cleanup()  // 清理：0MB
runInlineTest()  // 使用：10MB
// 总内存：10MB

// 第二次测试
await cleanup()  // 清理：释放之前的内存
runInlineTest()  // 使用：10MB（重新开始）
// 总内存：10MB（不是 20MB！）
```

### 不清理的后果
```javascript
// 第一次测试
runInlineTest()  // 内存：10MB

// 第二次测试
runInlineTest()  // 内存：20MB（累积！）

// 第三次测试
runInlineTest()  // 内存：30MB（继续累积！）

// ... 最终浏览器崩溃
```

---

## 🔧 如何启用垃圾回收（开发时）

### Chrome
1. 启动 Chrome 时添加参数：
   ```bash
   chrome.exe --js-flags="--expose-gc"
   ```
2. 或直接在控制台调用：
   ```javascript
   window.gc()
   ```

### 测试环境
在 `performance-comparison.html` 中已包含：
```javascript
if (window.gc) {
    window.gc()  // 强制垃圾回收
}
```

---

## 💡 最佳实践

### 1. 每次测试前清理
```javascript
window.runTest = async function() {
    await cleanup()  // ✅ 先清理
    runTest()         // ✅ 再测试
}
```

### 2. 测试完成后清理
```javascript
window.runTest = function() {
    runTest()
    
    // 清理
    setTimeout(() => {
        cleanup()
    }, 5000)
}
```

### 3. 手动触发清理
```javascript
// 在任何时候清理
window.cleanupMemory()
```

---

## 📈 测试准确性提升

### 清理前后对比

| 测试次数 | 不清理 | 清理后 | 说明 |
|---------|--------|--------|------|
| 第 1 次 | 10MB | 10MB | 相同 |
| 第 2 次 | 20MB | 10MB | ✅ 清理后准确 |
| 第 3 次 | 30MB | 10MB | ✅ 清理后准确 |
| 第 10 次 | 100MB | 10MB | ⚠️ 不清理会崩溃 |

---

## 🎯 总结

### 问题根源
- HTML 测试每次创建大量 Vue 应用实例
- 没有及时清理和卸载
- 内存持续累积

### 解决方案
- ✅ 每次测试前自动清理
- ✅ 卸载所有 Vue 应用实例
- ✅ 清空 DOM
- ✅ 触发垃圾回收

### 使用效果
- ✅ 每次测试结果准确
- ✅ 不会内存泄漏
- ✅ 可以多次测试
- ✅ 浏览器不会卡顿

