<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <h1>NHAI</h1>
          <span class="tagline">框架无关UI组件系统</span>
        </div>
      </div>
      
      <div class="header-center">
        <div class="mode-tabs">
          <button 
            v-for="mode in modes" 
            :key="mode.value"
            class="mode-tab"
            :class="{ active: currentMode === mode.value }"
            @click="switchMode(mode.value)"
          >
            <i :class="mode.icon"></i>
            {{ mode.label }}
          </button>
        </div>
      </div>
      
      <div class="header-right">
        <div class="framework-selector">
          <select v-model="currentFramework" @change="switchFramework(currentFramework)">
            <option v-for="framework in frameworks" :key="framework.name" :value="framework.name">
              {{ framework.label }}
            </option>
          </select>
        </div>
        <div class="status-indicator" :class="{ active: adapterRegistered }">
          <i class="status-icon"></i>
          {{ adapterRegistered ? '已连接' : '未连接' }}
        </div>
      </div>
    </header>
    
    <div class="main-layout">
      <!-- 左侧面板 -->
      <aside class="left-panel" :class="{ collapsed: leftPanelCollapsed }">
        <div class="panel-header">
          <h3>组件库</h3>
          <button class="collapse-btn" @click="leftPanelCollapsed = !leftPanelCollapsed">
            <i :class="leftPanelCollapsed ? 'icon-expand' : 'icon-collapse'"></i>
          </button>
        </div>
        
        <div class="panel-content" v-show="!leftPanelCollapsed">
          <!-- 示例浏览模式的组件树 -->
          <div v-if="currentMode === 'examples'" class="component-tree">
            <div 
              v-for="category in treeData" 
              :key="category.name"
              class="tree-category"
            >
              <div 
                class="category-header"
                @click="toggleCategory(category)"
              >
                <i class="expand-icon" :class="{ expanded: category.expanded }"></i>
                <span class="category-name">{{ category.name }}</span>
              </div>
              
              <div v-if="category.expanded" class="category-items">
                <div 
                  v-for="componentType in category.children" 
                  :key="componentType.name"
                  class="component-type"
                >
                  <div 
                    class="component-type-header"
                    @click="toggleComponentType(componentType)"
                  >
                    <i class="expand-icon" :class="{ expanded: componentType.expanded }"></i>
                    <span class="component-type-name">{{ componentType.name }}</span>
                    <span class="component-count">{{ componentType.children.length }}</span>
                  </div>
                  
                  <div v-if="componentType.expanded" class="component-examples">
                    <div 
                      v-for="subType in componentType.children" 
                      :key="subType.id"
                      class="tree-item"
                      :class="{ active: currentExampleId === subType.id }"
                      @click="selectExample(subType)"
                    >
                      <span class="item-title">{{ subType.title }}</span>
                      <span class="item-description">{{ subType.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 可视化设计模式的组件调色板 -->
          <div v-else-if="currentMode === 'freedesign'" class="component-palette">
            <!-- 添加组件按钮 -->
            <div class="palette-header">
              <h4>组件库</h4>
              <button @click="openAddComponentDialog" class="btn-add-component" title="添加新组件">
                <i class="icon-add"></i> 添加组件
              </button>
            </div>
            
            <div 
              v-for="category in componentLibrary" 
              :key="category.category"
              class="palette-section"
            >
              <h4>{{ category.category }}</h4>
              <div class="palette-items">
                <div 
                  v-for="component in category.components"
                  :key="component.id"
                  class="palette-item"
                  draggable="true"
                  :data-component-id="component.id"
                  :data-factory="component.factory"
                  :data-props="JSON.stringify(component.defaultProps)"
                  @dragstart="onDragStart($event, component)"
                  @dragend="onDragEnd"
                >
                  <i :class="component.icon"></i>
                  <span>{{ component.name }}</span>
                  <div class="component-description">{{ component.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主工作区 -->
      <main class="main-workspace">
        <!-- 示例浏览模式 -->
        <div v-if="currentMode === 'examples'" class="workspace-content">
          <div v-if="currentExampleData" class="example-view">
            <!-- 示例标题栏 -->
            <div class="example-toolbar">
              <div class="example-info">
                <h2>{{ currentExampleData.title }}</h2>
                <p>{{ currentExampleData.description }}</p>
              </div>
              <div class="example-actions">
                <button @click="copyCode" class="action-btn">
                  <i class="icon-copy"></i>
                  复制代码
                </button>
                <button @click="loadToEditor" class="action-btn primary">
                  <i class="icon-edit"></i>
                  在线编辑
                </button>
              </div>
            </div>

            <!-- 示例演示区域 -->
            <div class="demo-section">
              <div class="demo-header">
                <h3>演示效果</h3>
                <div class="framework-badge">{{ currentFrameworkLabel }}</div>
              </div>
              <div ref="demoArea" class="demo-area"></div>
            </div>

            <!-- 代码示例 -->
            <div class="code-section">
              <div class="code-header">
                <h3>代码示例</h3>
              </div>
              <div class="code-content">
                <pre><code>{{ currentExampleData.code }}</code></pre>
              </div>
            </div>
          </div>
          
          <div v-else class="welcome-view">
            <div class="welcome-content">
              <!-- Hero Section -->
              <div class="welcome-hero">
                <div class="hero-badge">
                  <span class="badge-icon">✨</span>
                  <span>Next Generation UI Framework</span>
                </div>
                <h1 class="hero-title">
                  <span class="gradient-text">NHAI</span>
                  <span class="hero-subtitle">组件系统</span>
                </h1>
                <p class="hero-description">
                  跨框架统一的UI组件库，支持Vue、React、Svelte和原生JavaScript
                </p>
                <div class="hero-actions">
                  <button class="btn-primary" @click="switchMode('examples')">
                    <i class="icon-play"></i>
                    开始探索
                  </button>
                  <button class="btn-secondary" @click="switchMode('freedesign')">
                    <i class="icon-design"></i>
                    可视化设计
                  </button>
                </div>
              </div>

              <!-- Features Section -->
              <div class="features-section">
                <h3 class="section-title">核心特性</h3>
                <div class="feature-grid">
                  <div class="feature-card" @click="switchMode('examples')">
                    <div class="feature-icon-wrapper">
                      <div class="feature-icon">🎯</div>
                      <div class="feature-glow"></div>
                    </div>
                    <h4>框架无关</h4>
                    <p>一套API，多端运行</p>
                    <div class="feature-tags">
                      <span class="tag">Vue</span>
                      <span class="tag">React</span>
                      <span class="tag">Svelte</span>
                    </div>
                  </div>
                  
                  <div class="feature-card" @click="switchMode('editor')">
                    <div class="feature-icon-wrapper">
                      <div class="feature-icon">💻</div>
                      <div class="feature-glow"></div>
                    </div>
                    <h4>在线编辑</h4>
                    <p>实时编码，即时预览</p>
                    <div class="feature-tags">
                      <span class="tag">TypeScript</span>
                      <span class="tag">Hot Reload</span>
                    </div>
                  </div>
                  
                  <div class="feature-card" @click="switchMode('freedesign')">
                    <div class="feature-icon-wrapper">
                      <div class="feature-icon">🎨</div>
                      <div class="feature-glow"></div>
                    </div>
                    <h4>可视化设计</h4>
                    <p>拖拽式设计，专业工具</p>
                    <div class="feature-tags">
                      <span class="tag">Drag & Drop</span>
                      <span class="tag">Property Panel</span>
                    </div>
                  </div>
                  
                  <div class="feature-card">
                    <div class="feature-icon-wrapper">
                      <div class="feature-icon">⚡</div>
                      <div class="feature-glow"></div>
                    </div>
                    <h4>高性能</h4>
                    <p>轻量级，快速渲染</p>
                    <div class="feature-tags">
                      <span class="tag">Tree Shaking</span>
                      <span class="tag">Optimized</span>
                    </div>
                  </div>
                  
                  <div class="feature-card">
                    <div class="feature-icon-wrapper">
                      <div class="feature-icon">🔧</div>
                      <div class="feature-glow"></div>
                    </div>
                    <h4>类型安全</h4>
                    <p>完整的TypeScript支持</p>
                    <div class="feature-tags">
                      <span class="tag">TypeScript</span>
                      <span class="tag">IntelliSense</span>
                    </div>
                  </div>
                  
                  <div class="feature-card">
                    <div class="feature-icon-wrapper">
                      <div class="feature-icon">📚</div>
                      <div class="feature-glow"></div>
                    </div>
                    <h4>丰富示例</h4>
                    <p>涵盖各种使用场景</p>
                    <div class="feature-tags">
                      <span class="tag">Examples</span>
                      <span class="tag">Documentation</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Start Section -->
              <div class="quick-start-section">
                <h3 class="section-title">快速开始</h3>
                <div class="quick-start-grid">
                  <div class="quick-start-card">
                    <div class="step-number">1</div>
                    <h4>选择框架</h4>
                    <p>从顶部选择您使用的框架</p>
                  </div>
                  <div class="quick-start-card">
                    <div class="step-number">2</div>
                    <h4>浏览组件</h4>
                    <p>从左侧面板选择组件示例</p>
                  </div>
                  <div class="quick-start-card">
                    <div class="step-number">3</div>
                    <h4>开始使用</h4>
                    <p>复制代码或在线编辑</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 在线编辑模式 -->
        <div v-else-if="currentMode === 'editor'" class="workspace-content">
          <OnlineEditor :initial-code="editorCode" />
        </div>

        <!-- 可视化设计模式 -->
        <div v-else-if="currentMode === 'freedesign'" class="workspace-content" :class="{ 'fullscreen-mode': isFullscreen }">
          <!-- 全屏工具栏 -->
          <div v-if="isFullscreen" class="fullscreen-toolbar">
            <div class="toolbar-left">
              <h3>可视化设计 - 全屏模式</h3>
            </div>
            <div class="toolbar-right">
              <button class="btn-icon" @click="exitFullscreen" title="退出全屏">
                <i class="icon-exit-fullscreen"></i>
              </button>
            </div>
          </div>
          
          <!-- 普通模式工具栏 -->
          <div v-else class="design-toolbar">
            <div class="toolbar-left">
              <h3>可视化设计</h3>
            </div>
            <div class="toolbar-right">
              <button class="btn-icon" @click="toggleFullscreen" title="全屏编辑">
                <i class="icon-fullscreen"></i>
              </button>
            </div>
          </div>
          
          <FreeDesign ref="freeDesignRef" />
        </div>
      </main>
      
      <!-- 右侧属性面板 -->
      <aside class="right-panel" v-if="(showRightPanel || currentMode === 'freedesign') && !isFullscreen">
        <div class="panel-header">
          <h3>属性面板</h3>
          <button v-if="currentMode !== 'freedesign'" class="close-btn" @click="showRightPanel = false">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="panel-content">
          <div class="property-section">
            <h4>组件属性</h4>
            <div class="property-form">
              <!-- 属性编辑表单 -->
              <div v-if="currentMode === 'freedesign'" class="design-properties">
                <!-- 未选择组件时的提示 -->
                <div v-if="!selectedComponentType" class="no-selection">
                  <div class="no-selection-icon">🎯</div>
                  <p>请从左侧组件库拖拽组件到画布，或点击画布中的组件来编辑属性</p>
                </div>
                
                <!-- 选中组件时的属性编辑 -->
                <div v-else>
                  <div class="selected-component-info">
                    <h5>{{ getCurrentComponentProperties()?.name || selectedComponentType }}</h5>
                    <span class="component-type">{{ selectedComponentType }}</span>
                  </div>
                  
                  <!-- 缩放控制 -->
                  <div class="property-group scale-control">
                    <label>缩放比例</label>
                    <div class="scale-controls">
                      <div class="scale-slider">
                        <input 
                          type="range" 
                          min="0.1" 
                          max="3" 
                          step="0.1" 
                          :value="selectedComponent.scale || 1"
                          @input="updateComponentScale(Number(($event.target as HTMLInputElement).value))"
                          class="scale-range"
                        >
                        <span class="scale-value">{{ ((selectedComponent.scale || 1) * 100).toFixed(0) }}%</span>
                      </div>
                      <div class="scale-presets">
                        <button @click="setScale(0.5)" class="scale-btn">50%</button>
                        <button @click="setScale(1)" class="scale-btn">100%</button>
                        <button @click="setScale(1.5)" class="scale-btn">150%</button>
                        <button @click="setScale(2)" class="scale-btn">200%</button>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    v-for="prop in getCurrentComponentProperties()?.properties" 
                    :key="prop.key"
                    class="property-group"
                  >
                    <label>{{ prop.label }}</label>
                    
                    <!-- 文本输入 -->
                    <input 
                      v-if="prop.type === 'text'" 
                      type="text" 
                      :placeholder="prop.default"
                      :value="selectedComponent[prop.key] || prop.default"
                      @input="updateComponentProperty(prop.key, ($event.target as HTMLInputElement).value)"
                    >
                    
                    <!-- 数字输入 -->
                    <input 
                      v-else-if="prop.type === 'number'" 
                      type="number" 
                      :placeholder="prop.default"
                      :value="selectedComponent[prop.key] || prop.default"
                      @input="updateComponentProperty(prop.key, Number(($event.target as HTMLInputElement).value))"
                    >
                    
                    <!-- 颜色选择 -->
                    <input 
                      v-else-if="prop.type === 'color'" 
                      type="color" 
                      :value="selectedComponent[prop.key] || prop.default"
                      @input="updateComponentProperty(prop.key, ($event.target as HTMLInputElement).value)"
                    >
                    
                    <!-- 下拉选择 -->
                    <select 
                      v-else-if="prop.type === 'select'" 
                      :value="selectedComponent[prop.key] || prop.default"
                      @change="updateComponentProperty(prop.key, ($event.target as HTMLSelectElement).value)"
                    >
                      <option 
                        v-for="option in prop.options" 
                        :key="option" 
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                    
                    <!-- 布尔值选择 -->
                    <div v-else-if="prop.type === 'boolean'" class="boolean-input">
                      <label class="switch">
                        <input 
                          type="checkbox" 
                          :checked="selectedComponent[prop.key] || prop.default"
                          @change="updateComponentProperty(prop.key, ($event.target as HTMLInputElement).checked)"
                        >
                        <span class="slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <!-- 操作按钮 -->
                  <div class="property-actions">
                    <button class="action-btn primary" @click="applyProperties">
                      应用属性
                    </button>
                    <button class="action-btn" @click="resetProperties">
                      重置
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
    
    <!-- 添加组件对话框 -->
    <Teleport to="body">
      <div v-if="showAddComponentDialog" class="dialog-overlay" @click="closeAddComponentDialog">
        <div class="dialog-content" @click.stop>
          <div class="dialog-header">
            <h3>添加新组件</h3>
            <button class="close-btn" @click="closeAddComponentDialog">
              <i class="icon-close"></i>
            </button>
          </div>
          
          <div class="dialog-body">
            <div class="form-group">
              <label>组件ID</label>
              <input 
                v-model="newComponentType" 
                type="text" 
                placeholder="例如: custom-button"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>组件名称</label>
              <input 
                v-model="newComponentName" 
                type="text" 
                placeholder="例如: 自定义按钮"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>工厂方法</label>
              <input 
                v-model="newComponentFactory" 
                type="text" 
                placeholder="例如: createCustomButton"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label>组件分类</label>
              <input 
                v-model="newComponentCategory" 
                type="text" 
                placeholder="例如: 基础控件"
                class="form-input"
              >
            </div>
          </div>
          
          <div class="dialog-footer">
            <button class="btn-cancel" @click="closeAddComponentDialog">取消</button>
            <button class="btn-primary" @click="addNewComponent">添加</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { 
  NHAIFrameworkRegistry, 
  VanillaAdapter, 
  VueAdapter, 
  ReactAdapter, 
  SvelteAdapter,
  nhaiFactory as NHAIObjectFactory,
  ModernNHAIButton,
  NHAIComponentComposer,
  MaterialButton,
  MaterialInput,
  MaterialSwitch,
  MaterialCheckbox,
  MaterialCard,
  MaterialTable,
  MaterialMenuBar,
  ButtonType,
  MenuBarLayoutType
} from 'nhai-framework'
import OnlineEditor from './components/ui/OnlineEditor.vue'
import FreeDesign from './components/ui/FreeDesign.vue'

// 响应式变量
const currentFramework = ref('vanilla')
const currentMode = ref('examples')
const demoArea = ref<HTMLElement>()
const currentExampleId = ref<string | null>(null)
const currentExampleData = ref<any>(null)
const adapterRegistered = ref(false)
const leftPanelCollapsed = ref(false)
const showRightPanel = ref(false)
const selectedComponent = ref<any>(null)
const selectedComponentType = ref<string>('')
const selectedComponentId = ref<string>('')
const freeDesignRef = ref<any>(null)
const isFullscreen = ref(false)
const showAddComponentDialog = ref(false)
const newComponentType = ref('')
const newComponentName = ref('')
const newComponentFactory = ref('')
const newComponentCategory = ref('基础控件')

// 模式配置
const modes = [
  { value: 'examples', label: '示例浏览', icon: 'icon-browse' },
  { value: 'editor', label: '在线编辑', icon: 'icon-code' },
  { value: 'freedesign', label: '可视化设计', icon: 'icon-design' }
]

// 统一的组件库数据 - 使用响应式数组支持动态添加
const componentLibrary = ref([
  {
    category: '基础控件',
    icon: 'icon-basic',
    components: [
      {
        id: 'button',
        name: '按钮',
        icon: 'icon-button',
        description: '可点击的按钮组件',
        factory: 'createButton',
        defaultProps: { text: '按钮', variant: 'primary' }
      },
      {
        id: 'text-button',
        name: '文本按钮',
        icon: 'icon-text-button',
        description: '文本样式的按钮',
        factory: 'createTextButton',
        defaultProps: { text: '文本按钮', color: '#007bff' }
      },
      {
        id: 'label',
        name: '标签',
        icon: 'icon-label',
        description: '显示文本的标签组件',
        factory: 'createLabel',
        defaultProps: { text: '标签文本' }
      },
      {
        id: 'input',
        name: '输入框',
        icon: 'icon-input',
        description: '文本输入组件',
        factory: 'createInput',
        defaultProps: { placeholder: '请输入内容' }
      },
      {
        id: 'card',
        name: '卡片',
        icon: 'icon-card',
        description: '内容容器卡片',
        factory: 'createCard',
        defaultProps: { title: '卡片标题' }
      }
    ]
  },
  {
    category: '容器组件',
    icon: 'icon-container',
    components: [
      {
        id: 'container',
        name: '容器',
        icon: 'icon-container',
        description: '基础容器组件',
        factory: 'createContainer',
        defaultProps: {}
      },
      {
        id: 'window',
        name: '窗口',
        icon: 'icon-window',
        description: '窗口容器组件',
        factory: 'createWindow',
        defaultProps: { title: '窗口标题' }
      }
    ]
  },
  {
    category: '布局组件',
    icon: 'icon-layout',
    components: [
      {
        id: 'vbox',
        name: '垂直布局',
        icon: 'icon-vbox',
        description: '垂直排列的布局容器',
        factory: 'createVBoxLayout',
        defaultProps: { spacing: 10 }
      },
      {
        id: 'hbox',
        name: '水平布局',
        icon: 'icon-hbox',
        description: '水平排列的布局容器',
        factory: 'createHBoxLayout',
        defaultProps: { spacing: 10 }
      },
      {
        id: 'grid',
        name: '网格布局',
        icon: 'icon-grid',
        description: '网格排列的布局容器',
        factory: 'createGridLayout',
        defaultProps: { columns: 2, rows: 2 }
      }
    ]
  },
  {
    category: 'Material基础组件',
    icon: 'icon-material-basic',
    components: [
      {
        id: 'material-button',
        name: 'Material按钮',
        icon: 'icon-material-button',
        description: 'Material Design风格按钮',
        factory: 'createMaterialButton',
        defaultProps: { text: '按钮', type: 'contained' }
      },
      {
        id: 'material-input',
        name: 'Material输入框',
        icon: 'icon-material-input',
        description: 'Material Design风格输入框',
        factory: 'createMaterialInput',
        defaultProps: { placeholder: '请输入内容' }
      },
      {
        id: 'material-select',
        name: 'Material选择器',
        icon: 'icon-material-select',
        description: 'Material Design风格选择器',
        factory: 'createMaterialSelect',
        defaultProps: { placeholder: '请选择' }
      },
      {
        id: 'material-checkbox',
        name: 'Material复选框',
        icon: 'icon-material-checkbox',
        description: 'Material Design风格复选框',
        factory: 'createMaterialCheckbox',
        defaultProps: { label: '复选框' }
      },
      {
        id: 'material-radio',
        name: 'Material单选框',
        icon: 'icon-material-radio',
        description: 'Material Design风格单选框',
        factory: 'createMaterialRadio',
        defaultProps: { label: '单选项' }
      },
      {
        id: 'material-switch',
        name: 'Material开关',
        icon: 'icon-material-switch',
        description: 'Material Design风格开关',
        factory: 'createMaterialSwitch',
        defaultProps: { label: '开关' }
      },
      {
        id: 'material-slider',
        name: 'Material滑块',
        icon: 'icon-material-slider',
        description: 'Material Design风格滑块',
        factory: 'createMaterialSlider',
        defaultProps: { min: 0, max: 100, value: 50 }
      },
      {
        id: 'material-rate',
        name: 'Material评分',
        icon: 'icon-material-rate',
        description: 'Material Design风格评分',
        factory: 'createMaterialRate',
        defaultProps: { count: 5, value: 0 }
      }
    ]
  },
  {
    category: 'Material数据展示',
    icon: 'icon-material-data',
    components: [
      {
        id: 'material-table',
        name: 'Material表格',
        icon: 'icon-material-table',
        description: 'Material Design风格表格',
        factory: 'createMaterialTable',
        defaultProps: {}
      },
      {
        id: 'material-list',
        name: 'Material列表',
        icon: 'icon-material-list',
        description: 'Material Design风格列表',
        factory: 'createMaterialList',
        defaultProps: {}
      },
      {
        id: 'material-card',
        name: 'Material卡片',
        icon: 'icon-material-card',
        description: 'Material Design风格卡片',
        factory: 'createMaterialCard',
        defaultProps: {}
      },
      {
        id: 'material-tag',
        name: 'Material标签',
        icon: 'icon-material-tag',
        description: 'Material Design风格标签',
        factory: 'createMaterialTag',
        defaultProps: { text: '标签' }
      },
      {
        id: 'material-badge',
        name: 'Material徽章',
        icon: 'icon-material-badge',
        description: 'Material Design风格徽章',
        factory: 'createMaterialBadge',
        defaultProps: { count: 0 }
      },
      {
        id: 'material-avatar',
        name: 'Material头像',
        icon: 'icon-material-avatar',
        description: 'Material Design风格头像',
        factory: 'createMaterialAvatar',
        defaultProps: { name: 'User' }
      }
    ]
  },
  {
    category: 'Material布局',
    icon: 'icon-material-layout',
    components: [
      {
        id: 'material-container',
        name: 'Material容器',
        icon: 'icon-material-container',
        description: 'Material Design风格容器',
        factory: 'createMaterialContainer',
        defaultProps: {}
      },
      {
        id: 'material-grid',
        name: 'Material网格',
        icon: 'icon-material-grid',
        description: 'Material Design风格网格布局',
        factory: 'createMaterialGrid',
        defaultProps: { columns: 12 }
      },
      {
        id: 'material-split-panel',
        name: 'Material分割面板',
        icon: 'icon-material-split',
        description: 'Material Design风格分割面板',
        factory: 'createMaterialSplitPanel',
        defaultProps: {}
      },
      {
        id: 'material-collapse',
        name: 'Material折叠面板',
        icon: 'icon-material-collapse',
        description: 'Material Design风格折叠面板',
        factory: 'createMaterialCollapse',
        defaultProps: {}
      }
    ]
  },
  {
    category: 'Material导航',
    icon: 'icon-material-navigation',
    components: [
      {
        id: 'material-menu-bar',
        name: 'Material菜单栏',
        icon: 'icon-material-menubar',
        description: 'Material Design风格菜单栏',
        factory: 'createMaterialMenuBar',
        defaultProps: {}
      },
      {
        id: 'material-menu',
        name: 'Material菜单',
        icon: 'icon-material-menu',
        description: 'Material Design风格菜单',
        factory: 'createMaterialMenu',
        defaultProps: {}
      },
      {
        id: 'material-tabs',
        name: 'Material标签页',
        icon: 'icon-material-tabs',
        description: 'Material Design风格标签页',
        factory: 'createMaterialTabs',
        defaultProps: {}
      },
      {
        id: 'material-breadcrumb',
        name: 'Material面包屑',
        icon: 'icon-material-breadcrumb',
        description: 'Material Design风格面包屑导航',
        factory: 'createMaterialBreadcrumb',
        defaultProps: {}
      }
    ]
  },
  {
    category: 'Material工具栏',
    icon: 'icon-material-toolbar',
    components: [
      {
        id: 'material-toolbar',
        name: 'Material工具栏',
        icon: 'icon-material-toolbar',
        description: 'Material Design风格工具栏',
        factory: 'createMaterialToolbar',
        defaultProps: {}
      }
    ]
  },
  {
    category: 'Material反馈',
    icon: 'icon-material-feedback',
    components: [
      {
        id: 'material-dialog',
        name: 'Material对话框',
        icon: 'icon-material-dialog',
        description: 'Material Design风格对话框',
        factory: 'createMaterialDialog',
        defaultProps: {}
      },
      {
        id: 'material-message',
        name: 'Material消息',
        icon: 'icon-material-message',
        description: 'Material Design风格消息提示',
        factory: 'createMaterialMessage',
        defaultProps: { message: '消息内容' }
      },
      {
        id: 'material-loading',
        name: 'Material加载',
        icon: 'icon-material-loading',
        description: 'Material Design风格加载动画',
        factory: 'createMaterialLoading',
        defaultProps: {}
      }
    ]
  },
  {
    category: 'Material工具',
    icon: 'icon-material-utility',
    components: [
      {
        id: 'material-tooltip',
        name: 'Material提示框',
        icon: 'icon-material-tooltip',
        description: 'Material Design风格提示框',
        factory: 'createMaterialTooltip',
        defaultProps: { content: '提示内容' }
      },
      {
        id: 'material-color-picker',
        name: 'Material颜色选择器',
        icon: 'icon-material-color-picker',
        description: 'Material Design风格颜色选择器',
        factory: 'createMaterialColorPicker',
        defaultProps: { color: '#1890ff' }
      }
    ]
  }
])

// 组件属性配置
const componentProperties = {
  button: {
    name: '按钮',
    properties: [
      { key: 'text', label: '文本内容', type: 'text', default: '按钮' },
      { key: 'variant', label: '按钮类型', type: 'select', options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'], default: 'primary' },
      { key: 'width', label: '宽度', type: 'number', default: 120 },
      { key: 'height', label: '高度', type: 'number', default: 40 },
      { key: 'disabled', label: '禁用状态', type: 'boolean', default: false },
      { key: 'backgroundColor', label: '背景色', type: 'color', default: '#007bff' },
      { key: 'color', label: '文字颜色', type: 'color', default: '#ffffff' },
      { key: 'borderRadius', label: '圆角', type: 'text', default: '4px' },
      { key: 'fontSize', label: '字体大小', type: 'number', default: 14 },
      { key: 'fontWeight', label: '字体粗细', type: 'select', options: ['normal', 'bold', 'lighter', 'bolder'], default: 'normal' }
    ]
  },
  'text-button': {
    name: '文本按钮',
    properties: [
      { key: 'text', label: '文本内容', type: 'text', default: '文本按钮' },
      { key: 'color', label: '文字颜色', type: 'color', default: '#007bff' },
      { key: 'size', label: '尺寸', type: 'select', options: ['small', 'medium', 'large'], default: 'medium' },
      { key: 'width', label: '宽度', type: 'number', default: 120 },
      { key: 'height', label: '高度', type: 'number', default: 40 },
      { key: 'disabled', label: '禁用状态', type: 'boolean', default: false },
      { key: 'underline', label: '下划线', type: 'boolean', default: false }
    ]
  },
  label: {
    name: '标签',
    properties: [
      { key: 'text', label: '文本内容', type: 'text', default: '标签文本' },
      { key: 'fontSize', label: '字体大小', type: 'number', default: 16 },
      { key: 'fontWeight', label: '字体粗细', type: 'select', options: ['normal', 'bold', 'lighter', 'bolder'], default: 'normal' },
      { key: 'color', label: '文字颜色', type: 'color', default: '#333333' },
      { key: 'alignment', label: '对齐方式', type: 'select', options: ['left', 'center', 'right'], default: 'left' },
      { key: 'width', label: '宽度', type: 'number', default: 200 },
      { key: 'height', label: '高度', type: 'number', default: 30 }
    ]
  },
  input: {
    name: '输入框',
    properties: [
      { key: 'placeholder', label: '占位符', type: 'text', default: '请输入内容' },
      { key: 'type', label: '输入类型', type: 'select', options: ['text', 'password', 'email', 'number'], default: 'text' },
      { key: 'width', label: '宽度', type: 'number', default: 200 },
      { key: 'height', label: '高度', type: 'number', default: 40 },
      { key: 'disabled', label: '禁用状态', type: 'boolean', default: false },
      { key: 'readonly', label: '只读状态', type: 'boolean', default: false },
      { key: 'backgroundColor', label: '背景色', type: 'color', default: '#ffffff' },
      { key: 'borderColor', label: '边框颜色', type: 'color', default: '#d1d5db' },
      { key: 'borderRadius', label: '圆角', type: 'text', default: '4px' },
      { key: 'fontSize', label: '字体大小', type: 'number', default: 14 }
    ]
  },
  card: {
    name: '卡片',
    properties: [
      { key: 'title', label: '标题', type: 'text', default: '卡片标题' },
      { key: 'subtitle', label: '副标题', type: 'text', default: '卡片副标题' },
      { key: 'width', label: '宽度', type: 'number', default: 300 },
      { key: 'height', label: '高度', type: 'number', default: 200 },
      { key: 'elevation', label: '阴影级别', type: 'number', default: 2 },
      { key: 'backgroundColor', label: '背景色', type: 'color', default: '#ffffff' },
      { key: 'borderRadius', label: '圆角', type: 'text', default: '8px' },
      { key: 'padding', label: '内边距', type: 'text', default: '16px' }
    ]
  },
  container: {
    name: '容器',
    properties: [
      { key: 'width', label: '宽度', type: 'number', default: 300 },
      { key: 'height', label: '高度', type: 'number', default: 200 },
      { key: 'backgroundColor', label: '背景色', type: 'color', default: '#f8f9fa' },
      { key: 'borderRadius', label: '圆角', type: 'text', default: '4px' },
      { key: 'padding', label: '内边距', type: 'text', default: '16px' },
      { key: 'margin', label: '外边距', type: 'text', default: '0px' },
      { key: 'border', label: '边框', type: 'text', default: '1px solid #e5e7eb' }
    ]
  },
  window: {
    name: '窗口',
    properties: [
      { key: 'title', label: '窗口标题', type: 'text', default: '窗口标题' },
      { key: 'width', label: '宽度', type: 'number', default: 400 },
      { key: 'height', label: '高度', type: 'number', default: 300 },
      { key: 'backgroundColor', label: '背景色', type: 'color', default: '#ffffff' },
      { key: 'borderRadius', label: '圆角', type: 'text', default: '8px' },
      { key: 'resizable', label: '可调整大小', type: 'boolean', default: true },
      { key: 'draggable', label: '可拖拽', type: 'boolean', default: true }
    ]
  },
  vbox: {
    name: '垂直布局',
    properties: [
      { key: 'spacing', label: '间距', type: 'number', default: 10 },
      { key: 'alignment', label: '对齐方式', type: 'select', options: ['start', 'center', 'end', 'stretch'], default: 'start' },
      { key: 'width', label: '宽度', type: 'number', default: 300 },
      { key: 'height', label: '高度', type: 'number', default: 200 },
      { key: 'padding', label: '内边距', type: 'text', default: '16px' },
      { key: 'backgroundColor', label: '背景色', type: 'color', default: 'transparent' }
    ]
  },
  hbox: {
    name: '水平布局',
    properties: [
      { key: 'spacing', label: '间距', type: 'number', default: 10 },
      { key: 'alignment', label: '对齐方式', type: 'select', options: ['start', 'center', 'end', 'stretch'], default: 'start' },
      { key: 'width', label: '宽度', type: 'number', default: 300 },
      { key: 'height', label: '高度', type: 'number', default: 100 },
      { key: 'padding', label: '内边距', type: 'text', default: '16px' },
      { key: 'backgroundColor', label: '背景色', type: 'color', default: 'transparent' }
    ]
  },
  grid: {
    name: '网格布局',
    properties: [
      { key: 'columns', label: '列数', type: 'number', default: 2 },
      { key: 'rows', label: '行数', type: 'number', default: 2 },
      { key: 'spacing', label: '间距', type: 'number', default: 10 },
      { key: 'width', label: '宽度', type: 'number', default: 300 },
      { key: 'height', label: '高度', type: 'number', default: 200 },
      { key: 'padding', label: '内边距', type: 'text', default: '16px' },
      { key: 'backgroundColor', label: '背景色', type: 'color', default: 'transparent' }
    ]
  }
}

// 编辑器相关
const codeEditor = ref()
const editorCode = ref(`// NHAI 组件示例
const container = NHAIObjectFactory.createContainer()

// 创建按钮
const button = NHAIObjectFactory.createButton('点击我')
button.setVariant('primary')
button.setWidth(120)
button.setHeight(40)
button.setOnClick(() => alert('按钮被点击！'))

// 创建标签
const label = NHAIObjectFactory.createLabel('欢迎使用NHAI')
label.setFontSize(16)
label.setColor('#2c3e50')

// 添加到容器
container.addChild(label)
container.addChild(button)

// 渲染到预览区域
const element = container.render()
document.querySelector('.preview-area')?.appendChild(element)`)

// 执行状态（保留用于示例加载）
const isExecuting = ref(false)
const executionError = ref('')

// 支持的框架
const frameworks = [
  { name: 'vanilla', label: '原生JavaScript' },
  { name: 'vue', label: 'Vue (示例)' },
  { name: 'react', label: 'React' },
  { name: 'svelte', label: 'Svelte' }
]

// 计算属性
const currentFrameworkLabel = computed(() => {
  return frameworks.find(f => f.name === currentFramework.value)?.label || '未知'
})

// 示例创建函数
const createButtonDemo = () => {
  if (!demoArea.value) return

  try {
    console.log('开始创建按钮演示...')
    
    // 检查适配器
    const adapter = NHAIFrameworkRegistry.getCurrent()
    console.log('当前适配器:', adapter)
    
    if (!adapter) {
      throw new Error('没有注册的适配器')
    }
    
    const button = NHAIObjectFactory.createButton('点击我')
    console.log('按钮创建成功:', button)
    
    button.setVariant('primary')
    button.setWidth(120)
    button.setHeight(40)
    button.setOnClick(() => alert('按钮被点击！'))
    button.setStyle({
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 'bold'
    })

    console.log('按钮属性设置完成')
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(button)
    console.log('容器创建并添加按钮')

    demoArea.value.innerHTML = ''
    console.log('开始渲染...')
    
    const element = container.render()
    console.log('渲染结果:', element)
    
    demoArea.value.appendChild(element)
    console.log('按钮已添加到DOM')
    
  } catch (error) {
    console.error('创建按钮演示时出错:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : ''
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${errorMessage}<br>详细错误: ${errorStack}</div>`
  }
}

const createLabelDemo = () => {
  if (!demoArea.value) return

  try {
    const label = NHAIObjectFactory.createLabel('欢迎使用NHAI对象系统')
    label.setFontSize(18)
    label.setFontWeight('bold')
    label.setColor('#2c3e50')
    label.setAlignment('center')
    label.setStyle({
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    })

    const container = NHAIObjectFactory.createContainer()
    container.addChild(label)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建标签演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createInputDemo = () => {
  if (!demoArea.value) return

  try {
    const input = NHAIObjectFactory.createInput()
    input.setPlaceholder('请输入内容...')
    input.setWidth(300)
    input.setType('text')
    input.setOnChange((value: any) => console.log('输入值:', value))
    input.setStyle({
      borderRadius: '4px',
      border: '2px solid #e0e0e0',
      transition: 'border-color 0.3s ease'
    })

    const container = NHAIObjectFactory.createContainer()
    container.addChild(input)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建输入框演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createCardDemo = () => {
  if (!demoArea.value) return

  try {
    const card = NHAIObjectFactory.createCard()
    card.setTitle('示例卡片')
    card.setSubtitle('这是一个NHAI卡片组件')
    card.setElevation(2)
    
    const button = NHAIObjectFactory.createButton('卡片按钮')
    button.setVariant('success')
    button.setOnClick(() => alert('卡片中的按钮被点击！'))
    
    card.addChild(button)
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(card)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建卡片演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createVBoxDemo = () => {
  if (!demoArea.value) return

  try {
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(10)
    
    const label1 = NHAIObjectFactory.createLabel('第一个标签')
    const label2 = NHAIObjectFactory.createLabel('第二个标签')
    const button = NHAIObjectFactory.createButton('垂直布局按钮')
    button.setVariant('info')
    
    vbox.addChild(label1)
    vbox.addChild(label2)
    vbox.addChild(button)
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建垂直布局演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createHBoxDemo = () => {
  if (!demoArea.value) return

  try {
    const hbox = NHAIObjectFactory.createHBoxLayout()
    hbox.setSpacing(15)
    
    const button1 = NHAIObjectFactory.createButton('按钮1')
    button1.setVariant('primary')
    
    const button2 = NHAIObjectFactory.createButton('按钮2')
    button2.setVariant('secondary')
    
    const button3 = NHAIObjectFactory.createButton('按钮3')
    button3.setVariant('success')
    
    hbox.addChild(button1)
    hbox.addChild(button2)
    hbox.addChild(button3)
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(hbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建水平布局演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createComplexDemo = () => {
  if (!demoArea.value) return

  try {
    const window = NHAIObjectFactory.createWindow('复杂示例')
    
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const titleLabel = NHAIObjectFactory.createLabel('复杂布局示例')
    titleLabel.setFontSize(20)
    titleLabel.setFontWeight('bold')
    titleLabel.setAlignment('center')
    
    const hbox = NHAIObjectFactory.createHBoxLayout()
    hbox.setSpacing(10)
    
    const input = NHAIObjectFactory.createInput()
    input.setPlaceholder('输入内容...')
    input.setWidth(200)
    
    const button = NHAIObjectFactory.createButton('提交')
    button.setVariant('primary')
    button.setOnClick(() => alert('提交按钮被点击！'))
    
    hbox.addChild(input)
    hbox.addChild(button)
    
    const card = NHAIObjectFactory.createCard()
    card.setTitle('信息卡片')
    card.setSubtitle('这是一个包含在复杂布局中的卡片')
    
    vbox.addChild(titleLabel)
    vbox.addChild(hbox)
    vbox.addChild(card)
    
    window.setLayout(vbox)
    
    const container = NHAIObjectFactory.createContainer()
    container.addChild(window)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建复杂演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createMethodsDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const button = NHAIObjectFactory.createButton('动态按钮')
    button.setVariant('warning')
    button.setWidth(150)
    button.setHeight(50)
    
    let clickCount = 0
    button.setOnClick(() => {
      clickCount++
      button.setText('点击了 ' + clickCount + ' 次')
      button.setStyle({
        backgroundColor: clickCount % 2 === 0 ? '#ffc107' : '#fd7e14'
      })
      
      // 重新渲染
      if (demoArea.value) {
        demoArea.value.innerHTML = ''
        const element = container.render()
        demoArea.value.appendChild(element)
      }
    })
    
    container.addChild(button)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建方法演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createStyleControlDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const button1 = NHAIObjectFactory.createButton('全局样式按钮')
    button1.setVariant('primary')
    button1.setStyle({
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    })
    
    const button2 = NHAIObjectFactory.createButton('自定义样式按钮')
    button2.setVariant('secondary')
    button2.setStyle({
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      border: 'none',
      borderRadius: '25px',
      color: 'white',
      fontSize: '14px',
      padding: '12px 24px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
      transform: 'scale(1.05)',
      transition: 'all 0.3s ease'
    })
    
    container.addChild(button1)
    container.addChild(button2)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建样式控制演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 新增的按钮变体演示函数
const createButtonVariantsDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const primaryButton = NHAIObjectFactory.createButton('主要按钮')
    primaryButton.setVariant('primary')
    primaryButton.setWidth(120)
    primaryButton.setHeight(40)
    
    const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
    secondaryButton.setVariant('secondary')
    secondaryButton.setWidth(120)
    secondaryButton.setHeight(40)
    
    const successButton = NHAIObjectFactory.createButton('成功按钮')
    successButton.setVariant('success')
    successButton.setWidth(120)
    successButton.setHeight(40)
    
    const warningButton = NHAIObjectFactory.createButton('警告按钮')
    warningButton.setVariant('warning')
    warningButton.setWidth(120)
    warningButton.setHeight(40)
    
    const dangerButton = NHAIObjectFactory.createButton('危险按钮')
    dangerButton.setVariant('danger')
    dangerButton.setWidth(120)
    dangerButton.setHeight(40)
    
    container.addChild(primaryButton)
    container.addChild(secondaryButton)
    container.addChild(successButton)
    container.addChild(warningButton)
    container.addChild(dangerButton)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建按钮变体演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createButtonSizesDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const smallButton = NHAIObjectFactory.createButton('小按钮')
    smallButton.setVariant('primary')
    smallButton.setWidth(80)
    smallButton.setHeight(30)
    smallButton.setStyle({ fontSize: '12px' })
    
    const mediumButton = NHAIObjectFactory.createButton('中等按钮')
    mediumButton.setVariant('primary')
    mediumButton.setWidth(120)
    mediumButton.setHeight(40)
    mediumButton.setStyle({ fontSize: '14px' })
    
    const largeButton = NHAIObjectFactory.createButton('大按钮')
    largeButton.setVariant('primary')
    largeButton.setWidth(160)
    largeButton.setHeight(50)
    largeButton.setStyle({ fontSize: '16px' })
    
    container.addChild(smallButton)
    container.addChild(mediumButton)
    container.addChild(largeButton)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建按钮尺寸演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createButtonStatesDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const normalButton = NHAIObjectFactory.createButton('正常状态')
    normalButton.setVariant('primary')
    normalButton.setWidth(120)
    normalButton.setHeight(40)
    
    const disabledButton = NHAIObjectFactory.createButton('禁用状态')
    disabledButton.setVariant('primary')
    disabledButton.setWidth(120)
    disabledButton.setHeight(40)
    disabledButton.setDisabled(true)
    
    const loadingButton = NHAIObjectFactory.createButton('加载中...')
    loadingButton.setVariant('primary')
    loadingButton.setWidth(120)
    loadingButton.setHeight(40)
    loadingButton.setStyle({ opacity: 0.7 })
    
    container.addChild(normalButton)
    container.addChild(disabledButton)
    container.addChild(loadingButton)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建按钮状态演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 新增的标签变体演示函数
const createLabelVariantsDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const titleLabel = NHAIObjectFactory.createLabel('标题标签')
    titleLabel.setFontSize(24)
    titleLabel.setFontWeight('bold')
    titleLabel.setColor('#2c3e50')
    
    const subtitleLabel = NHAIObjectFactory.createLabel('副标题标签')
    subtitleLabel.setFontSize(18)
    subtitleLabel.setFontWeight('600')
    subtitleLabel.setColor('#34495e')
    
    const bodyLabel = NHAIObjectFactory.createLabel('正文标签')
    bodyLabel.setFontSize(14)
    bodyLabel.setColor('#7f8c8d')
    
    const captionLabel = NHAIObjectFactory.createLabel('说明文字')
    captionLabel.setFontSize(12)
    captionLabel.setColor('#95a5a6')
    captionLabel.setStyle({ fontStyle: 'italic' })
    
    container.addChild(titleLabel)
    container.addChild(subtitleLabel)
    container.addChild(bodyLabel)
    container.addChild(captionLabel)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建标签变体演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createLabelAlignmentsDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const leftLabel = NHAIObjectFactory.createLabel('左对齐标签')
    leftLabel.setAlignment('left')
    leftLabel.setWidth(200)
    leftLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    const centerLabel = NHAIObjectFactory.createLabel('居中对齐标签')
    centerLabel.setAlignment('center')
    centerLabel.setWidth(200)
    centerLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    const rightLabel = NHAIObjectFactory.createLabel('右对齐标签')
    rightLabel.setAlignment('right')
    rightLabel.setWidth(200)
    rightLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    container.addChild(leftLabel)
    container.addChild(centerLabel)
    container.addChild(rightLabel)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建标签对齐演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 新增的输入框变体演示函数
const createInputTypesDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const textInput = NHAIObjectFactory.createInput()
    textInput.setPlaceholder('文本输入框')
    textInput.setType('text')
    textInput.setWidth(200)
    
    const emailInput = NHAIObjectFactory.createInput()
    emailInput.setPlaceholder('邮箱输入框')
    emailInput.setType('email')
    emailInput.setWidth(200)
    
    const passwordInput = NHAIObjectFactory.createInput()
    passwordInput.setPlaceholder('密码输入框')
    passwordInput.setType('password')
    passwordInput.setWidth(200)
    
    const numberInput = NHAIObjectFactory.createInput()
    numberInput.setPlaceholder('数字输入框')
    numberInput.setType('number')
    numberInput.setWidth(200)
    
    container.addChild(textInput)
    container.addChild(emailInput)
    container.addChild(passwordInput)
    container.addChild(numberInput)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建输入框类型演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createInputStatesDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    const normalInput = NHAIObjectFactory.createInput()
    normalInput.setPlaceholder('正常状态')
    normalInput.setWidth(200)
    
    const disabledInput = NHAIObjectFactory.createInput()
    disabledInput.setPlaceholder('禁用状态')
    disabledInput.setWidth(200)
    disabledInput.setDisabled(true)
    
    const readonlyInput = NHAIObjectFactory.createInput()
    readonlyInput.setPlaceholder('只读状态')
    readonlyInput.setWidth(200)
    readonlyInput.setValue('只读内容')
    readonlyInput.setReadonly(true)
    
    container.addChild(normalInput)
    container.addChild(disabledInput)
    container.addChild(readonlyInput)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建输入框状态演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 综合演示函数 - 将同一控件的所有变体合并
const createComprehensiveButtonDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 基础按钮
    const basicButton = NHAIObjectFactory.createButton('基础按钮')
    basicButton.setVariant('primary')
    basicButton.setWidth(120)
    basicButton.setHeight(40)
    basicButton.setOnClick(() => alert('基础按钮被点击！'))
    
    // 按钮变体
    const primaryButton = NHAIObjectFactory.createButton('主要按钮')
    primaryButton.setVariant('primary')
    primaryButton.setWidth(100)
    primaryButton.setHeight(35)
    
    const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
    secondaryButton.setVariant('secondary')
    secondaryButton.setWidth(100)
    secondaryButton.setHeight(35)
    
    const successButton = NHAIObjectFactory.createButton('成功按钮')
    successButton.setVariant('success')
    successButton.setWidth(100)
    successButton.setHeight(35)
    
    const warningButton = NHAIObjectFactory.createButton('警告按钮')
    warningButton.setVariant('warning')
    warningButton.setWidth(100)
    warningButton.setHeight(35)
    
    const dangerButton = NHAIObjectFactory.createButton('危险按钮')
    dangerButton.setVariant('danger')
    dangerButton.setWidth(100)
    dangerButton.setHeight(35)
    
    // 按钮尺寸
    const smallButton = NHAIObjectFactory.createButton('小按钮')
    smallButton.setVariant('primary')
    smallButton.setWidth(80)
    smallButton.setHeight(30)
    smallButton.setStyle({ fontSize: '12px' })
    
    const mediumButton = NHAIObjectFactory.createButton('中等按钮')
    mediumButton.setVariant('primary')
    mediumButton.setWidth(120)
    mediumButton.setHeight(40)
    mediumButton.setStyle({ fontSize: '14px' })
    
    const largeButton = NHAIObjectFactory.createButton('大按钮')
    largeButton.setVariant('primary')
    largeButton.setWidth(160)
    largeButton.setHeight(50)
    largeButton.setStyle({ fontSize: '16px' })
    
    // 按钮状态
    const normalButton = NHAIObjectFactory.createButton('正常状态')
    normalButton.setVariant('primary')
    normalButton.setWidth(100)
    normalButton.setHeight(35)
    
    const disabledButton = NHAIObjectFactory.createButton('禁用状态')
    disabledButton.setVariant('primary')
    disabledButton.setWidth(100)
    disabledButton.setHeight(35)
    disabledButton.setDisabled(true)
    
    const loadingButton = NHAIObjectFactory.createButton('加载中...')
    loadingButton.setVariant('primary')
    loadingButton.setWidth(100)
    loadingButton.setHeight(35)
    loadingButton.setStyle({ opacity: 0.7 })
    
    // 使用布局来组织按钮
    const vbox1 = NHAIObjectFactory.createVBoxLayout()
    vbox1.setSpacing(10)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(primaryButton)
    hbox1.addChild(secondaryButton)
    hbox1.addChild(successButton)
    hbox1.addChild(warningButton)
    hbox1.addChild(dangerButton)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallButton)
    hbox2.addChild(mediumButton)
    hbox2.addChild(largeButton)
    
    const hbox3 = NHAIObjectFactory.createHBoxLayout()
    hbox3.setSpacing(10)
    hbox3.addChild(normalButton)
    hbox3.addChild(disabledButton)
    hbox3.addChild(loadingButton)
    
    vbox1.addChild(basicButton)
    vbox1.addChild(hbox1)
    vbox1.addChild(hbox2)
    vbox1.addChild(hbox3)
    
    container.addChild(vbox1)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建综合按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createComprehensiveLabelDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 基础标签
    const basicLabel = NHAIObjectFactory.createLabel('基础标签')
    basicLabel.setFontSize(16)
    basicLabel.setColor('#2c3e50')
    
    // 标签变体
    const titleLabel = NHAIObjectFactory.createLabel('标题标签')
    titleLabel.setFontSize(24)
    titleLabel.setFontWeight('bold')
    titleLabel.setColor('#2c3e50')
    
    const subtitleLabel = NHAIObjectFactory.createLabel('副标题标签')
    subtitleLabel.setFontSize(18)
    subtitleLabel.setFontWeight('600')
    subtitleLabel.setColor('#34495e')
    
    const bodyLabel = NHAIObjectFactory.createLabel('正文标签')
    bodyLabel.setFontSize(14)
    bodyLabel.setColor('#7f8c8d')
    
    const captionLabel = NHAIObjectFactory.createLabel('说明文字')
    captionLabel.setFontSize(12)
    captionLabel.setColor('#95a5a6')
    captionLabel.setStyle({ fontStyle: 'italic' })
    
    // 标签对齐
    const leftLabel = NHAIObjectFactory.createLabel('左对齐标签')
    leftLabel.setAlignment('left')
    leftLabel.setWidth(200)
    leftLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    const centerLabel = NHAIObjectFactory.createLabel('居中对齐标签')
    centerLabel.setAlignment('center')
    centerLabel.setWidth(200)
    centerLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    const rightLabel = NHAIObjectFactory.createLabel('右对齐标签')
    rightLabel.setAlignment('right')
    rightLabel.setWidth(200)
    rightLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })
    
    // 使用布局来组织标签
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(15)
    hbox1.addChild(leftLabel)
    hbox1.addChild(centerLabel)
    hbox1.addChild(rightLabel)
    
    vbox.addChild(basicLabel)
    vbox.addChild(titleLabel)
    vbox.addChild(subtitleLabel)
    vbox.addChild(bodyLabel)
    vbox.addChild(captionLabel)
    vbox.addChild(hbox1)
    
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建综合标签演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createComprehensiveInputDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 基础输入框
    const basicInput = NHAIObjectFactory.createInput()
    basicInput.setPlaceholder('基础输入框')
    basicInput.setWidth(200)
    basicInput.setType('text')
    basicInput.setOnChange((value: any) => console.log('输入值:', value))
    
    // 输入框类型
    const textInput = NHAIObjectFactory.createInput()
    textInput.setPlaceholder('文本输入框')
    textInput.setType('text')
    textInput.setWidth(150)
    
    const emailInput = NHAIObjectFactory.createInput()
    emailInput.setPlaceholder('邮箱输入框')
    emailInput.setType('email')
    emailInput.setWidth(150)
    
    const passwordInput = NHAIObjectFactory.createInput()
    passwordInput.setPlaceholder('密码输入框')
    passwordInput.setType('password')
    passwordInput.setWidth(150)
    
    const numberInput = NHAIObjectFactory.createInput()
    numberInput.setPlaceholder('数字输入框')
    numberInput.setType('number')
    numberInput.setWidth(150)
    
    // 输入框状态
    const normalInput = NHAIObjectFactory.createInput()
    normalInput.setPlaceholder('正常状态')
    normalInput.setWidth(150)
    
    const disabledInput = NHAIObjectFactory.createInput()
    disabledInput.setPlaceholder('禁用状态')
    disabledInput.setWidth(150)
    disabledInput.setDisabled(true)
    
    const readonlyInput = NHAIObjectFactory.createInput()
    readonlyInput.setPlaceholder('只读状态')
    readonlyInput.setWidth(150)
    readonlyInput.setValue('只读内容')
    readonlyInput.setReadonly(true)
    
    // 使用布局来组织输入框
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(textInput)
    hbox1.addChild(emailInput)
    hbox1.addChild(passwordInput)
    hbox1.addChild(numberInput)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(normalInput)
    hbox2.addChild(disabledInput)
    hbox2.addChild(readonlyInput)
    
    vbox.addChild(basicInput)
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建综合输入框演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 按钮子类型演示函数
const createGeneralButtonDemo = () => {
  console.log('createGeneralButtonDemo 开始执行')
  console.log('demoArea.value:', demoArea.value)
  
  if (!demoArea.value) {
    console.error('demoArea 未准备好')
    return
  }

  try {
    console.log('开始创建容器...')
    const container = NHAIObjectFactory.createContainer()
    
    // 通用按钮的各种变体
    const primaryButton = NHAIObjectFactory.createButton('主要按钮')
    primaryButton.setVariant('primary')
    primaryButton.setWidth(120)
    primaryButton.setHeight(40)
    primaryButton.setOnClick(() => alert('主要按钮被点击！'))
    
    const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
    secondaryButton.setVariant('secondary')
    secondaryButton.setWidth(120)
    secondaryButton.setHeight(40)
    
    const successButton = NHAIObjectFactory.createButton('成功按钮')
    successButton.setVariant('success')
    successButton.setWidth(120)
    successButton.setHeight(40)
    
    const warningButton = NHAIObjectFactory.createButton('警告按钮')
    warningButton.setVariant('warning')
    warningButton.setWidth(120)
    warningButton.setHeight(40)
    
    const dangerButton = NHAIObjectFactory.createButton('危险按钮')
    dangerButton.setVariant('danger')
    dangerButton.setWidth(120)
    dangerButton.setHeight(40)
    
    // 不同尺寸的通用按钮
    const smallButton = NHAIObjectFactory.createButton('小按钮')
    smallButton.setVariant('primary')
    smallButton.setWidth(80)
    smallButton.setHeight(30)
    smallButton.setStyle({ fontSize: '12px' })
    
    const mediumButton = NHAIObjectFactory.createButton('中等按钮')
    mediumButton.setVariant('primary')
    mediumButton.setWidth(120)
    mediumButton.setHeight(40)
    mediumButton.setStyle({ fontSize: '14px' })
    
    const largeButton = NHAIObjectFactory.createButton('大按钮')
    largeButton.setVariant('primary')
    largeButton.setWidth(160)
    largeButton.setHeight(50)
    largeButton.setStyle({ fontSize: '16px' })
    
    // 使用布局组织按钮
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(primaryButton)
    hbox1.addChild(secondaryButton)
    hbox1.addChild(successButton)
    hbox1.addChild(warningButton)
    hbox1.addChild(dangerButton)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallButton)
    hbox2.addChild(mediumButton)
    hbox2.addChild(largeButton)
    
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    
    container.addChild(vbox)

    console.log('开始渲染到DOM...')
    demoArea.value.innerHTML = ''
    const element = container.render()
    console.log('渲染结果:', element)
    demoArea.value.appendChild(element)
    console.log('✓ 通用按钮演示创建完成')
  } catch (error) {
    console.error('创建通用按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createTextButtonDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 文本按钮 - 使用 createTextButton
    const textButton1 = NHAIObjectFactory.createTextButton('文本按钮')
    textButton1.setColor('#007bff')
    textButton1.setSize('medium')
    textButton1.setWidth(120)
    textButton1.setHeight(40)
    textButton1.setOnClick(() => alert('文本按钮被点击！'))
    
    const textButton2 = NHAIObjectFactory.createTextButton('链接样式')
    textButton2.setColor('#007bff')
    textButton2.setSize('medium')
    textButton2.setUnderline(true)
    textButton2.setWidth(120)
    textButton2.setHeight(40)
    
    const textButton3 = NHAIObjectFactory.createTextButton('图标按钮')
    textButton3.setColor('#28a745')
    textButton3.setSize('medium')
    textButton3.setWidth(120)
    textButton3.setHeight(40)
    textButton3.setStyle({
      border: '1px solid #28a745',
      borderRadius: '4px'
    })
    
    // 不同尺寸的文本按钮
    const smallTextButton = NHAIObjectFactory.createTextButton('小按钮')
    smallTextButton.setColor('#6c757d')
    smallTextButton.setSize('small')
    smallTextButton.setWidth(80)
    smallTextButton.setHeight(30)
    
    const mediumTextButton = NHAIObjectFactory.createTextButton('中等按钮')
    mediumTextButton.setColor('#007bff')
    mediumTextButton.setSize('medium')
    mediumTextButton.setWidth(120)
    mediumTextButton.setHeight(40)
    
    const largeTextButton = NHAIObjectFactory.createTextButton('大按钮')
    largeTextButton.setColor('#dc3545')
    largeTextButton.setSize('large')
    largeTextButton.setWidth(160)
    largeTextButton.setHeight(50)
    
    // 不同状态的文本按钮
    const normalTextButton = NHAIObjectFactory.createTextButton('正常状态')
    normalTextButton.setColor('#007bff')
    normalTextButton.setSize('medium')
    normalTextButton.setWidth(120)
    normalTextButton.setHeight(40)
    
    const disabledTextButton = NHAIObjectFactory.createTextButton('禁用状态')
    disabledTextButton.setColor('#6c757d')
    disabledTextButton.setSize('medium')
    disabledTextButton.setWidth(120)
    disabledTextButton.setHeight(40)
    disabledTextButton.setDisabled(true)
    
    const underlineTextButton = NHAIObjectFactory.createTextButton('下划线按钮')
    underlineTextButton.setColor('#007bff')
    underlineTextButton.setSize('medium')
    underlineTextButton.setUnderline(true)
    underlineTextButton.setWidth(120)
    underlineTextButton.setHeight(40)
    
    // 使用布局组织文本按钮
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(textButton1)
    hbox1.addChild(textButton2)
    hbox1.addChild(textButton3)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallTextButton)
    hbox2.addChild(mediumTextButton)
    hbox2.addChild(largeTextButton)
    
    const hbox3 = NHAIObjectFactory.createHBoxLayout()
    hbox3.setSpacing(10)
    hbox3.addChild(normalTextButton)
    hbox3.addChild(disabledTextButton)
    hbox3.addChild(underlineTextButton)
    
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    vbox.addChild(hbox3)
    
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建文本按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

const createModernButtonDemo = () => {
  if (!demoArea.value) return

  try {
    // 检查 ModernNHAIButton 是否可用
    if (typeof ModernNHAIButton === 'undefined') {
      demoArea.value.innerHTML = `
        <div style="padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; color: #856404;">
          <h4>⚠️ ModernNHAIButton 未加载</h4>
          <p>ModernNHAIButton 组件需要从 nhai-framework 中导入。</p>
          <p>请确保已正确导入：</p>
          <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0;">
import { ModernNHAIButton } from 'nhai-framework'
          </pre>
          <p>或者使用传统按钮组件进行演示。</p>
        </div>
      `
      return
    }

    // 清空演示区域
    demoArea.value.innerHTML = ''
    
    // 创建演示容器
    const demoContainer = document.createElement('div')
    demoContainer.style.cssText = `
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    `
    
    // 创建 ModernNHAIButton 实例
    const primaryButton = new ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '主要按钮',
      onClick: () => alert('Primary Button 被点击！')
    })

    const defaultButton = new ModernNHAIButton({
      type: 'default',
      size: 'middle',
      children: '默认按钮',
      onClick: () => alert('Default Button 被点击！')
    })

    const dashedButton = new ModernNHAIButton({
      type: 'dashed',
      size: 'middle',
      children: '虚线按钮',
      onClick: () => alert('Dashed Button 被点击！')
    })

    const textButton = new ModernNHAIButton({
      type: 'text',
      size: 'middle',
      children: '文本按钮',
      onClick: () => alert('Text Button 被点击！')
    })

    const linkButton = new ModernNHAIButton({
      type: 'link',
      size: 'middle',
      children: '链接按钮',
      onClick: () => alert('Link Button 被点击！')
    })

    // 不同尺寸
    const smallButton = new ModernNHAIButton({
      type: 'primary',
      size: 'small',
      children: '小按钮',
      onClick: () => alert('Small Button 被点击！')
    })

    const largeButton = new ModernNHAIButton({
      type: 'primary',
      size: 'large',
      children: '大按钮',
      onClick: () => alert('Large Button 被点击！')
    })

    // 状态按钮
    const disabledButton = new ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '禁用按钮',
      disabled: true
    })

    const loadingButton = new ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '加载按钮',
      loading: true
    })

    // 链接功能
    const externalLinkButton = new ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '外部链接',
      href: 'https://www.baidu.com',
      target: '_blank'
    })

    const routerButton = new ModernNHAIButton({
      type: 'primary',
      size: 'middle',
      children: '路由按钮',
      href: '/home',
      router: (path: any) => alert('路由到: ' + path)
    })

    // 创建按钮组
    const buttonGroups = [
      {
        title: '基础类型按钮',
        buttons: [primaryButton, defaultButton, dashedButton, textButton, linkButton]
      },
      {
        title: '尺寸按钮',
        buttons: [smallButton, largeButton]
      },
      {
        title: '状态按钮',
        buttons: [disabledButton, loadingButton]
      },
      {
        title: '链接功能按钮',
        buttons: [externalLinkButton, routerButton]
      }
    ]

    // 渲染按钮组
    buttonGroups.forEach(group => {
      const groupDiv = document.createElement('div')
      groupDiv.style.cssText = `
        margin-bottom: 20px;
        padding: 15px;
        background: white;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `
      
      const title = document.createElement('h4')
      title.textContent = group.title
      title.style.cssText = `
        margin: 0 0 15px 0;
        color: #333;
        font-size: 16px;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
      `
      
      const buttonContainer = document.createElement('div')
      buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
      `
      
      group.buttons.forEach(button => {
        const buttonElement = button.render()
        if (buttonElement.tag) {
          // 创建实际的 DOM 元素
          const element = document.createElement(buttonElement.tag)
          
          // 设置属性
          if (buttonElement.props) {
            Object.keys(buttonElement.props).forEach(key => {
              if (key === 'style' && typeof buttonElement.props[key] === 'object') {
                Object.assign(element.style, buttonElement.props[key])
              } else if (key === 'onClick') {
                element.addEventListener('click', buttonElement.props[key])
              } else {
                element.setAttribute(key, buttonElement.props[key])
              }
            })
          }
          
          // 设置内容
          if (buttonElement.children) {
            element.textContent = buttonElement.children
          }
          
          buttonContainer.appendChild(element)
        }
      })
      
      groupDiv.appendChild(title)
      groupDiv.appendChild(buttonContainer)
      demoContainer.appendChild(groupDiv)
    })

    // 添加到演示区域
    demoArea.value.appendChild(demoContainer)
    
  } catch (error) {
    console.error('创建 ModernNHAIButton 演示时出错:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    demoArea.value.innerHTML = `
      <div style="color: red; padding: 20px;">
        演示创建失败: ${errorMessage}
        <br><br>
        <strong>可能的解决方案：</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>确保已正确导入 ModernNHAIButton</li>
          <li>检查 nhai-framework 是否正确加载</li>
          <li>查看浏览器控制台获取详细错误信息</li>
        </ul>
      </div>
    `
  }
}

const createLinkButtonDemo = () => {
  if (!demoArea.value) return

  try {
    const container = NHAIObjectFactory.createContainer()
    
    // 链接按钮 - 模拟链接样式的按钮
    const linkButton1 = NHAIObjectFactory.createButton('普通链接')
    linkButton1.setVariant('primary')
    linkButton1.setWidth(120)
    linkButton1.setHeight(40)
    linkButton1.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal'
    })
    
    const linkButton2 = NHAIObjectFactory.createButton('悬停链接')
    linkButton2.setVariant('primary')
    linkButton2.setWidth(120)
    linkButton2.setHeight(40)
    linkButton2.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#0056b3',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal',
      transition: 'color 0.3s ease'
    })
    
    const linkButton3 = NHAIObjectFactory.createButton('访问过的链接')
    linkButton3.setVariant('primary')
    linkButton3.setWidth(120)
    linkButton3.setHeight(40)
    linkButton3.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#6c757d',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: 'normal'
    })
    
    // 不同大小的链接按钮
    const smallLinkButton = NHAIObjectFactory.createButton('小链接')
    smallLinkButton.setVariant('primary')
    smallLinkButton.setWidth(80)
    smallLinkButton.setHeight(30)
    smallLinkButton.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      fontSize: '12px'
    })
    
    const largeLinkButton = NHAIObjectFactory.createButton('大链接')
    largeLinkButton.setVariant('primary')
    largeLinkButton.setWidth(160)
    largeLinkButton.setHeight(50)
    largeLinkButton.setStyle({
      background: 'transparent',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      fontSize: '16px'
    })
    
    // 使用布局组织链接按钮
    const vbox = NHAIObjectFactory.createVBoxLayout()
    vbox.setSpacing(15)
    
    const hbox1 = NHAIObjectFactory.createHBoxLayout()
    hbox1.setSpacing(10)
    hbox1.addChild(linkButton1)
    hbox1.addChild(linkButton2)
    hbox1.addChild(linkButton3)
    
    const hbox2 = NHAIObjectFactory.createHBoxLayout()
    hbox2.setSpacing(10)
    hbox2.addChild(smallLinkButton)
    hbox2.addChild(largeLinkButton)
    
    vbox.addChild(hbox1)
    vbox.addChild(hbox2)
    
    container.addChild(vbox)

    demoArea.value.innerHTML = ''
    const element = container.render()
    demoArea.value.appendChild(element)
  } catch (error) {
    console.error('创建链接按钮演示时出错:', error)
    demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
  }
}

// 树形目录数据 - 三层结构，支持控件子类型
const treeData = ref([
  {
    name: '基础控件',
    expanded: false,
    children: [
      {
        name: '按钮控件',
        expanded: false,
        children: [
          {
            id: 'general-button',
            title: '通用按钮',
            description: '展示通用按钮的各种变体、尺寸和状态',
            code: `// 通用按钮示例
// 1. 按钮变体
const primaryButton = NHAIObjectFactory.createButton('主要按钮')
primaryButton.setVariant('primary')
primaryButton.setWidth(120)
primaryButton.setHeight(40)
primaryButton.setOnClick(() => alert('主要按钮被点击！'))

const secondaryButton = NHAIObjectFactory.createButton('次要按钮')
secondaryButton.setVariant('secondary')
secondaryButton.setWidth(120)
secondaryButton.setHeight(40)

const successButton = NHAIObjectFactory.createButton('成功按钮')
successButton.setVariant('success')
successButton.setWidth(120)
successButton.setHeight(40)

const warningButton = NHAIObjectFactory.createButton('警告按钮')
warningButton.setVariant('warning')
warningButton.setWidth(120)
warningButton.setHeight(40)

const dangerButton = NHAIObjectFactory.createButton('危险按钮')
dangerButton.setVariant('danger')
dangerButton.setWidth(120)
dangerButton.setHeight(40)

// 2. 按钮尺寸
const smallButton = NHAIObjectFactory.createButton('小按钮')
smallButton.setVariant('primary')
smallButton.setWidth(80)
smallButton.setHeight(30)
smallButton.setStyle({ fontSize: '12px' })

const mediumButton = NHAIObjectFactory.createButton('中等按钮')
mediumButton.setVariant('primary')
mediumButton.setWidth(120)
mediumButton.setHeight(40)
mediumButton.setStyle({ fontSize: '14px' })

const largeButton = NHAIObjectFactory.createButton('大按钮')
largeButton.setVariant('primary')
largeButton.setWidth(160)
largeButton.setHeight(50)
largeButton.setStyle({ fontSize: '16px' })

// 使用布局组织按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(primaryButton)
hbox1.addChild(secondaryButton)
hbox1.addChild(successButton)
hbox1.addChild(warningButton)
hbox1.addChild(dangerButton)
hbox2.addChild(smallButton)
hbox2.addChild(mediumButton)
hbox2.addChild(largeButton)
vbox.addChild(hbox1)
vbox.addChild(hbox2)`,
            createDemo: createGeneralButtonDemo
          },
          {
            id: 'text-button',
            title: '文本按钮',
            description: '展示文本按钮的样式和交互效果',
            code: `// 文本按钮示例
// 1. 基础文本按钮
const textButton1 = NHAIObjectFactory.createTextButton('文本按钮')
textButton1.setColor('#007bff')
textButton1.setSize('medium')
textButton1.setWidth(120)
textButton1.setHeight(40)
textButton1.setOnClick(() => alert('文本按钮被点击！'))

// 2. 链接样式文本按钮
const textButton2 = NHAIObjectFactory.createTextButton('链接样式')
textButton2.setColor('#007bff')
textButton2.setSize('medium')
textButton2.setUnderline(true)
textButton2.setWidth(120)
textButton2.setHeight(40)

// 3. 图标样式文本按钮
const textButton3 = NHAIObjectFactory.createTextButton('图标按钮')
textButton3.setColor('#28a745')
textButton3.setSize('medium')
textButton3.setWidth(120)
textButton3.setHeight(40)
textButton3.setStyle({
  border: '1px solid #28a745',
  borderRadius: '4px'
})

// 4. 不同尺寸的文本按钮
const smallTextButton = NHAIObjectFactory.createTextButton('小按钮')
smallTextButton.setColor('#6c757d')
smallTextButton.setSize('small')
smallTextButton.setWidth(80)
smallTextButton.setHeight(30)

const mediumTextButton = NHAIObjectFactory.createTextButton('中等按钮')
mediumTextButton.setColor('#007bff')
mediumTextButton.setSize('medium')
mediumTextButton.setWidth(120)
mediumTextButton.setHeight(40)

const largeTextButton = NHAIObjectFactory.createTextButton('大按钮')
largeTextButton.setColor('#dc3545')
largeTextButton.setSize('large')
largeTextButton.setWidth(160)
largeTextButton.setHeight(50)

// 5. 不同状态的文本按钮
const normalTextButton = NHAIObjectFactory.createTextButton('正常状态')
normalTextButton.setColor('#007bff')
normalTextButton.setSize('medium')
normalTextButton.setWidth(120)
normalTextButton.setHeight(40)

const disabledTextButton = NHAIObjectFactory.createTextButton('禁用状态')
disabledTextButton.setColor('#6c757d')
disabledTextButton.setSize('medium')
disabledTextButton.setWidth(120)
disabledTextButton.setHeight(40)
disabledTextButton.setDisabled(true)

const underlineTextButton = NHAIObjectFactory.createTextButton('下划线按钮')
underlineTextButton.setColor('#007bff')
underlineTextButton.setSize('medium')
underlineTextButton.setUnderline(true)
underlineTextButton.setWidth(120)
underlineTextButton.setHeight(40)

// 使用布局组织文本按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()
const hbox3 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(textButton1)
hbox1.addChild(textButton2)
hbox1.addChild(textButton3)
hbox2.addChild(smallTextButton)
hbox2.addChild(mediumTextButton)
hbox2.addChild(largeTextButton)
hbox3.addChild(normalTextButton)
hbox3.addChild(disabledTextButton)
hbox3.addChild(underlineTextButton)
vbox.addChild(hbox1)
vbox.addChild(hbox2)
vbox.addChild(hbox3)`,
            createDemo: createTextButtonDemo
          },
          {
            id: 'modern-button',
            title: 'ModernNHAIButton',
            description: '现代化声明式按钮组件，支持多种类型、尺寸和交互方式',
            code: `// ModernNHAIButton 示例
// 注意：需要先导入 ModernNHAIButton
// import { ModernNHAIButton } from 'nhai-framework'

// 1. 基础按钮类型
const primaryButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '主要按钮',
  onClick: () => alert('Primary Button 被点击！')
})

const defaultButton = new ModernNHAIButton({
  type: 'default',
  size: 'middle',
  children: '默认按钮',
  onClick: () => alert('Default Button 被点击！')
})

const dashedButton = new ModernNHAIButton({
  type: 'dashed',
  size: 'middle',
  children: '虚线按钮',
  onClick: () => alert('Dashed Button 被点击！')
})

const textButton = new ModernNHAIButton({
  type: 'text',
  size: 'middle',
  children: '文本按钮',
  onClick: () => alert('Text Button 被点击！')
})

const linkButton = new ModernNHAIButton({
  type: 'link',
  size: 'middle',
  children: '链接按钮',
  onClick: () => alert('Link Button 被点击！')
})

// 2. 不同尺寸
const smallButton = new ModernNHAIButton({
  type: 'primary',
  size: 'small',
  children: '小按钮',
  onClick: () => alert('Small Button 被点击！')
})

const largeButton = new ModernNHAIButton({
  type: 'primary',
  size: 'large',
  children: '大按钮',
  onClick: () => alert('Large Button 被点击！')
})

// 3. 状态按钮
const disabledButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '禁用按钮',
  disabled: true
})

const loadingButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '加载按钮',
  loading: true
})

// 4. 链接功能
const externalLinkButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '外部链接',
  href: 'https://www.baidu.com',
  target: '_blank'
})

