// 组件创建工厂 Composable
import { markRaw, nextTick } from 'vue'
import {
  NhaiButtonCommand,
  NhaiInputCommand,
  NhaiSelectCommand,
  NhaiSwitchCommand,
  NhaiCheckboxCommand,
  NhaiCardCommand,
  NhaiDialogCommand,
  NhaiGridCommand,
  NhaiContainerCommand,
  NhaiSplitPanelCommand,
  NhaiWidgetCommand,
} from '../../components'
import type { CanvasComponent } from '../types/designer'

/**
 * 创建子组件实例（用于添加到对话框、布局组件等容器中）
 */
export async function createChildComponentInstance(compDef: any): Promise<{ instance: any } | null> {
  let instance: any

  switch (compDef.type) {
    case 'button':
      instance = new NhaiButtonCommand(`按钮`)
      instance.setType('primary')
      break
    case 'input':
      instance = new NhaiInputCommand()
      instance.setPlaceholder('请输入')
      break
    case 'select':
      instance = new NhaiSelectCommand()
      instance.setOptions([
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' }
      ])
      break
    case 'switch':
      instance = new NhaiSwitchCommand(false)
      instance.setActiveText('开')
      instance.setInactiveText('关')
      break
    case 'checkbox':
      instance = new NhaiCheckboxCommand('复选框')
      break
    case 'card':
      instance = new NhaiCardCommand('卡片标题', '卡片内容')
      break
    case 'grid':
      // 作为子控件时，不设置固定样式，让它能自适应父容器
      instance = new NhaiGridCommand({ container: true, columns: 12, spacing: 2 })
      break
    case 'container':
      instance = new NhaiContainerCommand()
      instance.setMaxWidth('lg')
      break
    case 'splitpanel':
      instance = new NhaiSplitPanelCommand()
      break
    case 'widget':
      instance = new NhaiWidgetCommand('窗口标题')
      instance.setWidth('800px')
      instance.setHeight('600px')
      instance.setPosition(100, 100)
      break
    default:
      return null
  }

  // 渲染组件（Widget 在 createComponent 中单独处理）
  if (compDef.type !== 'widget') {
    instance.render()
  }

  return { instance }
}

/**
 * 创建画布组件
 */
export async function createCanvasComponent(
  compDef: any,
  x: number,
  y: number,
  canvasComponents: CanvasComponent[]
): Promise<CanvasComponent> {
  const id = `${compDef.type}-${Date.now()}`
  let instance: any
  let element: HTMLElement

  // 根据组件类型创建实例和元素
  const result = await createComponentElement(compDef, id, canvasComponents)
  instance = result.instance
  element = result.element

  // 从实例获取属性值
  const props = extractPropsFromInstance(instance, compDef.type)

  // 设置初始样式
  let initialStyle: any = {
    position: 'absolute',
    left: x + 'px',
    top: y + 'px',
  }

  if (compDef.type === 'container') {
    initialStyle.width = '800px'
    initialStyle.height = '600px'
  }

  if (compDef.type === 'widget') {
    initialStyle = {
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
    }
  }

  const comp: CanvasComponent = {
    id,
    type: compDef.type,
    instance: markRaw(instance),
    element: markRaw(element),
    props,
    style: initialStyle
  }

  // 存储特定类型的实例引用
  if (compDef.type === 'dialog' && instance instanceof NhaiDialogCommand) {
    comp.dialogInstance = instance as any
  }
  if (compDef.type === 'grid' && instance instanceof NhaiGridCommand) {
    comp.gridInstance = instance as any
  }
  if (compDef.type === 'container' && instance instanceof NhaiContainerCommand) {
    comp.containerInstance = instance as any
  }
  if (compDef.type === 'widget' && instance instanceof NhaiWidgetCommand) {
    comp.widgetInstance = instance as any
  }

  return comp
}

/**
 * 创建组件元素
 */
