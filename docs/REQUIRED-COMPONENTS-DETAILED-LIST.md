# 设计工具/建模编辑器必需组件详细清单

## 📊 组件分类和优先级

### 🔥🔥🔥🔥🔥 **最高优先级 - 基础输入组件**

#### 1. **数值输入组件**
```typescript
// 必需功能
interface NumberInput {
  // 基础属性
  value: number
  min: number
  max: number
  step: number
  precision: number
  
  // 显示属性
  unit: string                    // 单位显示 (px, %, deg, etc.)
  placeholder: string
  
  // 交互属性
  disabled: boolean
  readonly: boolean
  
  // 增强功能
  slider: boolean                 // 是否显示滑块
  spinButtons: boolean           // 是否显示增减按钮
  keyboardStep: boolean          // 键盘上下键步进
  
  // 事件
  onChange: (value: number) => void
  onFocus: () => void
  onBlur: () => void
  onKeyDown: (event: KeyboardEvent) => void
}

// 使用场景
- 尺寸设置 (宽度、高度、厚度)
- 角度设置 (旋转角度)
- 数值参数 (透明度、缩放比例)
- 坐标设置 (X、Y、Z 坐标)
```

#### 2. **颜色选择器**
```typescript
interface ColorPicker {
  // 基础属性
  value: string                  // 颜色值 (hex, rgb, hsl)
  format: 'hex' | 'rgb' | 'hsl' | 'hsla'
  
  // 功能属性
  alpha: boolean                 // 是否支持透明度
  presets: string[]             // 预设颜色
  customColors: string[]        // 自定义颜色历史
  
  // 显示属性
  showInput: boolean            // 是否显示输入框
  showPresets: boolean          // 是否显示预设
  showAlpha: boolean            // 是否显示透明度滑块
  
  // 事件
  onChange: (color: string) => void
  onPresetClick: (color: string) => void
}

// 使用场景
- 材质颜色设置
- 背景颜色选择
- 边框颜色设置
- 文字颜色设置
```

#### 3. **滑块组件**
```typescript
interface Slider {
  // 基础属性
  value: number | [number, number]  // 单值或范围值
  min: number
  max: number
  step: number
  
  // 显示属性
  range: boolean                 // 是否范围选择
  vertical: boolean              // 是否垂直显示
  marks: Record<number, string>  // 标记点
  dots: boolean                  // 是否显示步进点
  
  // 交互属性
  disabled: boolean
  tooltip: boolean               // 是否显示提示
  
  // 事件
  onChange: (value: number | [number, number]) => void
  onAfterChange: (value: number | [number, number]) => void
}

// 使用场景
- 透明度调节
- 缩放比例设置
- 音量/亮度调节
- 时间轴拖拽
```

### 🔥🔥🔥🔥 **高优先级 - 选择和组织组件**

#### 4. **下拉选择器**
```typescript
interface Select {
  // 基础属性
  value: string | string[]       // 单选或多选
  options: Option[]              // 选项列表
  placeholder: string
  
  // 功能属性
  multiple: boolean              // 多选模式
  searchable: boolean            // 可搜索
  creatable: boolean             // 可创建新选项
  clearable: boolean             // 可清空
  
  // 显示属性
  groupable: boolean             // 可分组
  maxTagCount: number            // 多选时最大显示标签数
  loading: boolean               // 加载状态
  
  // 事件
  onChange: (value: string | string[]) => void
  onSearch: (query: string) => void
  onCreate: (value: string) => void
}

interface Option {
  value: string
  label: string
  disabled: boolean
  group?: string
  icon?: string
}

// 使用场景
- 材质类型选择
- 工具选择
- 图层类型选择
- 预设方案选择
```

#### 5. **标签页组件**
```typescript
interface Tabs {
  // 基础属性
  activeKey: string              // 当前激活的标签
  tabs: Tab[]                    // 标签列表
  
  // 功能属性
  closable: boolean              // 可关闭
  draggable: boolean             // 可拖拽排序
  addable: boolean               // 可添加新标签
  
  // 显示属性
  position: 'top' | 'bottom' | 'left' | 'right'
  size: 'small' | 'middle' | 'large'
  type: 'line' | 'card' | 'editable-card'
  
  // 事件
  onChange: (activeKey: string) => void
  onEdit: (targetKey: string, action: 'add' | 'remove') => void
}

interface Tab {
  key: string
  title: string
  content: any
  closable: boolean
  disabled: boolean
}

// 使用场景
- 工具面板切换
- 属性面板分组
- 视图模式切换
- 文件标签管理
```

