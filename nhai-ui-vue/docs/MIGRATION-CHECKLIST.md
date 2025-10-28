# 组件迁移检查清单

## ✅ 已完成
- [x] BaseCommand 基类增强（属性、事件、父子关系）
- [x] ComponentRegistry 组件注册系统
- [x] UIHelpers 工具函数库
- [x] VueLayoutBuilderCommand 继承 BaseCommand
- [x] VueButtonCommand 继承 BaseCommand
- [x] VueInputCommand 继承 BaseCommand

## 🔄 进行中
- [ ] 更新剩余组件的 render 方法，设置 _element 和 _mounted
- [ ] 统一所有组件的 unmount 方法

## ⏳ 待迁移组件

### 基础控件
- [ ] VueSelectCommand
- [ ] VueSwitchCommand  
- [ ] VueCheckboxCommand

### 容器组件
- [ ] VueCardCommand
- [ ] VueContainerCommand

### 导航组件
- [ ] VueBreadcrumbCommand
- [ ] VueTabsCommand
- [ ] VueMenuBarCommand

### 布局组件
- [ ] VueGridCommand
- [ ] VueSplitPanelCommand

## 📋 迁移步骤

对每个组件执行以下操作：

### 1. 继承 BaseCommand
```typescript
import { BaseCommand } from '../../lib/BaseCommand'

export class VueXXXCommand extends BaseCommand {
  // ...
}
```

### 2. 调用 super() 在构造函数中
```typescript
constructor() {
  super()
  // ...
}
```

### 3. 实现 unmount()
```typescript
override unmount(): void {
  super.unmount()
  // 组件的特殊清理逻辑
}
```

### 4. 在 render() 中设置状态
```typescript
render(): HTMLElement {
  // ...
  this._element = container
  this._mounted = true
  return container
}
```

### 5. 移除旧的 unmount()（如果在类外）
```typescript
// 删除类外的 unmount() 方法
```

## 🎯 优先级

**P0（立即完成）**
1. ✅ Button
2. ✅ Input  
3. [ ] Select
4. [ ] Switch
5. [ ] Checkbox

**P1（本周完成）**
6. [ ] Card
7. [ ] Breadcrumb
8. [ ] Tabs
9. [ ] MenuBar

**P2（下周完成）**
10. [ ] Container
11. [ ] Grid
12. [ ] SplitPanel

## 📝 注意事项

1. 保持现有 API 不变，只是继承 BaseCommand
2. 确保 render() 方法正确设置 _element 和 _mounted
3. 子组件可以使用 addChild/removeChild 管理
4. 可以使用 on/emit 进行事件通信
5. 可以使用 setProperty/getProperty 管理属性

