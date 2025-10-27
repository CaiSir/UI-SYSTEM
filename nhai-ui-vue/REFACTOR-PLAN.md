# nhai-ui-vue 重构计划

## 📋 已完成

- [x] 创建 `BaseCommand` 基类
- [x] 创建 `lib/` 目录并移动工具函数
- [x] `VueLayoutBuilderCommand` 继承 `BaseCommand`
- [x] 调整导出结构

## 🔄 进行中

### 步骤1：更新所有 Command 类继承 BaseCommand

需要更新的文件：
- [ ] `src/components/Button/buttonCommand.ts`
- [ ] `src/components/Input/inputCommand.ts`
- [ ] `src/components/Select/selectCommand.ts`
- [ ] `src/components/Switch/switchCommand.ts`
- [ ] `src/components/Checkbox/checkboxCommand.ts`
- [ ] `src/components/Card/cardCommand.ts`
- [ ] `src/components/Breadcrumb/breadcrumbCommand.ts`
- [ ] `src/components/Tabs/tabsCommand.ts`
- [ ] `src/components/MenuBar/menuBarCommand.ts`
- [ ] `src/components/Container/containerCommand.ts`
- [ ] `src/components/Grid/gridCommand.ts`
- [ ] `src/components/SplitPanel/splitPanelCommand.ts`

每个文件需要：
1. 导入 `BaseCommand`
2. 让类继承 `BaseCommand`
3. 在 `render()` 中设置 `this._element` 和 `this._mounted`
4. 如果使用了 Vue app 实例，需要实现 `unmount()` 方法

### 步骤2：修复构建配置

更新 `vite.config.ts`：
```typescript
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NHAIUIVue',
      formats: ['es'],
      fileName: 'index'
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    }
  }
})
```

### 步骤3：更新 package.json

```json
{
  "name": "@nhai/ui-vue",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "vue": "^3.0.0",
    "element-plus": "^2.0.0"
  }
}
```

### 步骤4：分离组件和命令

调整目录结构：
```
src/
  ├── commands/          # 命令式 API（新目录）
  │   ├── Button.ts
  │   ├── Input.ts
  │   └── ...
  ├── components/        # Vue SFC
  │   ├── Button.vue
  │   ├── Input.vue
  │   └── ...
  ├── lib/              # 公共库
  │   ├── BaseCommand.ts
  │   └── UIHelpers.ts
  └── index.ts          # 主入口
```

### 步骤5：更新文档

- 更新 README.md
- 更新所有使用示例
- 添加架构说明文档

## ⏳ 未开始

### 与 nhai-framework 的关系

需要明确：
1. `nhai-ui-vue` 是独立库还是集成到 `nhai-framework`？
2. 两者的使用场景有什么区别？
3. 是否需要统一的导出接口？

### 集成方案

选项 A：保持独立，与 nhai-framework 并列
- `nhai-framework` 使用 Svelte
- `nhai-ui-vue` 使用 Vue
- 各自独立维护

选项 B：集成到 nhai-framework
- 作为 `nhai-framework/vue` 的子包
- 共享核心基础设施

选项 C：分层架构
- `nhai-ui-core` - 核心 API
- `nhai-ui-vue` - Vue 包装
- `nhai-ui-framework` - 完整框架

## 🎯 短期目标

1. 完成所有 Command 类的继承更新
2. 修复构建配置
3. 测试基本功能
4. 更新文档

## 🎯 长期目标

1. 明确与 nhai-framework 的关系
2. 统一 API 设计
3. 优化性能
4. 完善类型定义
5. 添加单元测试