const routerButton = new ModernNHAIButton({
  type: 'primary',
  size: 'middle',
  children: '路由按钮',
  href: '/home',
  router: (path) => alert('路由到: ' + path)
})

// 使用布局组织按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()
const hbox3 = NHAIObjectFactory.createHBoxLayout()
const hbox4 = NHAIObjectFactory.createHBoxLayout()

// 基础类型按钮
hbox1.addChild(primaryButton.render())
hbox1.addChild(defaultButton.render())
hbox1.addChild(dashedButton.render())
hbox1.addChild(textButton.render())
hbox1.addChild(linkButton.render())

// 尺寸按钮
hbox2.addChild(smallButton.render())
hbox2.addChild(largeButton.render())

// 状态按钮
hbox3.addChild(disabledButton.render())
hbox3.addChild(loadingButton.render())

// 链接按钮
hbox4.addChild(externalLinkButton.render())
hbox4.addChild(routerButton.render())

vbox.addChild(hbox1)
vbox.addChild(hbox2)
vbox.addChild(hbox3)
vbox.addChild(hbox4)`,
            createDemo: createModernButtonDemo
          },
          {
            id: 'link-button',
            title: '链接按钮',
            description: '展示链接样式的按钮效果',
            code: `// 链接按钮示例
// 1. 普通链接按钮
const linkButton1 = NHAIObjectFactory.createButton('普通链接')
linkButton1.setVariant('primary')
linkButton1.setWidth(120)
linkButton1.setHeight(40)
linkButton1.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#007bff',
  textDecoration: 'underline',
  fontSize: '14px',
  fontWeight: 'normal'
})

