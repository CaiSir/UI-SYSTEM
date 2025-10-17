import type { Category, Framework } from '../types'

// 支持的框架配置
export const frameworks: Framework[] = [
  { name: 'vanilla', label: '原生 JavaScript' },
  { name: 'vue', label: 'Vue.js' },
  { name: 'react', label: 'React' },
  { name: 'svelte', label: 'Svelte' }
]

// 框架切换函数
export const switchFramework = async (framework: string) => {
  try {
    console.log('切换到框架: ' + framework)
    
    // 根据选择的框架注册对应的适配器
    switch (framework) {
      case 'vanilla':
        (window as any).NHAIFrameworkRegistry.register(new (window as any).VanillaAdapter())
        ;(window as any).NHAIFrameworkRegistry.use('vanilla')
        console.log('✓ 已切换到原生JavaScript适配器')
        break
        
      case 'vue':
        (window as any).NHAIFrameworkRegistry.register(new (window as any).VueAdapter())
        ;(window as any).NHAIFrameworkRegistry.use('vue')
        console.log('✓ 已切换到Vue适配器')
        break
        
      case 'react':
        (window as any).NHAIFrameworkRegistry.register(new (window as any).ReactAdapter())
        ;(window as any).NHAIFrameworkRegistry.use('react')
        console.log('✓ 已切换到React适配器')
        break
        
      case 'svelte':
        (window as any).NHAIFrameworkRegistry.register(new (window as any).SvelteAdapter())
        ;(window as any).NHAIFrameworkRegistry.use('svelte')
        console.log('✓ 已切换到Svelte适配器')
        break
        
      default:
        console.warn('未知的框架: ' + framework)
        return
    }
    
    return true
  } catch (error) {
    console.error('切换框架时出错:', error)
    return false
  }
}

// 树形目录操作函数
export const toggleCategory = (category: Category) => {
  category.expanded = !category.expanded
}

export const toggleComponentType = (componentType: any) => {
  componentType.expanded = !componentType.expanded
}

// 示例选择函数
export const selectExample = async (item: any, currentExampleId: any, currentExampleData: any, currentMode: any, createDemo: () => void) => {
  console.log('选择示例:', item)
  currentExampleId.value = item.id
  currentExampleData.value = item
  
  // 确保切换到示例预览模式
  currentMode.value = 'examples'
  
  // 等待DOM更新完成
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // 执行示例演示
  createDemo()
  
  console.log('示例选择完成，当前模式:', currentMode.value)
}

// 代码复制函数
export const copyCode = (currentExampleData: any) => {
  if (currentExampleData.value) {
    navigator.clipboard.writeText(currentExampleData.value.code).then(() => {
      alert('代码已复制到剪贴板')
    }).catch(() => {
      alert('复制失败，请手动复制')
    })
  }
}

// 模式切换函数
export const switchMode = (mode: string, currentMode: any) => {
  currentMode.value = mode
}

// 加载示例代码到在线编辑器
export const loadToEditor = (currentExampleData: any, editorCode: any, currentMode: any) => {
  if (currentExampleData.value) {
    // 复制示例代码到编辑器
    editorCode.value = currentExampleData.value.code
    // 切换到在线编辑模式
    currentMode.value = 'editor'
    
    console.log('示例代码已加载到在线编辑器')
  }
}