#### 6. **折叠面板**
```typescript
interface Collapse {
  // 基础属性
  activeKeys: string[]           // 展开的面板
  panels: CollapsePanel[]        // 面板列表
  
  // 功能属性
  accordion: boolean             // 手风琴模式
  ghost: boolean                 // 幽灵模式
  expandIconPosition: 'left' | 'right'
  
  // 事件
  onChange: (activeKeys: string[]) => void
}

interface CollapsePanel {
  key: string
  header: string
  content: any
  disabled: boolean
  showArrow: boolean
}

// 使用场景
- 属性面板分组
- 工具面板折叠
- 设置面板组织
- 帮助文档折叠
```

### 🔥🔥🔥 **中优先级 - 专业面板组件**

#### 7. **属性面板**
```typescript
interface PropertiesPanel {
  // 基础属性
  groups: PropertyGroup[]        // 属性组
  selectedObject: any            // 当前选中对象
  
  // 功能属性
  searchable: boolean            // 可搜索
  collapsible: boolean           // 可折叠
  sortable: boolean              // 可排序
  editable: boolean              // 可编辑
  
  // 显示属性
  layout: 'vertical' | 'horizontal'
  size: 'small' | 'middle' | 'large'
  
  // 事件
  onPropertyChange: (property: Property, value: any) => void
  onGroupToggle: (groupId: string, collapsed: boolean) => void
}

interface PropertyGroup {
  id: string
  title: string
  properties: Property[]
  collapsed: boolean
  order: number
}

interface Property {
  id: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'file'
  value: any
  options?: any[]
  min?: number
  max?: number
  step?: number
  unit?: string
  disabled: boolean
  onChange: (value: any) => void
}

// 使用场景
- 对象属性编辑
- 材质属性设置
- 动画参数调节
- 工具参数配置
```

#### 8. **工具栏**
```typescript
interface Toolbar {
  // 基础属性
  groups: ToolGroup[]           // 工具组
  activeTool: string             // 当前激活工具
  
  // 功能属性
  orientation: 'horizontal' | 'vertical'
  collapsible: boolean           // 可折叠
  customizable: boolean          // 可自定义
  draggable: boolean             // 可拖拽
  
  // 显示属性
  size: 'small' | 'middle' | 'large'
  showLabels: boolean            // 显示标签
  showTooltips: boolean          // 显示提示
  
  // 事件
  onToolSelect: (toolId: string) => void
  onToolbarCustomize: () => void
}

interface ToolGroup {
  id: string
  title: string
  tools: Tool[]
  collapsed: boolean
  order: number
}

interface Tool {
  id: string
  title: string
  icon: string
  shortcut: string
  disabled: boolean
  active: boolean
  onClick: () => void
}

// 使用场景
- 绘图工具选择
- 编辑工具切换
- 视图工具操作
- 文件操作工具
```

#### 9. **图层面板**
```typescript
interface LayerPanel {
  // 基础属性
  layers: Layer[]                // 图层列表
  selectedLayers: string[]       // 选中的图层
  
  // 功能属性
  draggable: boolean             // 可拖拽排序
  groupable: boolean             // 可分组
  lockable: boolean              // 可锁定
  visible: boolean               // 可见性控制
  
  // 显示属性
  showThumbnails: boolean        // 显示缩略图
  showOpacity: boolean           // 显示透明度
  showBlendMode: boolean         // 显示混合模式
  
  // 事件
  onLayerSelect: (layerIds: string[]) => void
  onLayerReorder: (layerIds: string[]) => void
  onLayerVisibilityChange: (layerId: string, visible: boolean) => void
  onLayerOpacityChange: (layerId: string, opacity: number) => void
}

interface Layer {
  id: string
  name: string
  type: 'image' | 'vector' | 'text' | 'group'
  visible: boolean
  locked: boolean
  opacity: number
  blendMode: string
  thumbnail: string
  children?: Layer[]
}

// 使用场景
- 图层管理
- 图层排序
- 图层可见性控制
- 图层分组管理
```

### 🔥🔥 **中低优先级 - 高级交互组件**

#### 10. **分割面板**
```typescript
interface SplitPanel {
  // 基础属性
  orientation: 'horizontal' | 'vertical'
  sizes: number[]                // 面板大小比例
  minSize: number                // 最小尺寸
  maxSize: number                // 最大尺寸
  
  // 功能属性
  resizable: boolean             // 可调整大小
  collapsible: boolean           // 可折叠
  draggable: boolean             // 可拖拽
  
  // 显示属性
  showHandle: boolean            // 显示拖拽手柄
  handleSize: number             // 手柄大小
  
  // 事件
  onResize: (sizes: number[]) => void
  onCollapse: (panelIndex: number, collapsed: boolean) => void
}

// 使用场景
- 面板分割
- 视图分割
- 工具面板布局
- 属性面板分割
```