// 2. 悬停链接按钮
const linkButton2 = NHAIObjectFactory.createButton('悬停链接')
linkButton2.setVariant('primary')
linkButton2.setWidth(120)
linkButton2.setHeight(40)
linkButton2.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#0056b3',
  textDecoration: 'underline',
  fontSize: '14px',
  fontWeight: 'normal',
  transition: 'color 0.3s ease'
})

// 3. 访问过的链接按钮
const linkButton3 = NHAIObjectFactory.createButton('访问过的链接')
linkButton3.setVariant('primary')
linkButton3.setWidth(120)
linkButton3.setHeight(40)
linkButton3.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#6c757d',
  textDecoration: 'underline',
  fontSize: '14px',
  fontWeight: 'normal'
})

// 4. 不同大小的链接按钮
const smallLinkButton = NHAIObjectFactory.createButton('小链接')
smallLinkButton.setVariant('primary')
smallLinkButton.setWidth(80)
smallLinkButton.setHeight(30)
smallLinkButton.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#007bff',
  textDecoration: 'underline',
  fontSize: '12px'
})

const largeLinkButton = NHAIObjectFactory.createButton('大链接')
largeLinkButton.setVariant('primary')
largeLinkButton.setWidth(160)
largeLinkButton.setHeight(50)
largeLinkButton.setStyle({
  background: 'transparent',
  border: 'none',
  color: '#007bff',
  textDecoration: 'underline',
  fontSize: '16px'
})