async function createComponentElement(
  compDef: any,
  id: string,
  canvasComponents: CanvasComponent[]
): Promise<{ instance: any; element: HTMLElement }> {
  let instance: any
  let element: HTMLElement

  switch (compDef.type) {
    case 'button':
      instance = new NhaiButtonCommand(`按钮${canvasComponents.length + 1}`)
      instance.setType('primary')
      element = instance.render()
      break
    case 'input':
      instance = new NhaiInputCommand()
      instance.setPlaceholder('请输入')
      element = instance.render()
      break
    case 'select':
      instance = new NhaiSelectCommand()
      instance.setOptions([
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' }
      ])
      element = instance.render()
      break
    case 'switch':
      instance = new NhaiSwitchCommand(false)
      instance.setActiveText('开')
      instance.setInactiveText('关')
      element = instance.render()
      break
    case 'checkbox':
      instance = new NhaiCheckboxCommand('复选框')
      element = instance.render()
      break
    case 'card':
      instance = new NhaiCardCommand('卡片标题', '卡片内容')
      element = instance.render()
      break
    case 'grid':
      instance = new NhaiGridCommand({ container: true, columns: 12, spacing: 2 })
      instance.setStyle({
        minWidth: '200px',
        minHeight: '100px',
        width: 'auto',
        height: 'auto'
      } as Partial<CSSStyleDeclaration>)
      element = instance.render()
      element.setAttribute('data-id', id)
      if (element && element.style) {
        element.style.minWidth = '200px'
        element.style.minHeight = '100px'
      }
      break
    case 'container':
      instance = new NhaiContainerCommand()
      instance.setMaxWidth('lg')
      instance.setStyle({ width: '800px', height: '600px' } as Partial<CSSStyleDeclaration>)
      element = instance.render()
      element.setAttribute('data-id', id)
      if (element && element.style) {
        element.style.width = '800px'
        element.style.height = '600px'
      }
      break
    case 'splitpanel':
      instance = new NhaiSplitPanelCommand()
      element = instance.render()
      break
    case 'widget':
      instance = new NhaiWidgetCommand('窗口标题')
      instance.setWidth('800px')
      instance.setHeight('600px')
      instance.setPosition(100, 100)
      element = instance.render()
      element.setAttribute('data-id', id)
      nextTick(() => {
        if (element) {
          const widgetRoot = element.querySelector('.nhai-widget') as HTMLElement
          if (widgetRoot) {
            widgetRoot.style.position = 'relative'
            widgetRoot.style.top = 'auto'
            widgetRoot.style.left = 'auto'
          }
        }
      })
      break
    case 'dialog':
      return createDialogElement(id)
    default:
      element = document.createElement('div')
      instance = null
  }

  return { instance, element }
}

/**
 * 创建对话框元素
 */
function createDialogElement(id: string): { instance: any; element: HTMLElement } {
  const instance = new NhaiDialogCommand('对话框标题', '')
  
  const element = document.createElement('div')
  element.className = 'dialog-window'
  element.setAttribute('data-id', id)
  element.style.cssText = `
    width: 500px;
    min-height: 300px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `
  
  // 对话框头部
  const header = document.createElement('div')
  header.className = 'dialog-window-header'
  header.style.cssText = `
    padding: 16px 20px;
    border-bottom: 1px solid #e4e7ed;
    background: #fafafa;
    font-weight: 600;
    font-size: 16px;
    color: #303133;
    cursor: grab;
    user-select: none;
    position: relative;
  `
  header.textContent = '对话框标题'
  
  // 关闭按钮
  const closeBtn = document.createElement('span')
  closeBtn.className = 'dialog-window-close'
  closeBtn.innerHTML = '×'
  closeBtn.style.cssText = `
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #ff4d4f;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
  `
  header.appendChild(closeBtn)
  element.appendChild(header)
  
  // 对话框内容区域
  const bodyDiv = document.createElement('div')
  bodyDiv.className = 'dialog-content-area'
  bodyDiv.style.cssText = `
    flex: 1;
    padding: 20px;
    min-height: 200px;
    position: relative;
    background: #ffffff;
  `
  bodyDiv.setAttribute('data-droppable', 'true')
  
  // 占位符
  const placeholder = document.createElement('div')
  placeholder.className = 'dialog-placeholder'
  placeholder.textContent = '从左侧拖拽组件到这里'
  placeholder.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #c0c4cc;
    font-size: 14px;
    pointer-events: none;
  `
  bodyDiv.appendChild(placeholder)
  element.appendChild(bodyDiv)
  
  // 对话框底部
  const footer = document.createElement('div')
  footer.className = 'dialog-window-footer'
  footer.style.cssText = `
    padding: 12px 20px;
    border-top: 1px solid #ebeef5;
    background: #fafafa;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  `
  const cancelBtn = document.createElement('button')
  cancelBtn.textContent = '取消'
  cancelBtn.style.cssText = `
    padding: 8px 16px;
    border: 1px solid #dcdfe6;
    background: white;
    border-radius: 4px;
    cursor: pointer;
  `
  const confirmBtn = document.createElement('button')
  confirmBtn.textContent = '确定'
  confirmBtn.style.cssText = `
    padding: 8px 16px;
    border: none;
    background: #409eff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  `
  footer.appendChild(cancelBtn)
  footer.appendChild(confirmBtn)
  element.appendChild(footer)
  
  return { instance, element }
}

/**
 * 从实例中提取属性
 */
