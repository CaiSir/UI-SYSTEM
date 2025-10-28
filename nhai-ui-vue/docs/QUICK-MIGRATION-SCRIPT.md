# 快速迁移脚本

这是一个脚本来帮助快速完成剩余组件的迁移。

## 迁移模板

对每个待迁移的组件文件执行以下步骤：

### 1. 导入 BaseCommand
```typescript
import { BaseCommand } from '../../lib/BaseCommand'
```

### 2. 继承 BaseCommand
```typescript
export class VueXXXCommand extends BaseCommand {
  // 移除 _appInstance，因为已经在 BaseCommand 中
  // 其他属性保持不变
}
```

### 3. 调用 super()
```typescript
constructor(...args) {
  super()
  // 原有初始化代码
}
```

### 4. 在 render() 中设置生命周期
```typescript
render(): HTMLElement {
  const container = document.createElement('div')
  // ... 原有代码
  
  this._element = container
  this._mounted = true
  
  return container
}
```

### 5. 实现 unmount()
```typescript
override unmount(): void {
  super.unmount()
}
```

### 6. 删除旧的 unmount() 方法（如果在类外）

## 自动化脚本

使用以下命令批量替换（谨慎使用，请先备份）：

```bash
# 在 nhai-ui-vue/src/components 目录下执行

# 为所有 Command 类添加继承
find . -name "*Command.ts" -exec sed -i 's/export class Vue\(.*\)Command {/import { BaseCommand } from "..\/..\/lib\/BaseCommand"\n\nexport class Vue\1Command extends BaseCommand {/g' {} \;

# 为所有构造函数添加 super() 调用
find . -name "*Command.ts" -exec sed -i 's/constructor(/super()\n    constructor(/g' {} \;
```

## 手动迁移清单

- [ ] Card/cardCommand.ts
- [ ] Container/containerCommand.ts
- [ ] Grid/gridCommand.ts
- [ ] SplitPanel/splitPanelCommand.ts
- [ ] Breadcrumb/breadcrumbCommand.ts
- [ ] Tabs/tabsCommand.ts
- [ ] MenuBar/menuBarCommand.ts

每个文件需要执行上述 6 个步骤。