// 使用布局组织链接按钮
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(linkButton1)
hbox1.addChild(linkButton2)
hbox1.addChild(linkButton3)
hbox2.addChild(smallLinkButton)
hbox2.addChild(largeLinkButton)
vbox.addChild(hbox1)
vbox.addChild(hbox2)`,
            createDemo: createLinkButtonDemo
          }
        ]
      },
      {
        name: '标签控件',
        expanded: false,
        children: [
          {
            id: 'label-comprehensive',
        title: '标签控件',
            description: '展示标签的所有变体：基础、类型、对齐方式',
            code: `// 标签控件综合示例
// 1. 基础标签
const basicLabel = NHAIObjectFactory.createLabel('基础标签')
basicLabel.setFontSize(16)
basicLabel.setColor('#2c3e50')

// 2. 标签变体
const titleLabel = NHAIObjectFactory.createLabel('标题标签')
titleLabel.setFontSize(24)
titleLabel.setFontWeight('bold')
titleLabel.setColor('#2c3e50')

const subtitleLabel = NHAIObjectFactory.createLabel('副标题标签')
subtitleLabel.setFontSize(18)
subtitleLabel.setFontWeight('600')
subtitleLabel.setColor('#34495e')

const bodyLabel = NHAIObjectFactory.createLabel('正文标签')
bodyLabel.setFontSize(14)
bodyLabel.setColor('#7f8c8d')