function extractPropsFromInstance(instance: any, type: string): any {
  const props: any = {}

  switch (type) {
    case 'button':
      if (instance.text !== undefined) props.text = instance.text
      if (instance.type !== undefined) props.type = instance.type
      if (instance.size !== undefined) props.size = instance.size
      if ((instance as any).circle !== undefined) props.circle = (instance as any).circle
      if ((instance as any).icon !== undefined) props.icon = (instance as any).icon
      if (instance.disabled !== undefined) props.disabled = instance.disabled
      if (instance.loading !== undefined) props.loading = instance.loading
      if (instance.plain !== undefined) props.plain = instance.plain
      if (instance.round !== undefined) props.round = instance.round
      break
    case 'input':
      const inputInstance = instance as any
      if (inputInstance._options) {
        Object.assign(props, inputInstance._options)
      }
      break
    case 'select':
      const selectInstance = instance as any
      if (selectInstance.placeholder !== undefined) props.placeholder = selectInstance.placeholder
      if (selectInstance.disabled !== undefined) props.disabled = selectInstance.disabled
      if (selectInstance.clearable !== undefined) props.clearable = selectInstance.clearable
      if (selectInstance.multiple !== undefined) props.multiple = selectInstance.multiple
      if (selectInstance.size !== undefined) props.size = selectInstance.size
      break
    case 'switch':
      const switchInstance = instance as any
      if (switchInstance.value !== undefined) props.value = switchInstance.value
      if (switchInstance.activeText !== undefined) props.activeText = switchInstance.activeText
      if (switchInstance.inactiveText !== undefined) props.inactiveText = switchInstance.inactiveText
      if (switchInstance.activeColor !== undefined) props.activeColor = switchInstance.activeColor
      if (switchInstance.inactiveColor !== undefined) props.inactiveColor = switchInstance.inactiveColor
      if (switchInstance.size !== undefined) props.size = switchInstance.size
      if (switchInstance.disabled !== undefined) props.disabled = switchInstance.disabled
      break
    case 'checkbox':
      const checkboxInstance = instance as any
      if (checkboxInstance.text !== undefined) props.text = checkboxInstance.text
      if (checkboxInstance.value !== undefined) props.value = checkboxInstance.value
      if (checkboxInstance.size !== undefined) props.size = checkboxInstance.size
      if (checkboxInstance.disabled !== undefined) props.disabled = checkboxInstance.disabled
      if (checkboxInstance.indeterminate !== undefined) props.indeterminate = checkboxInstance.indeterminate
      break
    case 'card':
      const cardInstance = instance as any
      if (cardInstance.header !== undefined) props.header = cardInstance.header
      if (cardInstance.content !== undefined) props.content = cardInstance.content
      if (cardInstance.shadow !== undefined) props.shadow = cardInstance.shadow
      break
    case 'dialog':
      const dialogInstance = instance as any
      props.title = dialogInstance.getTitle?.() || dialogInstance.title || '对话框标题'
      props.content = dialogInstance.getContent?.() || dialogInstance.content || ''
      props.width = dialogInstance.getWidth?.() || dialogInstance.width || '500px'
      props.fullscreen = dialogInstance.fullscreen ?? false
      props.modal = dialogInstance.modal ?? true
      props.showFooter = dialogInstance.showFooter ?? false
      props.confirmText = dialogInstance.confirmText || '确定'
      props.cancelText = dialogInstance.cancelText || '取消'
      props.draggable = dialogInstance.draggable ?? false
      props.center = dialogInstance.center ?? false
      props.closeOnClickModal = dialogInstance.closeOnClickModal ?? false
      props.closeOnPressEscape = dialogInstance.closeOnPressEscape ?? true
      props.showClose = dialogInstance.showClose ?? true
      break
    case 'grid':
      const gridInstance = instance as any
      props.container = gridInstance.container ?? false
      props.spacing = gridInstance.spacing ?? 2
      props.columns = gridInstance.columns ?? 12
      props.rows = gridInstance.rows
      props.templateAreas = gridInstance.templateAreas
      props.autoFlow = gridInstance.autoFlow ?? 'row'
      props.justifyItems = gridInstance.justifyItems ?? 'stretch'
      props.alignItems = gridInstance.alignItems ?? 'stretch'
      props.justifyContent = gridInstance.justifyContent
      props.alignContent = gridInstance.alignContent
      props.gap = gridInstance.gap
      if (!props.style) props.style = {}
      props.style.width = '800px'
      props.style.height = '600px'
      break
    case 'container':
      const containerInstance = instance as any
      props.maxWidth = containerInstance.maxWidth ?? 'lg'
      props.fixed = containerInstance.fixed ?? false
      props.disableGutters = containerInstance.disableGutters ?? false
      if (!props.style) props.style = {}
      props.style.width = '800px'
      props.style.height = '600px'
      break
    case 'splitpanel':
      const splitInstance = instance as any
      props.orientation = splitInstance.orientation || 'horizontal'
      props.splitPosition = splitInstance.splitPosition ?? 50
      props.minSize = splitInstance.minSize ?? 20
      props.maxSize = splitInstance.maxSize ?? 80
      props.resizable = splitInstance.resizable ?? true
      props.disabled = splitInstance.disabled ?? false
      props.leftContent = splitInstance.leftContent
      props.rightContent = splitInstance.rightContent
      break
    case 'widget':
      const widgetInstance = instance as any
      props.title = widgetInstance.title || '窗口标题'
      props.width = widgetInstance.width || '800px'
      props.height = widgetInstance.height || '600px'
      props.fullscreen = widgetInstance.fullscreen ?? false
      props.menuBarVisible = widgetInstance.menuBarVisible ?? true
      props.canMinimize = widgetInstance.canMinimize ?? true
      props.canMaximize = widgetInstance.canMaximize ?? true
      props.canClose = widgetInstance.canClose ?? true
      props.position = widgetInstance.position || { x: 100, y: 100 }
      break
  }

  return props
}

