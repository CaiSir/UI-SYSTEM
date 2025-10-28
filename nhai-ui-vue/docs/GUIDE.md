# NHAI UI Vue - 完整使用指南

## 🚀 快速开始

### 安装
```bash
npm install element-plus vue@^3
```

### 导入使用
```typescript
// 声明式使用
import { VueButton, VueInput } from 'nhai-ui-vue'

// 命令式使用
import { VueButtonCommand, VueInputCommand } from 'nhai-ui-vue'
```

## 📦 可用组件

### 基础组件
- `VueButton` / `VueButtonCommand`
- `VueInput` / `VueInputCommand`
- `VueSelect` / `VueSelectCommand`
- `VueSwitch` / `VueSwitchCommand`
- `VueCheckbox` / `VueCheckboxCommand`
- `VueCard` / `VueCardCommand`

### 布局组件
- `VueContainer` / `VueContainerCommand`
- `VueGrid` / `VueGridCommand`
- `VueSplitPanel` / `VueSplitPanelCommand`
- `VueLayoutBuilder` / `VueLayoutBuilderCommand`
- `VueAbsolutePanel` / `AbsolutePanelCommand`

### 导航组件
- `VueBreadcrumb` / `VueBreadcrumbCommand`
- `VueTabs` / `VueTabsCommand`
- `VueMenuBar` / `VueMenuBarCommand`

## 💡 使用示例

### 声明式使用（推荐）
```vue
<template>
  <VueButton text="提交" type="primary" @click="handleClick" />
  <VueInput v-model="value" placeholder="输入内容" />
  <VueLayoutBuilder layout-type="vbox" :gap="2">
    <VueButton text="按钮1" />
    <VueButton text="按钮2" />
  </VueLayoutBuilder>
</template>
```

### 命令式使用
```typescript
import { VueButtonCommand } from 'nhai-ui-vue'

const button = new VueButtonCommand('提交')
button.setType('primary')
button.setOnClick(() => console.log('clicked'))

element.appendChild(button.render())
```

## 🎨 布局系统

### Flex 布局
```typescript
import { VueLayoutBuilderCommand } from 'nhai-ui-vue'

// 垂直布局
const vbox = new VueLayoutBuilderCommand('vbox')
vbox.setSpacing(2)
vbox.addWidget('btn1', btn1)

// 水平布局
const hbox = new VueLayoutBuilderCommand('hbox')
hbox.setDirection('row')
hbox.setGap('12px')
hbox.addWidget('btn2', btn2)
```

### 绝对定位布局
```typescript
import { AbsolutePanelCommand } from 'nhai-ui-vue'

const panel = new AbsolutePanelCommand('100%', '500px')
panel.addWidgetAt('btn1', btn1, { x: 100, y: 200 })
panel.setPosition('btn1', 150, 250)
```

## 🔗 相关资源

- [GitHub](https://github.com/nhai-ui-vue)
- [文档中心](./)
- [示例代码](../examples/)