const captionLabel = NHAIObjectFactory.createLabel('说明文字')
captionLabel.setFontSize(12)
captionLabel.setColor('#95a5a6')
captionLabel.setStyle({ fontStyle: 'italic' })

// 3. 标签对齐
const leftLabel = NHAIObjectFactory.createLabel('左对齐标签')
leftLabel.setAlignment('left')
leftLabel.setWidth(200)
leftLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })

const centerLabel = NHAIObjectFactory.createLabel('居中对齐标签')
centerLabel.setAlignment('center')
centerLabel.setWidth(200)
centerLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })

const rightLabel = NHAIObjectFactory.createLabel('右对齐标签')
rightLabel.setAlignment('right')
rightLabel.setWidth(200)
rightLabel.setStyle({ border: '1px solid #ddd', padding: '10px' })

// 使用布局组织标签
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox = NHAIObjectFactory.createHBoxLayout()

hbox.addChild(leftLabel, centerLabel, rightLabel)
vbox.addChild(basicLabel, titleLabel, subtitleLabel, bodyLabel, captionLabel, hbox)`,
            createDemo: createComprehensiveLabelDemo
          }
        ]
      },
      {
        name: '输入框控件',
        expanded: false,
        children: [
          {
            id: 'input-comprehensive',
        title: '输入框控件',
            description: '展示输入框的所有变体：基础、类型、状态',
            code: `// 输入框控件综合示例