#### 11. **拖拽列表**
```typescript
interface DragList {
  // 基础属性
  items: DragItem[]              // 列表项
  selectedItems: string[]        // 选中的项
  
  // 功能属性
  draggable: boolean             // 可拖拽
  sortable: boolean              // 可排序
  groupable: boolean             // 可分组
  droppable: boolean             // 可放置
  
  // 显示属性
  showHandle: boolean            // 显示拖拽手柄
  showCheckbox: boolean          // 显示复选框
  
  // 事件
  onItemSelect: (itemIds: string[]) => void
  onItemReorder: (itemIds: string[]) => void
  onItemDrop: (itemId: string, targetId: string) => void
}

interface DragItem {
  id: string
  title: string
  icon: string
  disabled: boolean
  draggable: boolean
}

// 使用场景
- 图层拖拽排序
- 工具拖拽排序
- 文件拖拽管理
- 组件拖拽排序
```

#### 12. **进度条**
```typescript
interface Progress {
  // 基础属性
  percent: number                // 进度百分比
  status: 'normal' | 'success' | 'exception' | 'active'
  
  // 显示属性
  showInfo: boolean              // 显示百分比
  strokeWidth: number            // 进度条粗细
  strokeColor: string            // 进度条颜色
  
  // 功能属性
  animated: boolean              // 动画效果
  striped: boolean               // 条纹效果
  
  // 事件
  onComplete: () => void
}

// 使用场景
- 文件上传进度
- 渲染进度显示
- 导出进度显示
- 加载进度显示
```

### 🔥 **低优先级 - 高级专业组件**

#### 13. **向量输入器**
```typescript
interface VectorInput {
  // 基础属性
  value: Vector2 | Vector3 | Vector4
  dimensions: 2 | 3 | 4          // 向量维度
  
  // 功能属性
  linked: boolean                // 是否联动
  snap: number                   // 吸附值
  precision: number              // 精度
  
  // 显示属性
  labels: string[]               // 轴标签
  showLabels: boolean            // 显示标签
  
  // 事件
  onChange: (value: Vector2 | Vector3 | Vector4) => void
  onAxisChange: (axis: string, value: number) => void
}

// 使用场景
- 3D 坐标设置
- 变换矩阵设置
- 颜色 RGBA 设置
- 缩放比例设置
```

#### 14. **角度选择器**
```typescript
interface AnglePicker {
  // 基础属性
  value: number                  // 角度值
  unit: 'degrees' | 'radians'   // 单位
  
  // 功能属性
  snap: number                   // 吸附角度
  showCircle: boolean           // 显示圆形
  showGrid: boolean             // 显示网格
  
  // 显示属性
  size: number                   // 选择器大小
  showInput: boolean             // 显示输入框
  
  // 事件
  onChange: (angle: number) => void
  onSnap: (angle: number) => void
}

// 使用场景
- 旋转角度设置
- 方向角度设置
- 倾斜角度设置
- 视角角度设置
```

#### 15. **时间轴**
```typescript
interface Timeline {
  // 基础属性
  frames: number                 // 总帧数
  currentFrame: number           // 当前帧
  fps: number                    // 帧率
  
  // 功能属性
  keyframes: Keyframe[]          // 关键帧
  playback: boolean              // 播放状态
  scrubbing: boolean             // 拖拽状态
  
  // 显示属性
  showTime: boolean              // 显示时间
  showFrames: boolean            // 显示帧数
  showKeyframes: boolean         // 显示关键帧
  
  // 事件
  onFrameChange: (frame: number) => void
  onPlaybackChange: (playing: boolean) => void
  onKeyframeAdd: (frame: number) => void
  onKeyframeRemove: (frame: number) => void
}

interface Keyframe {
  frame: number
  value: any
  type: 'linear' | 'bezier' | 'step'
}

// 使用场景
- 动画时间轴
- 视频时间轴
- 音频时间轴
- 关键帧编辑
```

## 📋 实施优先级排序

### **Phase 1: 核心基础组件 (2-3周)**
1. NumberInput - 数值输入
2. ColorPicker - 颜色选择
3. Slider - 滑块
4. Select - 下拉选择
5. Tabs - 标签页

### **Phase 2: 专业面板组件 (4-6周)**
6. PropertiesPanel - 属性面板
7. Toolbar - 工具栏
8. LayerPanel - 图层面板
9. Collapse - 折叠面板
10. Progress - 进度条

### **Phase 3: 高级交互组件 (3-4周)**
11. SplitPanel - 分割面板
12. DragList - 拖拽列表
13. VectorInput - 向量输入
14. AnglePicker - 角度选择
15. Timeline - 时间轴

## 🎯 总结

**必需组件总数**: 15个核心组件
**开发周期**: 9-13周
**技术难度**: 中等到高
**优先级**: 按使用频率和重要性排序

这些组件能够支撑完整的设计工具和建模编辑器功能，建议按照优先级分阶段实施。