// 1. 基础输入框
const basicInput = NHAIObjectFactory.createInput()
basicInput.setPlaceholder('基础输入框')
basicInput.setWidth(200)
basicInput.setType('text')
basicInput.setOnChange((value) => console.log('输入值:', value))

// 2. 输入框类型
const textInput = NHAIObjectFactory.createInput()
textInput.setPlaceholder('文本输入框')
textInput.setType('text')

const emailInput = NHAIObjectFactory.createInput()
emailInput.setPlaceholder('邮箱输入框')
emailInput.setType('email')

const passwordInput = NHAIObjectFactory.createInput()
passwordInput.setPlaceholder('密码输入框')
passwordInput.setType('password')

const numberInput = NHAIObjectFactory.createInput()
numberInput.setPlaceholder('数字输入框')
numberInput.setType('number')

// 3. 输入框状态
const normalInput = NHAIObjectFactory.createInput()
normalInput.setPlaceholder('正常状态')

const disabledInput = NHAIObjectFactory.createInput()
disabledInput.setPlaceholder('禁用状态')
disabledInput.setDisabled(true)

const readonlyInput = NHAIObjectFactory.createInput()
readonlyInput.setPlaceholder('只读状态')
readonlyInput.setValue('只读内容')
readonlyInput.setReadonly(true)

// 使用布局组织输入框
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox1 = NHAIObjectFactory.createHBoxLayout()
const hbox2 = NHAIObjectFactory.createHBoxLayout()

hbox1.addChild(textInput)
hbox1.addChild(emailInput)
hbox1.addChild(passwordInput)
hbox1.addChild(numberInput)
hbox2.addChild(normalInput)
hbox2.addChild(disabledInput)
hbox2.addChild(readonlyInput)
vbox.addChild(basicInput)
vbox.addChild(hbox1)
vbox.addChild(hbox2)`,
            createDemo: createComprehensiveInputDemo
          }
        ]
      }
    ]
  },
  {
    name: '容器组件',
    expanded: false,
    children: [
      {
        name: '卡片组件',
        expanded: false,
        children: [
          {
            id: 'card-basic',
        title: '卡片组件',
        description: '展示如何创建和配置卡片组件',
        code: `// 创建卡片组件
const card = NHAIObjectFactory.createCard()
card.setTitle('示例卡片')
card.setSubtitle('这是一个NHAI卡片组件')
card.setElevation(2)

// 添加子组件
const button = NHAIObjectFactory.createButton('卡片按钮')
button.setVariant('success')
card.addChild(button)`,
        createDemo: createCardDemo
          }
        ]
      },
      {
        name: '窗口组件',
        expanded: false,
        children: [
          {
            id: 'window-basic',
            title: '窗口组件',
            description: '展示如何创建和配置窗口组件',
            code: `// 创建窗口组件
const window = NHAIObjectFactory.createWindow('示例窗口')
window.setWidth(400)
window.setHeight(300)

// 添加内容
const label = NHAIObjectFactory.createLabel('窗口内容')
window.addChild(label)`,
            createDemo: createComplexDemo
          }
        ]
      }
    ]
  },
  {
    name: '布局管理',
    expanded: false,
    children: [
      {
        name: '垂直布局',
        expanded: false,
        children: [
          {
            id: 'vbox-basic',
        title: '垂直布局',
        description: '展示如何创建垂直布局',
        code: `// 创建垂直布局
const vbox = NHAIObjectFactory.createVBoxLayout()
vbox.setSpacing(10)

// 添加子组件
const label1 = NHAIObjectFactory.createLabel('第一个标签')
const label2 = NHAIObjectFactory.createLabel('第二个标签')
const button = NHAIObjectFactory.createButton('垂直布局按钮')

vbox.addChild(label1)
vbox.addChild(label2)
vbox.addChild(button)`,
        createDemo: createVBoxDemo
          }
        ]
      },
      {
        name: '水平布局',
        expanded: false,
        children: [
          {
            id: 'hbox-basic',
        title: '水平布局',
        description: '展示如何创建水平布局',
        code: `// 创建水平布局
const hbox = NHAIObjectFactory.createHBoxLayout()
hbox.setSpacing(15)

// 添加子组件
const button1 = NHAIObjectFactory.createButton('按钮1')
const button2 = NHAIObjectFactory.createButton('按钮2')
const button3 = NHAIObjectFactory.createButton('按钮3')

hbox.addChild(button1)
hbox.addChild(button2)
hbox.addChild(button3)`,
        createDemo: createHBoxDemo
          }
        ]
      }
    ]
  },
  {
    name: '高级示例',
    expanded: false,
    children: [
      {
        name: '复杂组合',
        expanded: false,
        children: [
          {
            id: 'complex-layout',
        title: '复杂布局组合',
        description: '展示复杂的布局组合和组件嵌套',
        code: `// 创建复杂布局
const window = NHAIObjectFactory.createWindow('复杂示例')
const vbox = NHAIObjectFactory.createVBoxLayout()
const hbox = NHAIObjectFactory.createHBoxLayout()

// 添加各种组件
const titleLabel = NHAIObjectFactory.createLabel('复杂布局示例')
const input = NHAIObjectFactory.createInput()
const button = NHAIObjectFactory.createButton('提交')
const card = NHAIObjectFactory.createCard()

// 组合布局
hbox.addChild(input)
hbox.addChild(button)
vbox.addChild(titleLabel)
vbox.addChild(hbox)
vbox.addChild(card)
window.setLayout(vbox)`,
        createDemo: createComplexDemo
          }
        ]
      },
      {
        name: '动态交互',
        expanded: false,
        children: [
          {
            id: 'dynamic-methods',
        title: '动态方法调用',
        description: '展示如何动态调用组件方法',
        code: `// 动态方法调用示例
const button = NHAIObjectFactory.createButton('动态按钮')
let clickCount = 0

button.setOnClick(() => {
  clickCount++
  button.setText('点击了 ' + clickCount + ' 次')
  button.setStyle({
    backgroundColor: clickCount % 2 === 0 ? '#ffc107' : '#fd7e14'
  })
})`,
        createDemo: createMethodsDemo
      },
      {
        id: 'style-control',
        title: '样式控制',
        description: '展示全局样式和自定义样式的控制',
        code: `// 样式控制示例
const button1 = NHAIObjectFactory.createButton('全局样式按钮')
button1.setStyle({
  borderRadius: '20px',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
})

const button2 = NHAIObjectFactory.createButton('自定义样式按钮')
button2.setStyle({
  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  border: 'none',
  borderRadius: '25px',
  color: 'white'
})`,
        createDemo: createStyleControlDemo
          }
        ]
      }
    ]
  },
  {
    name: 'Material组件',
    expanded: false,
    children: [
      {
        name: 'Material基础',
        expanded: false,
        children: [
          {
            id: 'material-button',
            title: 'Material按钮',
            description: 'Material Design风格的按钮组件',
            code: `// Material按钮示例
import { MaterialButton, ButtonType } from 'nhai-framework'

// 1. 包含按钮 (Contained)
const containedButton = new MaterialButton({
  text: '包含按钮',
  type: ButtonType.CONTAINED,
  color: 'primary',
  disabled: false
})

// 2. 轮廓按钮 (Outlined)
const outlinedButton = new MaterialButton({
  text: '轮廓按钮',
  type: ButtonType.OUTLINED,
  color: 'primary',
  disabled: false
})

// 3. 文本按钮 (Text)
const textButton = new MaterialButton({
  text: '文本按钮',
  type: ButtonType.TEXT,
  color: 'primary',
  disabled: false
})

// 添加到容器
const container = document.createElement('div')
container.style.cssText = \`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
\`

container.appendChild(containedButton.render())
container.appendChild(outlinedButton.render())
container.appendChild(textButton.render())`,
            createDemo: () => {
              if (!demoArea.value) return
              
              try {
                const container = NHAIObjectFactory.createContainer()
                container.setStyle({ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px', 
                  padding: '20px' 
                })
                
                // 创建Material按钮 - 先创建容器，然后用容器作为parent
                const button1 = new MaterialButton(container as any)
                button1.setText('包含按钮')
                button1.setType(ButtonType.CONTAINED)
                button1.setColor('primary')
                button1.setDisabled(false)
                
                const button2 = new MaterialButton(container as any)
                button2.setText('轮廓按钮')
                button2.setType(ButtonType.OUTLINED)
                button2.setColor('primary')
                button2.setDisabled(false)
                
                const button3 = new MaterialButton(container as any)
                button3.setText('文本按钮')
                button3.setType(ButtonType.TEXT)
                button3.setColor('primary')
                button3.setDisabled(false)
                
                const element = container.render()
                demoArea.value.appendChild(element)
              } catch (error) {
                console.error('创建Material按钮演示失败:', error)
                demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          },
          {
            id: 'material-input',
            title: 'Material输入框',
            description: 'Material Design风格的输入框组件',
            code: `// Material输入框示例
import { MaterialInput, InputType } from 'nhai-framework'

// 1. 标准输入框
const standardInput = new MaterialInput({
  type: InputType.TEXT,
  label: '标准输入框',
  placeholder: '请输入内容',
  helperText: '这是提示信息',
  required: false,
  disabled: false
})

// 2. 数字输入框
const numberInput = new MaterialInput({
  type: InputType.NUMBER,
  label: '数字输入框',
  placeholder: '请输入数字',
  helperText: '只能输入数字',
  required: true,
  disabled: false
})

// 3. 密码输入框
const passwordInput = new MaterialInput({
  type: InputType.PASSWORD,
  label: '密码输入框',
  placeholder: '请输入密码',
  helperText: '至少8位字符',
  required: true,
  disabled: false,
  showPasswordToggle: true
})

// 添加到容器
const container = document.createElement('div')
container.style.cssText = \`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  max-width: 400px;
\`

container.appendChild(standardInput.render())
container.appendChild(numberInput.render())
container.appendChild(passwordInput.render())`,
            createDemo: () => {
              if (!demoArea.value) return
              
              try {
                const container = NHAIObjectFactory.createContainer()
                container.setStyle({ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '24px', 
                  padding: '20px', 
                  maxWidth: '400px' 
                })
                
                // 创建Material输入框
                const input1 = new MaterialInput(container as any)
                input1.setType('text')
                input1.setLabel('标准输入框')
                input1.setPlaceholder('请输入内容')
                input1.setHelperText('这是提示信息')
                input1.setRequired(false)
                input1.setDisabled(false)
                
                const input2 = new MaterialInput(container as any)
                input2.setType('number')
                input2.setLabel('数字输入框')
                input2.setPlaceholder('请输入数字')
                input2.setHelperText('只能输入数字')
                input2.setRequired(true)
                input2.setDisabled(false)
                
                const input3 = new MaterialInput(container as any)
                input3.setType('password')
                input3.setLabel('密码输入框')
                input3.setPlaceholder('请输入密码')
                input3.setHelperText('至少8位字符')
                input3.setRequired(true)
                input3.setDisabled(false)
                
                const element = container.render()
                demoArea.value.appendChild(element)
              } catch (error) {
                console.error('创建Material输入框演示失败:', error)
                demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          },
          {
            id: 'material-switch',
            title: 'Material开关',
            description: 'Material Design风格的开关组件',
            code: `// Material开关示例
import { MaterialSwitch } from 'nhai-framework'

// 1. 基础开关
const basicSwitch = new MaterialSwitch({
  label: '启用通知',
  checked: false,
  disabled: false,
  color: 'primary'
})

// 2. 选中状态
const checkedSwitch = new MaterialSwitch({
  label: '自动保存',
  checked: true,
  disabled: false,
  color: 'primary'
})

// 3. 禁用状态
const disabledSwitch = new MaterialSwitch({
  label: '高级设置',
  checked: false,
  disabled: true,
  color: 'primary'
})

// 添加到容器
const container = document.createElement('div')
container.style.cssText = \`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  max-width: 300px;
\`

container.appendChild(basicSwitch.render())
container.appendChild(checkedSwitch.render())
container.appendChild(disabledSwitch.render())`,
            createDemo: () => {
              if (!demoArea.value) return
              
              try {
                const container = NHAIObjectFactory.createContainer()
                container.setStyle({ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px', 
                  padding: '20px', 
                  maxWidth: '300px' 
                })
                
                // 创建Material开关
                const switch1 = new MaterialSwitch(container as any)
                switch1.setLabel('启用通知')
                switch1.setChecked(false)
                switch1.setDisabled(false)
                switch1.setColor('primary')
                
                const switch2 = new MaterialSwitch(container as any)
                switch2.setLabel('自动保存')
                switch2.setChecked(true)
                switch2.setDisabled(false)
                switch2.setColor('primary')
                
                const switch3 = new MaterialSwitch(container as any)
                switch3.setLabel('高级设置')
                switch3.setChecked(false)
                switch3.setDisabled(true)
                switch3.setColor('primary')
                
                const element = container.render()
                demoArea.value.appendChild(element)
              } catch (error) {
                console.error('创建Material开关演示失败:', error)
                demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          },
          {
            id: 'material-checkbox',
            title: 'Material复选框',
            description: 'Material Design风格的复选框组件',
            code: `// Material复选框示例
import { MaterialCheckbox } from 'nhai-framework'

// 1. 基础复选框
const basicCheckbox = new MaterialCheckbox(container)
basicCheckbox.setLabel('启用通知')
basicCheckbox.setChecked(false)
basicCheckbox.setDisabled(false)
basicCheckbox.setColor('primary')

// 2. 选中状态
const checkedCheckbox = new MaterialCheckbox(container)
checkedCheckbox.setLabel('自动保存')
checkedCheckbox.setChecked(true)
checkedCheckbox.setDisabled(false)
checkedCheckbox.setColor('primary')

// 3. 禁用状态
const disabledCheckbox = new MaterialCheckbox(container)
disabledCheckbox.setLabel('高级设置')
disabledCheckbox.setChecked(false)
disabledCheckbox.setDisabled(true)
disabledCheckbox.setColor('primary')`,
            createDemo: () => {
              if (!demoArea.value) return
              
              try {
                const container = NHAIObjectFactory.createContainer()
                container.setStyle({ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px', 
                  padding: '20px', 
                  maxWidth: '300px' 
                })
                
                // 创建Material复选框
                const checkbox1 = new MaterialCheckbox(container as any)
                checkbox1.setLabel('启用通知')
                checkbox1.setChecked(false)
                checkbox1.setDisabled(false)
                checkbox1.setColor('primary')
                
                const checkbox2 = new MaterialCheckbox(container as any)
                checkbox2.setLabel('自动保存')
                checkbox2.setChecked(true)
                checkbox2.setDisabled(false)
                checkbox2.setColor('primary')
                
                const checkbox3 = new MaterialCheckbox(container as any)
                checkbox3.setLabel('高级设置')
                checkbox3.setChecked(false)
                checkbox3.setDisabled(true)
                checkbox3.setColor('primary')
                
                const element = container.render()
                demoArea.value.appendChild(element)
              } catch (error) {
                console.error('创建Material复选框演示失败:', error)
                demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          }
        ]
      },
      {
        name: 'Material数据',
        expanded: false,
        children: [
          {
            id: 'material-card',
            title: 'Material卡片',
            description: 'Material Design风格的卡片组件',
            code: `// Material卡片示例
import { MaterialCard } from 'nhai-framework'

// 1. 基础卡片
const basicCard = new MaterialCard({
  title: '卡片标题',
  subtitle: '卡片副标题',
  content: '这是卡片的内容区域',
  actions: [
    { label: '操作', type: 'button' }
  ]
})

// 2. 带图片的卡片
const imageCard = new MaterialCard({
  title: '图片卡片',
  subtitle: '带图片的内容',
  image: 'https://via.placeholder.com/300x200',
  content: '这是一张带图片的卡片',
  actions: [
    { label: '分享', type: 'button' },
    { label: '收藏', type: 'button' }
  ]
})

// 添加到容器
const container = document.createElement('div')
container.style.cssText = \`
  display: flex;
  gap: 20px;
  padding: 20px;
\`

container.appendChild(basicCard.render())
container.appendChild(imageCard.render())`,
            createDemo: () => {
              if (!demoArea.value) return
              
              try {
                const container = NHAIObjectFactory.createContainer()
                container.setStyle({ 
                  display: 'flex', 
                  gap: '20px', 
                  padding: '20px', 
                  flexWrap: 'wrap' 
                })
                
                // 创建Material卡片
                const card1 = new MaterialCard(container as any)
                card1.setTitle('卡片标题')
                card1.setSubtitle('卡片副标题')
                card1.setContent('这是卡片的内容区域，可以包含任何内容')
                card1.setElevation(2)
                
                const card2 = new MaterialCard(container as any)
                card2.setTitle('带图片的卡片')
                card2.setSubtitle('带图片的内容')
                card2.setContent('这是一张带图片的卡片')
                card2.setImage('https://via.placeholder.com/300x200')
                card2.setElevation(4)
                
                const element = container.render()
                demoArea.value.appendChild(element)
              } catch (error) {
                console.error('创建Material卡片演示失败:', error)
                demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          },
          {
            id: 'material-table',
            title: 'Material表格',
            description: 'Material Design风格的表格组件',
            code: `// Material表格示例
import { MaterialTable } from 'nhai-framework'

// 定义表格列
const columns = [
  { key: 'name', label: '姓名' },
  { key: 'age', label: '年龄' },
  { key: 'email', label: '邮箱' }
]

// 定义表格数据
const data = [
  { name: '张三', age: 25, email: 'zhangsan@example.com' },
  { name: '李四', age: 30, email: 'lisi@example.com' },
  { name: '王五', age: 28, email: 'wangwu@example.com' }
]

// 创建表格
const table = new MaterialTable({
  columns,
  data,
  pagination: true,
  pageSize: 10,
  sortable: true
})

// 添加到容器
const container = document.createElement('div')
container.style.cssText = \`
  padding: 20px;
\`

container.appendChild(table.render())`,
            createDemo: () => {
              if (!demoArea.value) return
              
              try {
                const container = NHAIObjectFactory.createContainer()
                container.setStyle({ padding: '20px' })
                
                // 创建Material表格
                const columns = [
                  { key: 'name', label: '姓名', sortable: true },
                  { key: 'age', label: '年龄', sortable: true },
                  { key: 'email', label: '邮箱', sortable: false }
                ]
                
                const data = [
                  { name: '张三', age: 25, email: 'zhangsan@example.com' },
                  { name: '李四', age: 30, email: 'lisi@example.com' },
                  { name: '王五', age: 28, email: 'wangwu@example.com' }
                ]
                
                const table = new MaterialTable(container as any)
                table.setColumns(columns)
                table.setData(data)
                table.setPagination(true)
                table.setPageSize(10)
                table.setSortable(true)
                table.setDense(false)
                table.setElevation(2)
                const element = container.render()
                demoArea.value.appendChild(element)
              } catch (error) {
                console.error('创建Material表格演示失败:', error)
                demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          }
        ]
      },
      {
        name: 'Material导航',
        expanded: false,
        children: [
          {
            id: 'material-menu-bar',
            title: 'Material菜单栏',
            description: 'Material Design风格的菜单栏组件',
            code: `// Material菜单栏示例
import { MaterialMenuBar, MenuBarLayoutType } from 'nhai-framework'

// 创建菜单栏
const menuBar = new MaterialMenuBar({
  layout: MenuBarLayoutType.HORIZONTAL,
  elevation: 2,
  dense: false,
  items: [
    {
      label: '文件',
      type: 'SUBMENU',
      children: [
        { label: '新建', type: 'ITEM' },
        { label: '打开', type: 'ITEM' },
        { label: '保存', type: 'ITEM' },
        { label: 'SEPARATOR' },
        { label: '退出', type: 'ITEM' }
      ]
    },
    {
      label: '编辑',
      type: 'SUBMENU',
      children: [
        { label: '撤销', type: 'ITEM' },
        { label: '重做', type: 'ITEM' }
      ]
    },
    { label: '视图', type: 'ITEM' },
    { label: '帮助', type: 'ITEM' }
  ]
})

// 添加到容器
const container = document.createElement('div')
container.appendChild(menuBar.render())`,
            createDemo: () => {
              if (!demoArea.value) return
              
              try {
                const container = NHAIObjectFactory.createContainer()
                container.setStyle({ width: '100%' })
                
                // 创建Material菜单栏
                const menuBar = new MaterialMenuBar(container as any)
                menuBar.setLayout(MenuBarLayoutType.HORIZONTAL)
                menuBar.setElevation(2)
                menuBar.setDense(false)
                menuBar.setItems([
                  {
                    label: '文件',
                    type: 'SUBMENU',
                    children: [
                      { label: '新建', type: 'ITEM' },
                      { label: '打开', type: 'ITEM' },
                      { label: '保存', type: 'ITEM' },
                      { type: 'SEPARATOR' },
                      { label: '退出', type: 'ITEM' }
                    ]
                  },
                  {
                    label: '编辑',
                    type: 'SUBMENU',
                    children: [
                      { label: '撤销', type: 'ITEM' },
                      { label: '重做', type: 'ITEM' }
                    ]
                  },
                  { label: '视图', type: 'ITEM' },
                  { label: '帮助', type: 'ITEM' }
                ])
                const element = container.render()
                demoArea.value.appendChild(element)
              } catch (error) {
                console.error('创建Material菜单栏演示失败:', error)
                demoArea.value.innerHTML = `<div style="color: red; padding: 20px;">演示创建失败: ${error}</div>`
              }
            }
          }
        ]
      }
    ]
  }
])

// 方法
const switchFramework = async (framework: string) => {
  try {
    console.log('切换到框架: ' + framework)
    currentFramework.value = framework
    
    // 根据选择的框架注册对应的适配器
    switch (framework) {
      case 'vanilla':
        NHAIFrameworkRegistry.register(new VanillaAdapter())
        NHAIFrameworkRegistry.use('vanilla')
        adapterRegistered.value = true
        console.log('✓ 已切换到原生JavaScript适配器')
        break
        
      case 'vue':
        NHAIFrameworkRegistry.register(new VueAdapter())
        NHAIFrameworkRegistry.use('vue')
        adapterRegistered.value = true
        console.log('✓ 已切换到Vue适配器')
        break
        
      case 'react':
        NHAIFrameworkRegistry.register(new ReactAdapter())
        NHAIFrameworkRegistry.use('react')
        adapterRegistered.value = true
        console.log('✓ 已切换到React适配器')
        break
        
      case 'svelte':
        NHAIFrameworkRegistry.register(new SvelteAdapter())
        NHAIFrameworkRegistry.use('svelte')
        adapterRegistered.value = true
        console.log('✓ 已切换到Svelte适配器')
        break
        
      default:
        console.warn('未知的框架: ' + framework)
        return
    }
    
    // 重新渲染当前示例
    if (currentExampleData.value) {
      createDemo()
    }
    
  } catch (error) {
    console.error('切换框架失败:', error)
    adapterRegistered.value = false
    // 如果切换失败，回退到vanilla适配器
    try {
      NHAIFrameworkRegistry.register(new VanillaAdapter())
      NHAIFrameworkRegistry.use('vanilla')
      currentFramework.value = 'vanilla'
      adapterRegistered.value = true
      console.log('已回退到原生JavaScript适配器')
    } catch (fallbackError) {
      console.error('回退适配器也失败了:', fallbackError)
      adapterRegistered.value = false
    }
  }
}

const toggleCategory = (category: any) => {
  category.expanded = !category.expanded
}

const toggleComponentType = (componentType: any) => {
  componentType.expanded = !componentType.expanded
}

const selectExample = async (item: any) => {
  console.log('选择示例:', item)
  currentExampleId.value = item.id
  currentExampleData.value = item
  
  // 确保切换到示例预览模式
  currentMode.value = 'examples'
  
  // 等待DOM更新完成
  await nextTick()
  
  // 执行示例演示
  createDemo()
  
  console.log('示例选择完成，当前模式:', currentMode.value)
}

const createDemo = () => {
  console.log('开始创建演示...')
  
  // 检查适配器是否已注册
  if (!adapterRegistered.value) {
    console.log('适配器未注册，等待初始化...')
    // 等待适配器注册完成
    setTimeout(() => {
      if (adapterRegistered.value) {
        console.log('适配器已注册，重新执行演示')
        createDemo()
      } else {
        console.error('适配器注册超时')
        if (demoArea.value) {
          demoArea.value.innerHTML = '<div style="color: red; padding: 20px;">适配器未初始化，请刷新页面重试</div>'
        }
      }
    }, 100)
    return
  }
  
  // 检查DOM元素是否准备好
  if (!demoArea.value) {
    console.log('DOM元素未准备好，等待...')
    setTimeout(() => {
      if (demoArea.value) {
        console.log('DOM元素已准备好，重新执行演示')
        createDemo()
      } else {
        console.error('DOM元素准备超时')
      }
    }, 50)
    return
  }
  
  if (currentExampleData.value && currentExampleData.value.createDemo) {
    console.log('找到演示函数，开始执行')
    currentExampleData.value.createDemo()
    console.log('演示函数执行完成')
  } else {
    console.log('没有找到演示函数')
  }
}

const copyCode = () => {
  if (currentExampleData.value) {
    navigator.clipboard.writeText(currentExampleData.value.code).then(() => {
      alert('代码已复制到剪贴板')
    }).catch(() => {
      alert('复制失败，请手动复制')
    })
  }
}

// 模式切换
const switchMode = (mode: string) => {
  currentMode.value = mode
}

// 拖拽事件处理
const onDragStart = (event: DragEvent, component: any) => {
  if (!event.dataTransfer) return
  
  // 设置文本数据供NHAIComponentComposer使用
  event.dataTransfer.setData('text/plain', component.id)
  
  // 同时设置JSON数据供其他用途
  event.dataTransfer.setData('application/json', JSON.stringify({
    componentId: component.id,
    factory: component.factory,
    props: component.defaultProps
  }))
  
  event.dataTransfer.effectAllowed = 'copy'
  
  // 添加拖拽样式
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '0.5'
  }
  
  // 选中拖拽的组件
  selectComponent(component.id, component.defaultProps)
}

const onDragEnd = (event: DragEvent) => {
  // 恢复拖拽样式
  if (event.target instanceof HTMLElement) {
    event.target.style.opacity = '1'
  }
}

// 组件选择处理
const selectComponent = (componentType: string, componentData?: any) => {
  selectedComponentType.value = componentType
  selectedComponent.value = componentData || {}
  console.log('选中组件:', componentType, componentData)
}

// 更新组件属性
const updateComponentProperty = (key: string, value: any) => {
  if (selectedComponent.value) {
    // 使用响应式更新方式
    selectedComponent.value = {
      ...selectedComponent.value,
      [key]: value
    }
    console.log('更新组件属性:', key, value)
    console.log('更新后的selectedComponent:', selectedComponent.value)
  }
}

// 更新组件缩放
const updateComponentScale = (scale: number) => {
  if (selectedComponent.value && selectedComponentId.value) {
    // 更新selectedComponent中的缩放值
    selectedComponent.value = {
      ...selectedComponent.value,
      scale: scale
    }
    
    // 获取FreeDesign组件的composer实例
    const composer = freeDesignRef.value?.getComposer()
    if (composer) {
      // 更新组件的缩放变换
      composer.updateComponentTransform(selectedComponentId.value, { scale })
      console.log('组件缩放已更新:', scale)
    }
  }
}

// 设置预设缩放值
const setScale = (scale: number) => {
  updateComponentScale(scale)
}

// 全屏编辑功能
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const exitFullscreen = () => {
  isFullscreen.value = false
  document.body.style.overflow = ''
}

// 添加新组件类型
const openAddComponentDialog = () => {
  showAddComponentDialog.value = true
  newComponentType.value = ''
  newComponentName.value = ''
  newComponentFactory.value = ''
  newComponentCategory.value = '基础控件'
}

const closeAddComponentDialog = () => {
  showAddComponentDialog.value = false
}

const addNewComponent = () => {
  if (!newComponentType.value || !newComponentName.value || !newComponentFactory.value) {
    alert('请填写完整信息')
    return
  }
  
  // 查找或创建分类
  let category = componentLibrary.value.find(c => c.category === newComponentCategory.value)
  
  if (!category) {
    // 创建新分类
    category = {
      category: newComponentCategory.value,
      icon: 'icon-custom',
      components: []
    }
    componentLibrary.value.push(category)
  }
  
  // 添加新组件
  category.components.push({
    id: newComponentType.value,
    name: newComponentName.value,
    icon: 'icon-custom',
    description: '自定义组件',
    factory: newComponentFactory.value,
    defaultProps: {}
  })
  
  console.log('新组件已添加:', newComponentType.value)
  closeAddComponentDialog()
}

// 获取所有组件ID列表
const getAllComponentIds = () => {
  const ids: string[] = []
  componentLibrary.value.forEach(category => {
    category.components.forEach(component => {
      ids.push(component.id)
    })
  })
  return ids
}

// 获取组件类别列表
const getComponentCategories = () => {
  return componentLibrary.value.map(c => c.category)
}

// 获取当前组件的属性配置
const getCurrentComponentProperties = () => {
  return componentProperties[selectedComponentType.value as keyof typeof componentProperties] || null
}

// 应用属性到组件
const applyProperties = () => {
  if (selectedComponent.value && selectedComponentType.value && selectedComponentId.value) {
    console.log('应用属性到组件:', selectedComponentType.value, selectedComponent.value)
    
    // 获取FreeDesign组件的composer实例
    const composer = freeDesignRef.value?.getComposer()
    if (composer) {
      console.log('更新组件属性:', selectedComponentId.value, selectedComponent.value)
      
      // 调用NHAIComponentComposer的API更新组件属性
      composer.updateComponentProps(selectedComponentId.value, selectedComponent.value)
      
      console.log('✓ 属性已应用到组件')
    } else {
      console.error('无法获取composer实例')
    }
  } else {
    console.warn('缺少必要的组件信息:', {
      selectedComponent: !!selectedComponent.value,
      selectedComponentType: !!selectedComponentType.value,
      selectedComponentId: !!selectedComponentId.value
    })
  }
}

// 重置属性
const resetProperties = () => {
  if (selectedComponentType.value) {
    const config = getCurrentComponentProperties()
    if (config) {
      selectedComponent.value = {}
      config.properties.forEach(prop => {
        selectedComponent.value[prop.key] = prop.default
      })
      console.log('属性已重置:', selectedComponent.value)
    }
  }
}

// 加载示例代码到在线编辑器
const loadToEditor = () => {
  if (currentExampleData.value) {
    // 复制示例代码到编辑器
    editorCode.value = currentExampleData.value.code
    // 切换到在线编辑模式
    currentMode.value = 'editor'
    
    console.log('示例代码已加载到在线编辑器')
  }
}

// 编辑器事件处理（保留用于示例加载）
const onCodeChange = (code: string) => {
  editorCode.value = code
}

const onCodeRun = async (code: string) => {
  // 新的在线编辑器会处理代码执行
  console.log('代码执行已移至新的在线编辑器组件')
}

const onPreviewClear = () => {
  executionError.value = ''
}

const onPreviewRefresh = () => {
  // 新的在线编辑器会处理刷新
  console.log('预览刷新已移至新的在线编辑器组件')
}

onMounted(async () => {
  console.log('App.vue mounted, 注册适配器...')
  try {
    // 使用 nextTick 确保 DOM 完全渲染
    await nextTick()
    
    NHAIFrameworkRegistry.register(new VanillaAdapter())
    NHAIFrameworkRegistry.use('vanilla')
    adapterRegistered.value = true
    console.log('✓ 适配器注册成功')
    
    // 将 NHAIObjectFactory、ModernNHAIButton 和 NHAIComponentComposer 暴露到全局作用域
    ;(window as any).NHAIObjectFactory = NHAIObjectFactory
    ;(window as any).ModernNHAIButton = ModernNHAIButton
    ;(window as any).NHAIComponentComposer = NHAIComponentComposer
    console.log('✓ NHAIObjectFactory、ModernNHAIButton 和 NHAIComponentComposer 已暴露到全局作用域')
    
    // 监听组件选择事件
    window.addEventListener('componentSelected', (event: any) => {
      console.log('App.vue 收到组件选择事件:', event.detail)
      const { componentId, componentData, component } = event.detail
      
      console.log('componentId:', componentId)
      console.log('componentData:', componentData)
      console.log('component:', component)
      console.log('component.id:', component?.id)
      
      // 更新属性面板
      selectedComponentType.value = componentId
      
      // 只在第一次选择或选择不同组件时更新selectedComponent
      if (!selectedComponentId.value || selectedComponentId.value !== component?.id) {
        selectedComponent.value = { ...componentData }
        console.log('首次选择组件，更新selectedComponent')
      } else {
        console.log('重复选择同一组件，保持selectedComponent不变')
      }
      
      selectedComponentId.value = component?.id || ''
      
      console.log('属性面板已更新:', selectedComponentType.value, selectedComponent.value, '组件ID:', selectedComponentId.value)
    })
    
    // 监听组件取消选择事件
    window.addEventListener('componentDeselected', (event: any) => {
      console.log('App.vue 收到组件取消选择事件')
      
      // 清空属性面板
      selectedComponentType.value = ''
      selectedComponent.value = {}
      selectedComponentId.value = ''
      
      console.log('属性面板已清空')
    })
    
    // 测试按钮创建
    console.log('测试按钮创建...')
    const testButton = NHAIObjectFactory.createButton('测试按钮')
    console.log('✓ 测试按钮创建成功:', testButton)
    
    // 测试按钮渲染
    console.log('测试按钮渲染...')
    const testElement = testButton.render()
    console.log('✓ 测试按钮渲染成功:', testElement)
    
    console.log('✓ 初始化完成，可以开始使用演示')
    
  } catch (error) {
    console.error('❌ 适配器注册失败:', error)
    adapterRegistered.value = false
  }
})
</script>

<style scoped>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部导航栏 */
.app-header {
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-left .logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-left .logo .tagline {
  font-size: 12px;
  color: #6b7280;
  margin-left: 8px;
}

.header-center .mode-tabs {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
}

.mode-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.mode-tab:hover {
  color: #374151;
  background: rgba(255, 255, 255, 0.5);
}

.mode-tab.active {
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.framework-selector select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: #fef2f2;
  color: #dc2626;
}

.status-indicator.active {
  background: #f0fdf4;
  color: #16a34a;
}

.status-icon::before {
  content: '●';
  font-size: 8px;
}

/* 主布局 */
.main-layout {
  flex: 1;
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
}

/* 左侧面板 */
.left-panel {
  width: 280px;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.left-panel.collapsed {
  width: 60px;
  transition: width 0.3s ease;
}

.left-panel.collapsed .panel-header {
  padding: 0 14px;
  justify-content: center;
}

.left-panel.collapsed .panel-header h3 {
  display: none;
}

.left-panel.collapsed .collapse-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.panel-header {
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  transition: all 0.3s ease;
}

.panel-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%);
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-header h3::before {
  content: '🧩';
  font-size: 16px;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.collapse-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.collapse-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.collapse-btn:hover::before {
  left: 100%;
}

.collapse-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
}

.panel-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
}

/* 组件树样式 */
.component-tree {
  font-size: 15px;
}

.tree-category {
  margin-bottom: 10px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.category-header:hover {
  background: #f3f4f6;
}

.expand-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6b7280;
  transition: transform 0.2s;
}

.expand-icon::before {
  content: '▶';
}

.expand-icon.expanded::before {
  content: '▼';
}

.category-name {
  font-weight: 700;
  color: #374151;
  font-size: 14px;
}

.category-items {
  margin-left: 18px;
  margin-top: 6px;
}

.component-type-header {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  font-size: 13px;
}

.component-type-header:hover {
  background: #f3f4f6;
}

.component-type-name {
  font-weight: 600;
  color: #4b5563;
  margin-right: 10px;
}

.component-count {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 3px 8px;
  border-radius: 12px;
}

.component-examples {
  margin-left: 18px;
  margin-top: 6px;
}

.tree-item {
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  margin-bottom: 3px;
}

.tree-item:hover {
  background: #f3f4f6;
}

.tree-item.active {
  background: #dbeafe;
  color: #1d4ed8;
}

.item-title {
  display: block;
  font-weight: 600;
  color: inherit;
  margin-bottom: 3px;
  font-size: 14px;
}

.item-description {
  display: block;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

/* 组件调色板 */
.component-palette {
  font-size: 15px;
}

.palette-section {
  margin-bottom: 24px;
}

.palette-section h4 {
  margin: 0 0 16px 0;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.1);
}

.palette-section h4::before {
  content: '📦';
  font-size: 14px;
}

.palette-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.palette-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  cursor: grab;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.palette-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.palette-item:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.palette-item:hover::before {
  opacity: 1;
}

.palette-item:active {
  cursor: grabbing;
  transform: translateY(0);
}

.palette-item i {
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.palette-item span {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  line-height: 1.3;
  position: relative;
  z-index: 2;
}

.component-description {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.3;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 主工作区 */
.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

.workspace-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 示例视图 */
.example-view {
  max-width: 1200px;
  margin: 0 auto;
}

.example-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.example-info h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.example-info p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.example-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.action-btn.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.demo-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.framework-badge {
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.demo-area {
  min-height: 200px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-section {
  margin-bottom: 32px;
}

.code-header h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.code-content pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

/* 欢迎视图 */
.welcome-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.welcome-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.welcome-content {
  text-align: center;
  max-width: 1200px;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

/* Hero Section */
.welcome-hero {
  margin-bottom: 80px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 16px;
}

.hero-title {
  margin: 0 0 16px 0;
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  display: block;
  font-size: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8px;
}

.hero-description {
  margin: 0 0 40px 0;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Features Section */
.features-section {
  margin-bottom: 80px;
}

.section-title {
  margin: 0 0 48px 0;
  font-size: 36px;
  font-weight: 700;
  color: white;
  text-align: center;
}

.feature-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.feature-card {
  flex: 0 0 calc(33.333% - 16px);
  min-width: 280px;
  max-width: 320px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 0;
  position: relative;
  z-index: 2;
}

.feature-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover .feature-glow {
  opacity: 1;
}

.feature-card h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.feature-card p {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.feature-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

/* Quick Start Section */
.quick-start-section {
  margin-bottom: 40px;
}

.quick-start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.quick-start-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 auto 16px auto;
}

.quick-start-card h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.quick-start-card p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* 右侧面板 */
.right-panel {
  width: 300px;
  background: #f9fafb;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.close-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #6b7280;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* 属性面板内容 */
.property-section {
  padding: 16px;
}

.property-section h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.design-properties {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.property-group label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.property-group input,
.property-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  transition: border-color 0.2s;
}

.property-group input:focus,
.property-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.property-group input[type="color"] {
  height: 40px;
  padding: 4px;
  cursor: pointer;
}

.property-group input[type="number"] {
  text-align: right;
}

/* 未选择组件时的提示 */
.no-selection {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.no-selection-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-selection p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* 选中组件信息 */
.selected-component-info {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.selected-component-info h5 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.component-type {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 布尔值输入样式 */
.boolean-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* 属性操作按钮 */
.property-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
}

.property-actions .action-btn {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .left-panel {
    width: 240px;
  }
  
  .right-panel {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
  }
  
  .header-center .mode-tabs {
    gap: 2px;
  }
  
  .mode-tab {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .left-panel {
    width: 200px;
  }
  
  .workspace-content {
    padding: 16px;
  }
  
  .example-toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .example-actions {
    justify-content: flex-end;
  }
  
  .feature-grid {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-card {
    flex: none;
    width: 100%;
    max-width: 400px;
  }
}

@media (max-width: 640px) {
  .main-layout {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .left-panel.collapsed {
    width: 100%;
    height: 60px;
  }
  
  .panel-content {
    padding: 12px;
  }
  
  .palette-items {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 图标样式 */
.icon-play::before { 
  content: '▶'; 
  font-size: 14px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.icon-design::before { 
  content: '🎨'; 
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.icon-code::before { 
  content: '💻'; 
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.icon-component::before { 
  content: '🧩'; 
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.icon-collapse::before { 
  content: '◀'; 
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.icon-expand::before { 
  content: '▶'; 
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.icon-close::before { 
  content: '✕'; 
  font-size: 14px;
  font-weight: bold;
  color: #6b7280;
  transition: all 0.3s ease;
}

/* 图标悬停效果 */
.icon-close:hover::before {
  color: #ef4444;
  transform: scale(1.1);
}

.icon-collapse:hover::before,
.icon-expand:hover::before {
  transform: scale(1.1);
}

/* 图标动画效果 */
@keyframes iconPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.icon-design:hover::before,
.icon-code:hover::before,
.icon-component:hover::before {
  animation: iconPulse 0.6s ease-in-out;
}

/* 缩放控制样式 */
.scale-control {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.scale-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scale-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.scale-range {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.scale-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #1890ff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.scale-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #1890ff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.scale-value {
  min-width: 50px;
  text-align: center;
  font-weight: 600;
  color: #1890ff;
  font-size: 14px;
}

.scale-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.scale-btn {
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scale-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.scale-btn:active {
  background: #e5e7eb;
  transform: translateY(1px);
}

.scale-btn.active {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

/* 全屏编辑样式 */
.fullscreen-mode {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
  background: white !important;
}

.fullscreen-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fullscreen-toolbar h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.design-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.design-toolbar h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.btn-icon:hover {
  border-color: #1890ff;
  color: #1890ff;
  background: #f0f8ff;
}

.btn-icon i {
  font-size: 16px;
}

/* 全屏模式下的FreeDesign组件 */
.fullscreen-mode .free-design-container {
  margin-top: 60px;
  height: calc(100vh - 60px) !important;
}

/* 图标样式 */
.icon-fullscreen::before {
  content: '⛶';
}

.icon-exit-fullscreen::before {
  content: '⛷';
}

.icon-add::before {
  content: '+';
}

/* 组件调色板头部 */
.palette-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

.palette-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.btn-add-component {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-add-component:hover {
  background: #40a9ff;
}

.btn-add-component:active {
  background: #096dd9;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.dialog-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel {
  padding: 8px 16px;
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>