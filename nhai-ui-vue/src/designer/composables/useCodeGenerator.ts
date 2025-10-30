// 代码生成器 Composable
import type { CanvasComponent } from '../types/designer'
import type { Ref } from 'vue'
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

interface CodeGeneratorDependencies {
  canvasComponents: Ref<CanvasComponent[]>
  dialogChildren: Ref<Map<any, any>>
  layoutChildren?: Ref<Map<any, any>>
}

export function useCodeGenerator(deps: CodeGeneratorDependencies) {
  const { canvasComponents, dialogChildren } = deps
  // layoutChildren 目前未使用，但保留在接口中以便将来扩展

  /**
   * 生成代码
   * 完整实现从 DesignerApp.vue 3047-4310行迁移
   */
  const generateCode = (): string => {
    if (canvasComponents.value.length === 0) {
      return '// 暂无组件，请从左侧拖拽组件到画布'
    }
    
    // 收集所有需要的类
    const usedTypes = new Set(canvasComponents.value.map(c => c.type))
    const imports: string[] = []
    if (usedTypes.has('button')) imports.push('NhaiButtonCommand')
    if (usedTypes.has('input')) imports.push('NhaiInputCommand')
    if (usedTypes.has('select')) imports.push('NhaiSelectCommand')
    if (usedTypes.has('switch')) imports.push('NhaiSwitchCommand')
    if (usedTypes.has('checkbox')) imports.push('NhaiCheckboxCommand')
    if (usedTypes.has('dialog')) imports.push('NhaiDialogCommand')
    if (usedTypes.has('widget')) imports.push('NhaiWidgetCommand')
    if (usedTypes.has('card')) imports.push('NhaiCardCommand')
    if (usedTypes.has('grid')) imports.push('NhaiGridCommand')
    if (usedTypes.has('container')) imports.push('NhaiContainerCommand')
    if (usedTypes.has('splitpanel')) imports.push('NhaiSplitPanelCommand')
    
    let code = '// 复制以下代码到 showcase 的运行框中\n\n'
    code += `const { ${imports.join(', ')} } = window\n\n`
    code += 'const container = document.createElement(\'div\')\n\n'
    
    // 遍历所有组件生成代码
    canvasComponents.value.forEach((comp, index) => {
      switch (comp.type) {
        case 'button': {
          const btnText = comp.props?.text || '按钮'
          const btnType = comp.props?.type || 'primary'
          code += `const ${comp.type}${index} = new NhaiButtonCommand('${btnText}')\n`
          if (btnType !== 'primary') {
            code += `${comp.type}${index}.setType('${btnType}')\n`
          }
          if (comp.props?.size && comp.props.size !== 'default') {
            code += `${comp.type}${index}.setSize('${comp.props.size}')\n`
          }
          if (comp.props?.icon) {
            code += `${comp.type}${index}.setIcon('${comp.props.icon}')\n`
          }
          if (comp.props?.plain) {
            code += `${comp.type}${index}.setPlain(true)\n`
          }
          if (comp.props?.round) {
            code += `${comp.type}${index}.setRound(true)\n`
          }
          if (comp.props?.circle) {
            code += `${comp.type}${index}.setCircle(true)\n`
          }
          if (comp.props?.loading) {
            code += `${comp.type}${index}.setLoading(true)\n`
          }
          if (comp.props?.disabled) {
            code += `${comp.type}${index}.setDisabled(true)\n`
          }
          // 生成宽度和高度的样式设置
          const style = comp.props?.style || comp.style || {}
          if (style.width || style.height) {
            const styleProps: string[] = []
            if (style.width) styleProps.push(`width: '${style.width}'`)
            if (style.height) styleProps.push(`height: '${style.height}'`)
            if (styleProps.length > 0) {
              code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
            }
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          break
        }
        case 'input': {
          const inputProps = comp.props || {}
          code += `const ${comp.type}${index} = new NhaiInputCommand()\n`
          if (inputProps.placeholder) {
            code += `${comp.type}${index}.setPlaceholder('${inputProps.placeholder}')\n`
          }
          if (inputProps.type && inputProps.type !== 'text') {
            code += `${comp.type}${index}.setType('${inputProps.type}')\n`
          }
          if (inputProps.value) {
            code += `${comp.type}${index}.setValue('${inputProps.value}')\n`
          }
          if (inputProps.size && inputProps.size !== 'default') {
            code += `${comp.type}${index}.setSize('${inputProps.size}')\n`
          }
          if (inputProps.disabled) {
            code += `${comp.type}${index}.setDisabled(true)\n`
          }
          if (inputProps.clearable) {
            code += `${comp.type}${index}.setClearable(true)\n`
          }
          if (inputProps.showPassword) {
            code += `${comp.type}${index}.setShowPassword(true)\n`
          }
          if (inputProps.prefixIcon) {
            code += `${comp.type}${index}.configure({ prefixIcon: '${inputProps.prefixIcon}' })\n`
          }
          if (inputProps.suffixIcon) {
            code += `${comp.type}${index}.configure({ suffixIcon: '${inputProps.suffixIcon}' })\n`
          }
          if (inputProps.maxlength && inputProps.maxlength > 0) {
            code += `${comp.type}${index}.setMaxlength(${inputProps.maxlength})\n`
          }
          if (inputProps.minlength && inputProps.minlength > 0) {
            code += `${comp.type}${index}.setMinlength(${inputProps.minlength})\n`
          }
          // 生成宽度和高度的样式设置
          const inputStyle = inputProps.style || comp.style || {}
          if (inputStyle.width || inputStyle.height) {
            const styleProps: string[] = []
            if (inputStyle.width) styleProps.push(`width: '${inputStyle.width}'`)
            if (inputStyle.height) styleProps.push(`height: '${inputStyle.height}'`)
            if (styleProps.length > 0) {
              code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
            }
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          break
        }
        case 'select': {
          const selectProps = comp.props || {}
          code += `const ${comp.type}${index} = new NhaiSelectCommand()\n`
          if (selectProps.placeholder) {
            code += `${comp.type}${index}.setPlaceholder('${selectProps.placeholder}')\n`
          }
          if (selectProps.size && selectProps.size !== 'default') {
            code += `${comp.type}${index}.setSize('${selectProps.size}')\n`
          }
          if (selectProps.disabled) {
            code += `${comp.type}${index}.setDisabled(true)\n`
          }
          if (selectProps.clearable) {
            code += `${comp.type}${index}.setClearable(true)\n`
          }
          if (selectProps.multiple) {
            code += `${comp.type}${index}.setMultiple(true)\n`
          }
          if (selectProps.options && Array.isArray(selectProps.options) && selectProps.options.length > 0) {
            const optionsStr = selectProps.options.map((opt: any) => 
              `{label: '${opt.label || opt.value}', value: '${opt.value}'}`
            ).join(', ')
            code += `${comp.type}${index}.setOptions([${optionsStr}])\n`
          }
          // 生成宽度和高度的样式设置
          const selectStyle = selectProps.style || comp.style || {}
          if (selectStyle.width || selectStyle.height) {
            const styleProps: string[] = []
            if (selectStyle.width) styleProps.push(`width: '${selectStyle.width}'`)
            if (selectStyle.height) styleProps.push(`height: '${selectStyle.height}'`)
            if (styleProps.length > 0) {
              code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
            }
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          break
        }
        case 'switch': {
          const switchProps = comp.props || {}
          const switchValue = switchProps.value ?? false
          code += `const ${comp.type}${index} = new NhaiSwitchCommand(${switchValue})\n`
          if (switchProps.size && switchProps.size !== 'default') {
            code += `${comp.type}${index}.setSize('${switchProps.size}')\n`
          }
          if (switchProps.disabled) {
            code += `${comp.type}${index}.setDisabled(true)\n`
          }
          if (switchProps.activeText) {
            code += `${comp.type}${index}.setActiveText('${switchProps.activeText}')\n`
          }
          if (switchProps.inactiveText) {
            code += `${comp.type}${index}.setInactiveText('${switchProps.inactiveText}')\n`
          }
          if (switchProps.activeColor) {
            code += `${comp.type}${index}.setActiveColor('${switchProps.activeColor}')\n`
          }
          if (switchProps.inactiveColor) {
            code += `${comp.type}${index}.setInactiveColor('${switchProps.inactiveColor}')\n`
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          break
        }
        case 'checkbox': {
          const checkboxProps = comp.props || {}
          const checkboxText = checkboxProps.text || '复选框'
          code += `const ${comp.type}${index} = new NhaiCheckboxCommand('${checkboxText}')\n`
          if (checkboxProps.value) {
            code += `${comp.type}${index}.setValue(true)\n`
          }
          if (checkboxProps.size && checkboxProps.size !== 'default') {
            code += `${comp.type}${index}.setSize('${checkboxProps.size}')\n`
          }
          if (checkboxProps.disabled) {
            code += `${comp.type}${index}.setDisabled(true)\n`
          }
          if (checkboxProps.indeterminate) {
            code += `${comp.type}${index}.setIndeterminate(true)\n`
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          break
        }
        case 'card': {
          const cardProps = comp.props || {}
          const cardHeader = cardProps.header || '标题'
          const cardContent = cardProps.content || '内容'
          code += `const ${comp.type}${index} = new NhaiCardCommand('${cardHeader}', '${cardContent}')\n`
          if (cardProps.shadow && cardProps.shadow !== 'always') {
            code += `${comp.type}${index}.setShadow('${cardProps.shadow}')\n`
          }
          // 生成宽度和高度的样式设置
          const cardStyle = cardProps.style || comp.style || {}
          if (cardStyle.width || cardStyle.height) {
            const styleProps: string[] = []
            if (cardStyle.width) styleProps.push(`width: '${cardStyle.width}'`)
            if (cardStyle.height) styleProps.push(`height: '${cardStyle.height}'`)
            if (styleProps.length > 0) {
              code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
            }
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          break
        }
        case 'dialog': {
          const dialogProps = comp.props || {}
          const dialogTitle = dialogProps.title || '提示'
          const dialogContent = dialogProps.content || ''
          const dialogInstance = comp.dialogInstance
          
          code += `// Dialog 触发器按钮\n`
          code += `const ${comp.type}${index}Trigger = document.createElement('button')\n`
          code += `${comp.type}${index}Trigger.textContent = '点击打开对话框'\n`
          code += `${comp.type}${index}Trigger.onclick = () => {\n`
          code += `  const dialog = new NhaiDialogCommand('${dialogTitle}', '${dialogContent}')\n`
          code += `  dialog.setAppendToBody(true)\n`
          if (dialogProps.width) {
            code += `  dialog.setWidth('${dialogProps.width}')\n`
          }
          if (dialogProps.fullscreen) {
            code += `  dialog.setFullscreen(true)\n`
          }
          if (dialogProps.modal === false) {
            code += `  dialog.setModal(false)\n`
          }
          if (dialogProps.showFooter) {
            code += `  dialog.setShowFooter(true)\n`
            if (dialogProps.confirmText) {
              code += `  dialog.setConfirmText('${dialogProps.confirmText}')\n`
            }
            if (dialogProps.cancelText) {
              code += `  dialog.setCancelText('${dialogProps.cancelText}')\n`
            }
          }
          if (dialogProps.draggable) {
            code += `  dialog.setDraggable(true)\n`
          }
          if (dialogProps.center) {
            code += `  dialog.setCenter(true)\n`
          }
          if (dialogProps.closeOnClickModal) {
            code += `  dialog.setCloseOnClickModal(true)\n`
          }
          if (dialogProps.closeOnPressEscape === false) {
            code += `  dialog.setCloseOnPressEscape(false)\n`
          }
          if (dialogProps.showClose === false) {
            code += `  dialog.setShowClose(false)\n`
          }
          code += `  dialog.setModelValue(true)\n`
          code += `  dialog.render()\n`
          
          // 生成对话框内子组件的代码
          if (dialogInstance) {
            const children = dialogInstance.getChildren()
            if (children && children.length > 0) {
              // 为每个子组件生成代码
              children.forEach((child: any, childIndex: number) => {
                const childInfo = dialogChildren.value.get(child)
                if (!childInfo) return
                
                let childVarName = ''
                let childCode = ''
                
                // 根据子组件类型生成代码
                if (child instanceof NhaiButtonCommand) {
                  childVarName = `dialogChild${index}_button${childIndex}`
                  const text = child.getText?.() || (child as any).text || '按钮'
                  const type = (child as any).type || 'primary'
                  const size = (child as any).size || 'default'
                  const icon = (child as any).icon
                  const plain = (child as any).plain || false
                  const round = (child as any).round || false
                  const circle = (child as any).circle || false
                  const loading = (child as any).loading || false
                  const disabled = (child as any).disabled || false
                  
                  childCode = `  const ${childVarName} = new NhaiButtonCommand('${text}')\n`
                  if (type !== 'primary') {
                    childCode += `  ${childVarName}.setType('${type}')\n`
                  }
                  if (size !== 'default') {
                    childCode += `  ${childVarName}.setSize('${size}')\n`
                  }
                  if (icon) {
                    childCode += `  ${childVarName}.setIcon('${icon}')\n`
                  }
                  if (plain) {
                    childCode += `  ${childVarName}.setPlain(true)\n`
                  }
                  if (round) {
                    childCode += `  ${childVarName}.setRound(true)\n`
                  }
                  if (circle) {
                    childCode += `  ${childVarName}.setCircle(true)\n`
                  }
                  if (loading) {
                    childCode += `  ${childVarName}.setLoading(true)\n`
                  }
                  if (disabled) {
                    childCode += `  ${childVarName}.setDisabled(true)\n`
                  }
                  // 生成宽度和高度的样式设置
                  const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                  if (childStyle.width || childStyle.height) {
                    const styleProps: string[] = []
                    if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                    if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                    if (styleProps.length > 0) {
                      childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                    }
                  }
                  if (!usedTypes.has('button')) {
                    imports.push('NhaiButtonCommand')
                    usedTypes.add('button')
                  }
                } else if (child instanceof NhaiInputCommand) {
                  childVarName = `dialogChild${index}_input${childIndex}`
                  const childOptions = (child as any)._options || {}
                  childCode = `  const ${childVarName} = new NhaiInputCommand()\n`
                  if (childOptions.placeholder) {
                    childCode += `  ${childVarName}.setPlaceholder('${childOptions.placeholder}')\n`
                  }
                  if (childOptions.type && childOptions.type !== 'text') {
                    childCode += `  ${childVarName}.setType('${childOptions.type}')\n`
                  }
                  if (childOptions.value) {
                    childCode += `  ${childVarName}.setValue('${childOptions.value}')\n`
                  }
                  if (childOptions.size && childOptions.size !== 'default') {
                    childCode += `  ${childVarName}.setSize('${childOptions.size}')\n`
                  }
                  if (childOptions.disabled) {
                    childCode += `  ${childVarName}.setDisabled(true)\n`
                  }
                  if (childOptions.clearable) {
                    childCode += `  ${childVarName}.setClearable(true)\n`
                  }
                  if (childOptions.showPassword) {
                    childCode += `  ${childVarName}.setShowPassword(true)\n`
                  }
                  if (childOptions.prefixIcon) {
                    childCode += `  ${childVarName}.configure({ prefixIcon: '${childOptions.prefixIcon}' })\n`
                  }
                  if (childOptions.suffixIcon) {
                    childCode += `  ${childVarName}.configure({ suffixIcon: '${childOptions.suffixIcon}' })\n`
                  }
                  if (childOptions.maxlength && childOptions.maxlength > 0) {
                    childCode += `  ${childVarName}.setMaxlength(${childOptions.maxlength})\n`
                  }
                  if (childOptions.minlength && childOptions.minlength > 0) {
                    childCode += `  ${childVarName}.setMinlength(${childOptions.minlength})\n`
                  }
                  const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                  if (childStyle.width || childStyle.height) {
                    const styleProps: string[] = []
                    if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                    if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                    if (styleProps.length > 0) {
                      childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                    }
                  }
                  if (!usedTypes.has('input')) {
                    imports.push('NhaiInputCommand')
                    usedTypes.add('input')
                  }
                } else if (child instanceof NhaiSelectCommand) {
                  childVarName = `dialogChild${index}_select${childIndex}`
                  childCode = `  const ${childVarName} = new NhaiSelectCommand()\n`
                  const placeholder = (child as any).placeholder || '请选择'
                  if (placeholder !== '请选择') {
                    childCode += `  ${childVarName}.setPlaceholder('${placeholder}')\n`
                  }
                  const size = (child as any).size || 'default'
                  if (size !== 'default') {
                    childCode += `  ${childVarName}.setSize('${size}')\n`
                  }
                  if ((child as any).disabled) {
                    childCode += `  ${childVarName}.setDisabled(true)\n`
                  }
                  if ((child as any).clearable) {
                    childCode += `  ${childVarName}.setClearable(true)\n`
                  }
                  if ((child as any).multiple) {
                    childCode += `  ${childVarName}.setMultiple(true)\n`
                  }
                  const options = (child as any).options || []
                  if (options.length > 0) {
                    const optionsStr = options.map((opt: any) => 
                      `{label: '${opt.label}', value: '${opt.value}'}`
                    ).join(', ')
                    childCode += `  ${childVarName}.setOptions([${optionsStr}])\n`
                  }
                  const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                  if (childStyle.width || childStyle.height) {
                    const styleProps: string[] = []
                    if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                    if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                    if (styleProps.length > 0) {
                      childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                    }
                  }
                  if (!usedTypes.has('select')) {
                    imports.push('NhaiSelectCommand')
                    usedTypes.add('select')
                  }
                } else if (child instanceof NhaiSwitchCommand) {
                  childVarName = `dialogChild${index}_switch${childIndex}`
                  const value = (child as any).value ?? false
                  childCode = `  const ${childVarName} = new NhaiSwitchCommand(${value})\n`
                  const size = (child as any).size || 'default'
                  if (size !== 'default') {
                    childCode += `  ${childVarName}.setSize('${size}')\n`
                  }
                  if ((child as any).disabled) {
                    childCode += `  ${childVarName}.setDisabled(true)\n`
                  }
                  const activeText = (child as any).activeText
                  if (activeText) {
                    childCode += `  ${childVarName}.setActiveText('${activeText}')\n`
                  }
                  const inactiveText = (child as any).inactiveText
                  if (inactiveText) {
                    childCode += `  ${childVarName}.setInactiveText('${inactiveText}')\n`
                  }
                  const activeColor = (child as any).activeColor
                  if (activeColor) {
                    childCode += `  ${childVarName}.setActiveColor('${activeColor}')\n`
                  }
                  const inactiveColor = (child as any).inactiveColor
                  if (inactiveColor) {
                    childCode += `  ${childVarName}.setInactiveColor('${inactiveColor}')\n`
                  }
                  if (!usedTypes.has('switch')) {
                    imports.push('NhaiSwitchCommand')
                    usedTypes.add('switch')
                  }
                } else if (child instanceof NhaiCheckboxCommand) {
                  childVarName = `dialogChild${index}_checkbox${childIndex}`
                  const text = (child as any).text || '复选框'
                  childCode = `  const ${childVarName} = new NhaiCheckboxCommand('${text}')\n`
                  if ((child as any).value) {
                    childCode += `  ${childVarName}.setValue(true)\n`
                  }
                  const size = (child as any).size || 'default'
                  if (size !== 'default') {
                    childCode += `  ${childVarName}.setSize('${size}')\n`
                  }
                  if ((child as any).disabled) {
                    childCode += `  ${childVarName}.setDisabled(true)\n`
                  }
                  if ((child as any).indeterminate) {
                    childCode += `  ${childVarName}.setIndeterminate(true)\n`
                  }
                  if (!usedTypes.has('checkbox')) {
                    imports.push('NhaiCheckboxCommand')
                    usedTypes.add('checkbox')
                  }
                } else if (child instanceof NhaiCardCommand) {
                  childVarName = `dialogChild${index}_card${childIndex}`
                  const header = (child as any).header || '卡片标题'
                  const content = (child as any).content || '卡片内容'
                  childCode = `  const ${childVarName} = new NhaiCardCommand('${header}', '${content}')\n`
                  if (!usedTypes.has('card')) {
                    imports.push('NhaiCardCommand')
                    usedTypes.add('card')
                  }
                }
                
                if (childCode) {
                  code += childCode
                  code += `  ${childVarName}.render()\n`
                  // 设置位置
                  const posX = childInfo.position.x
                  const posY = childInfo.position.y
                  code += `  ${childVarName}.getElement().style.position = 'absolute'\n`
                  code += `  ${childVarName}.getElement().style.left = '${posX}px'\n`
                  code += `  ${childVarName}.getElement().style.top = '${posY}px'\n`
                  // 添加到对话框
                  code += `  dialog.addChild(${childVarName})\n`
                }
              })
            }
          }
          
          code += `  dialog.on('closed', () => dialog.unmount())\n`
          code += `}\n`
          code += `const element${index} = ${comp.type}${index}Trigger\n`
          break
        }
        case 'widget': {
          const widgetProps = comp.props || {}
          const widgetTitle = widgetProps.title || '窗口标题'
          const widgetInstance = comp.widgetInstance
          
          code += `const ${comp.type}${index} = new NhaiWidgetCommand('${widgetTitle}')\n`
          if (widgetProps.width && widgetProps.width !== '800px') {
            code += `${comp.type}${index}.setWidth('${widgetProps.width}')\n`
          }
          if (widgetProps.height && widgetProps.height !== '600px') {
            code += `${comp.type}${index}.setHeight('${widgetProps.height}')\n`
          }
          if (widgetProps.fullscreen) {
            code += `${comp.type}${index}.setFullscreen(true)\n`
          }
          if (widgetProps.menuBarVisible === false) {
            code += `${comp.type}${index}.setMenuBarVisible(false)\n`
          }
          if (widgetProps.canMinimize === false) {
            code += `${comp.type}${index}.canMinimize = false\n`
          }
          if (widgetProps.canMaximize === false) {
            code += `${comp.type}${index}.canMaximize = false\n`
          }
          if (widgetProps.canClose === false) {
            code += `${comp.type}${index}.canClose = false\n`
          }
          if (widgetProps.position && (widgetProps.position.x !== 100 || widgetProps.position.y !== 100)) {
            code += `${comp.type}${index}.setPosition(${widgetProps.position.x}, ${widgetProps.position.y})\n`
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          code += `document.body.appendChild(element${index})\n`
          
          // 生成 Widget.on 的子组件代码
          if (widgetInstance) {
            const children = widgetInstance.getChildren()
            if (children && children.length > 0) {
              const processedChildren = new Set<any>()
              let actualChildIndex = 0
              
              children.forEach((child: any) => {
                if (processedChildren.has(child)) return
                processedChildren.add(child)
                
                const childInfo = dialogChildren.value.get(child)
                if (!childInfo) return
                
                const childIndex = actualChildIndex++
                let childVarName = ''
                let childCode = ''
                
                if (child instanceof NhaiButtonCommand) {
                  childVarName = `widgetChild${index}_button${childIndex}`
                  const text = child.getText?.() || (child as any).text || '按钮'
                  const type = (child as any).type || 'primary'
                  const size = (child as any).size || 'default'
                  const icon = (child as any).icon
                  const plain = (child as any).plain || false
                  const round = (child as any).round || false
                  const circle = (child as any).circle || false
                  const loading = (child as any).loading || false
                  const disabled = (child as any).disabled || false
                  
                  childCode = `  const ${childVarName} = new NhaiButtonCommand('${text}')\n`
                  if (type !== 'primary') childCode += `  ${childVarName}.setType('${type}')\n`
                  if (size !== 'default') childCode += `  ${childVarName}.setSize('${size}')\n`
                  if (icon) childCode += `  ${childVarName}.setIcon('${icon}')\n`
                  if (plain) childCode += `  ${childVarName}.setPlain(true)\n`
                  if (round) childCode += `  ${childVarName}.setRound(true)\n`
                  if (circle) childCode += `  ${childVarName}.setCircle(true)\n`
                  if (loading) childCode += `  ${childVarName}.setLoading(true)\n`
                  if (disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                  if (childStyle.width || childStyle.height) {
                    const styleProps: string[] = []
                    if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                    if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                    if (styleProps.length > 0) {
                      childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                    }
                  }
                  if (!usedTypes.has('button')) {
                    imports.push('NhaiButtonCommand')
                    usedTypes.add('button')
                  }
                } else if (child instanceof NhaiInputCommand) {
                  childVarName = `widgetChild${index}_input${childIndex}`
                  const childOptions = (child as any)._options || {}
                  childCode = `  const ${childVarName} = new NhaiInputCommand()\n`
                  if (childOptions.placeholder) childCode += `  ${childVarName}.setPlaceholder('${childOptions.placeholder}')\n`
                  if (childOptions.type && childOptions.type !== 'text') childCode += `  ${childVarName}.setType('${childOptions.type}')\n`
                  if (childOptions.value) childCode += `  ${childVarName}.setValue('${childOptions.value}')\n`
                  if (childOptions.size && childOptions.size !== 'default') childCode += `  ${childVarName}.setSize('${childOptions.size}')\n`
                  if (childOptions.disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  if (childOptions.clearable) childCode += `  ${childVarName}.setClearable(true)\n`
                  if (childOptions.showPassword) childCode += `  ${childVarName}.setShowPassword(true)\n`
                  if (childOptions.prefixIcon) childCode += `  ${childVarName}.configure({ prefixIcon: '${childOptions.prefixIcon}' })\n`
                  if (childOptions.suffixIcon) childCode += `  ${childVarName}.configure({ suffixIcon: '${childOptions.suffixIcon}' })\n`
                  if (childOptions.maxlength && childOptions.maxlength > 0) childCode += `  ${childVarName}.setMaxlength(${childOptions.maxlength})\n`
                  if (childOptions.minlength && childOptions.minlength > 0) childCode += `  ${childVarName}.setMinlength(${childOptions.minlength})\n`
                  const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                  if (childStyle.width || childStyle.height) {
                    const styleProps: string[] = []
                    if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                    if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                    if (styleProps.length > 0) {
                      childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                    }
                  }
                  if (!usedTypes.has('input')) {
                    imports.push('NhaiInputCommand')
                    usedTypes.add('input')
                  }
                } else if (child instanceof NhaiSelectCommand) {
                  childVarName = `widgetChild${index}_select${childIndex}`
                  childCode = `  const ${childVarName} = new NhaiSelectCommand()\n`
                  const placeholder = (child as any).placeholder || '请选择'
                  if (placeholder !== '请选择') childCode += `  ${childVarName}.setPlaceholder('${placeholder}')\n`
                  const size = (child as any).size || 'default'
                  if (size !== 'default') childCode += `  ${childVarName}.setSize('${size}')\n`
                  if ((child as any).disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  if ((child as any).clearable) childCode += `  ${childVarName}.setClearable(true)\n`
                  if ((child as any).multiple) childCode += `  ${childVarName}.setMultiple(true)\n`
                  const options = (child as any).options || []
                  if (options.length > 0) {
                    const optionsStr = options.map((opt: any) => `{label: '${opt.label}', value: '${opt.value}'}`).join(', ')
                    childCode += `  ${childVarName}.setOptions([${optionsStr}])\n`
                  }
                  const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                  if (childStyle.width || childStyle.height) {
                    const styleProps: string[] = []
                    if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                    if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                    if (styleProps.length > 0) {
                      childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                    }
                  }
                  if (!usedTypes.has('select')) {
                    imports.push('NhaiSelectCommand')
                    usedTypes.add('select')
                  }
                } else if (child instanceof NhaiSwitchCommand) {
                  childVarName = `widgetChild${index}_switch${childIndex}`
                  const value = (child as any).value ?? false
                  childCode = `  const ${childVarName} = new NhaiSwitchCommand(${value})\n`
                  const size = (child as any).size || 'default'
                  if (size !== 'default') childCode += `  ${childVarName}.setSize('${size}')\n`
                  if ((child as any).disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  const activeText = (child as any).activeText
                  if (activeText) childCode += `  ${childVarName}.setActiveText('${activeText}')\n`
                  const inactiveText = (child as any).inactiveText
                  if (inactiveText) childCode += `  ${childVarName}.setInactiveText('${inactiveText}')\n`
                  const activeColor = (child as any).activeColor
                  if (activeColor) childCode += `  ${childVarName}.setActiveColor('${activeColor}')\n`
                  const inactiveColor = (child as any).inactiveColor
                  if (inactiveColor) childCode += `  ${childVarName}.setInactiveColor('${inactiveColor}')\n`
                  if (!usedTypes.has('switch')) {
                    imports.push('NhaiSwitchCommand')
                    usedTypes.add('switch')
                  }
                } else if (child instanceof NhaiCheckboxCommand) {
                  childVarName = `widgetChild${index}_checkbox${childIndex}`
                  const text = (child as any).text || '复选框'
                  childCode = `  const ${childVarName} = new NhaiCheckboxCommand('${text}')\n`
                  if ((child as any).value) childCode += `  ${childVarName}.setValue(true)\n`
                  const size = (child as any).size || 'default'
                  if (size !== 'default') childCode += `  ${childVarName}.setSize('${size}')\n`
                  if ((child as any).disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  if ((child as any).indeterminate) childCode += `  ${childVarName}.setIndeterminate(true)\n`
                  if (!usedTypes.has('checkbox')) {
                    imports.push('NhaiCheckboxCommand')
                    usedTypes.add('checkbox')
                  }
                } else if (child instanceof NhaiCardCommand) {
                  childVarName = `widgetChild${index}_card${childIndex}`
                  const header = (child as any).header || '卡片标题'
                  const content = (child as any).content || '卡片内容'
                  childCode = `  const ${childVarName} = new NhaiCardCommand('${header}', '${content}')\n`
                  if (!usedTypes.has('card')) {
                    imports.push('NhaiCardCommand')
                    usedTypes.add('card')
                  }
                } else if (child instanceof NhaiGridCommand) {
                  childVarName = `widgetChild${index}_grid${childIndex}`
                  const gridProps = (child as any).getProperties?.() || (child as any)._props || {}
                  childCode = `  const ${childVarName} = new NhaiGridCommand()\n`
                  if (gridProps.container !== undefined && gridProps.container !== true) {
                    childCode += `  ${childVarName}.setContainer(false)\n`
                  }
                  if (gridProps.columns !== undefined && gridProps.columns !== 12) {
                    if (typeof gridProps.columns === 'number') {
                      childCode += `  ${childVarName}.setColumns(${gridProps.columns})\n`
                    } else {
                      childCode += `  ${childVarName}.setColumns('${gridProps.columns}')\n`
                    }
                  }
                  if (gridProps.rows !== undefined) {
                    if (typeof gridProps.rows === 'number') {
                      childCode += `  ${childVarName}.setRows(${gridProps.rows})\n`
                    } else {
                      childCode += `  ${childVarName}.setRows('${gridProps.rows}')\n`
                    }
                  }
                  if (gridProps.templateAreas) childCode += `  ${childVarName}.setTemplateAreas('${gridProps.templateAreas}')\n`
                  if (gridProps.autoFlow && gridProps.autoFlow !== 'row') childCode += `  ${childVarName}.setAutoFlow('${gridProps.autoFlow}')\n`
                  if (gridProps.justifyItems && gridProps.justifyItems !== 'stretch') childCode += `  ${childVarName}.setJustifyItems('${gridProps.justifyItems}')\n`
                  if (gridProps.alignItems && gridProps.alignItems !== 'stretch') childCode += `  ${childVarName}.setAlignItems('${gridProps.alignItems}')\n`
                  if (gridProps.justifyContent) childCode += `  ${childVarName}.setJustifyContent('${gridProps.justifyContent}')\n`
                  if (gridProps.alignContent) childCode += `  ${childVarName}.setAlignContent('${gridProps.alignContent}')\n`
                  if (gridProps.spacing !== undefined && gridProps.spacing !== 2) {
                    if (typeof gridProps.spacing === 'number') {
                      childCode += `  ${childVarName}.setSpacing(${gridProps.spacing})\n`
                    } else {
                      childCode += `  ${childVarName}.setSpacing('${gridProps.spacing}')\n`
                    }
                  }
                  if (gridProps.gap) childCode += `  ${childVarName}.setGap('${gridProps.gap}')\n`
                  childCode += `  ${childVarName}.render()\n`
                  childCode += `  ${childVarName}.getElement().style.position = 'absolute'\n`
                  childCode += `  ${childVarName}.getElement().style.left = '0'\n`
                  childCode += `  ${childVarName}.getElement().style.top = '0'\n`
                  childCode += `  ${childVarName}.getElement().style.right = '0'\n`
                  childCode += `  ${childVarName}.getElement().style.bottom = '0'\n`
                  childCode += `  ${childVarName}.getElement().style.width = '100%'\n`
                  childCode += `  ${childVarName}.getElement().style.height = '100%'\n`
                  childCode += `  const gridRoot${childIndex} = ${childVarName}.getElement().querySelector('.vue-grid')\n`
                  childCode += `  if (gridRoot${childIndex}) {\n`
                  childCode += `    gridRoot${childIndex}.style.width = '100%'\n`
                  childCode += `    gridRoot${childIndex}.style.height = '100%'\n`
                  childCode += `  }\n`
                  if (!usedTypes.has('grid')) {
                    imports.push('NhaiGridCommand')
                    usedTypes.add('grid')
                  }
                }
                
                if (childCode && childVarName) {
                  code += childCode
                  if (!(child instanceof NhaiGridCommand)) {
                    code += `  ${childVarName}.render()\n`
                    const posX = childInfo.position.x
                    const posY = childInfo.position.y
                    code += `  ${childVarName}.getElement().style.position = 'absolute'\n`
                    code += `  ${childVarName}.getElement().style.left = '${posX}px'\n`
                    code += `  ${childVarName}.getElement().style.top = '${posY}px'\n`
                  }
                  code += `  ${comp.type}${index}.addChild(${childVarName})\n`
                }
              })
            }
          }
          break
        }
        case 'grid': {
          const gridProps = comp.props || {}
          // 过滤掉 Grid 不支持的属性（如 direction, justify, wrap 等）
          const validGridProps = { ...gridProps }
          delete validGridProps.direction
          delete validGridProps.justify
          delete validGridProps.wrap
          
          code += `const ${comp.type}${index} = new NhaiGridCommand()\n`
          if (validGridProps.container !== undefined && validGridProps.container !== true) {
            code += `${comp.type}${index}.setContainer(false)\n`
          }
          if (validGridProps.columns !== undefined && validGridProps.columns !== 12) {
            if (typeof validGridProps.columns === 'number') {
              code += `${comp.type}${index}.setColumns(${validGridProps.columns})\n`
            } else {
              code += `${comp.type}${index}.setColumns('${validGridProps.columns}')\n`
            }
          }
          if (validGridProps.rows !== undefined) {
            if (typeof validGridProps.rows === 'number') {
              code += `${comp.type}${index}.setRows(${validGridProps.rows})\n`
            } else {
              code += `${comp.type}${index}.setRows('${validGridProps.rows}')\n`
            }
          }
          if (validGridProps.templateAreas) code += `${comp.type}${index}.setTemplateAreas('${validGridProps.templateAreas}')\n`
          if (validGridProps.autoFlow && validGridProps.autoFlow !== 'row') code += `${comp.type}${index}.setAutoFlow('${validGridProps.autoFlow}')\n`
          if (validGridProps.justifyItems && validGridProps.justifyItems !== 'stretch') code += `${comp.type}${index}.setJustifyItems('${validGridProps.justifyItems}')\n`
          if (validGridProps.alignItems && validGridProps.alignItems !== 'stretch') code += `${comp.type}${index}.setAlignItems('${validGridProps.alignItems}')\n`
          if (validGridProps.justifyContent) code += `${comp.type}${index}.setJustifyContent('${validGridProps.justifyContent}')\n`
          if (validGridProps.alignContent) code += `${comp.type}${index}.setAlignContent('${validGridProps.alignContent}')\n`
          if (validGridProps.spacing !== undefined && validGridProps.spacing !== 2) {
            if (typeof validGridProps.spacing === 'number') {
              code += `${comp.type}${index}.setSpacing(${validGridProps.spacing})\n`
            } else {
              code += `${comp.type}${index}.setSpacing('${validGridProps.spacing}')\n`
            }
          }
          if (validGridProps.gap) code += `${comp.type}${index}.setGap('${validGridProps.gap}')\n`
          const gridStyle = gridProps.style || comp.style || {}
          if (gridStyle.width || gridStyle.height) {
            const styleProps: string[] = []
            if (gridStyle.width) styleProps.push(`width: '${gridStyle.width}'`)
            if (gridStyle.height) styleProps.push(`height: '${gridStyle.height}'`)
            if (styleProps.length > 0) {
              code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
            }
          }
          
          // 在 render() 之前先添加所有子组件
          if (comp.gridInstance) {
            const children = comp.gridInstance.getChildren()
            if (children && children.length > 0) {
              children.forEach((child: any, childIndex: number) => {
                let childVarName = ''
                let childCode = ''
                
                if (child instanceof NhaiButtonCommand) {
                  childVarName = `gridChild${index}_button${childIndex}`
                  const text = child.getText?.() || (child as any).text || '按钮'
                  const type = (child as any).type || 'primary'
                  const size = (child as any).size || 'default'
                  const icon = (child as any).icon
                  const plain = (child as any).plain || false
                  const round = (child as any).round || false
                  const circle = (child as any).circle || false
                  const loading = (child as any).loading || false
                  const disabled = (child as any).disabled || false
                  
                  childCode = `const ${childVarName} = new NhaiButtonCommand('${text}')\n`
                  if (type !== 'primary') childCode += `  ${childVarName}.setType('${type}')\n`
                  if (size !== 'default') childCode += `  ${childVarName}.setSize('${size}')\n`
                  if (icon) childCode += `  ${childVarName}.setIcon('${icon}')\n`
                  if (plain) childCode += `  ${childVarName}.setPlain(true)\n`
                  if (round) childCode += `  ${childVarName}.setRound(true)\n`
                  if (circle) childCode += `  ${childVarName}.setCircle(true)\n`
                  if (loading) childCode += `  ${childVarName}.setLoading(true)\n`
                  if (disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                  if (childStyle.width || childStyle.height) {
                    const styleProps: string[] = []
                    if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                    if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                    if (styleProps.length > 0) {
                      childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                    }
                  }
                  if (!usedTypes.has('button')) {
                    imports.push('NhaiButtonCommand')
                    usedTypes.add('button')
                  }
                } else if (child instanceof NhaiInputCommand) {
                  childVarName = `gridChild${index}_input${childIndex}`
                  const childOptions = (child as any)._options || {}
                  childCode = `const ${childVarName} = new NhaiInputCommand()\n`
                  if (childOptions.placeholder) childCode += `  ${childVarName}.setPlaceholder('${childOptions.placeholder}')\n`
                  if (childOptions.type && childOptions.type !== 'text') childCode += `  ${childVarName}.setType('${childOptions.type}')\n`
                  if (childOptions.size && childOptions.size !== 'default') childCode += `  ${childVarName}.setSize('${childOptions.size}')\n`
                  if (childOptions.disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  if (childOptions.clearable) childCode += `  ${childVarName}.setClearable(true)\n`
                  if (!usedTypes.has('input')) {
                    imports.push('NhaiInputCommand')
                    usedTypes.add('input')
                  }
                } else if (child instanceof NhaiSelectCommand) {
                  childVarName = `gridChild${index}_select${childIndex}`
                  childCode = `const ${childVarName} = new NhaiSelectCommand()\n`
                  const placeholder = (child as any).placeholder || '请选择'
                  if (placeholder !== '请选择') childCode += `  ${childVarName}.setPlaceholder('${placeholder}')\n`
                  const options = (child as any).options || []
                  if (options.length > 0) {
                    const optionsStr = options.map((opt: any) => `{label: '${opt.label}', value: '${opt.value}'}`).join(', ')
                    childCode += `  ${childVarName}.setOptions([${optionsStr}])\n`
                  }
                  if (!usedTypes.has('select')) {
                    imports.push('NhaiSelectCommand')
                    usedTypes.add('select')
                  }
                } else if (child instanceof NhaiSwitchCommand) {
                  childVarName = `gridChild${index}_switch${childIndex}`
                  const value = (child as any).value ?? false
                  childCode = `const ${childVarName} = new NhaiSwitchCommand(${value})\n`
                  if (!usedTypes.has('switch')) {
                    imports.push('NhaiSwitchCommand')
                    usedTypes.add('switch')
                  }
                } else if (child instanceof NhaiCheckboxCommand) {
                  childVarName = `gridChild${index}_checkbox${childIndex}`
                  const text = (child as any).text || '复选框'
                  childCode = `const ${childVarName} = new NhaiCheckboxCommand('${text}')\n`
                  if (!usedTypes.has('checkbox')) {
                    imports.push('NhaiCheckboxCommand')
                    usedTypes.add('checkbox')
                  }
                }
                
                if (childCode && childVarName) {
                  code += childCode
                  code += `${childVarName}.render()\n`
                  code += `${comp.type}${index}.addChild(${childVarName})\n`
                }
              })
            }
          }
          
          // 在所有子组件添加完成后，再调用 render()
          code += `const element${index} = ${comp.type}${index}.render()\n`
          break
        }
        case 'container': {
          const containerProps = comp.props || {}
          code += `const ${comp.type}${index} = new NhaiContainerCommand()\n`
          if (containerProps.maxWidth !== undefined && containerProps.maxWidth !== 'lg') {
            if (containerProps.maxWidth === 'false' || containerProps.maxWidth === false) {
              code += `${comp.type}${index}.setMaxWidth(false)\n`
            } else {
              code += `${comp.type}${index}.setMaxWidth('${containerProps.maxWidth}')\n`
            }
          }
          if (containerProps.fixed) code += `${comp.type}${index}.setFixed(true)\n`
          if (containerProps.disableGutters) code += `${comp.type}${index}.setDisableGutters(true)\n`
          const containerStyle = containerProps.style || comp.style || {}
          if (containerStyle.width || containerStyle.height) {
            const styleProps: string[] = []
            if (containerStyle.width) styleProps.push(`width: '${containerStyle.width}'`)
            if (containerStyle.height) styleProps.push(`height: '${containerStyle.height}'`)
            if (styleProps.length > 0) {
              code += `${comp.type}${index}.setStyle({ ${styleProps.join(', ')} })\n`
            }
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          
          if (comp.containerInstance) {
            const children = comp.containerInstance.getChildren()
            if (children && children.length > 0) {
              children.forEach((child: any, childIndex: number) => {
                let childVarName = ''
                let childCode = ''
                
                if (child instanceof NhaiButtonCommand) {
                  childVarName = `containerChild${index}_button${childIndex}`
                  const text = child.getText?.() || (child as any).text || '按钮'
                  const type = (child as any).type || 'primary'
                  const size = (child as any).size || 'default'
                  const icon = (child as any).icon
                  const plain = (child as any).plain || false
                  const round = (child as any).round || false
                  const circle = (child as any).circle || false
                  const loading = (child as any).loading || false
                  const disabled = (child as any).disabled || false
                  
                  childCode = `const ${childVarName} = new NhaiButtonCommand('${text}')\n`
                  if (type !== 'primary') childCode += `  ${childVarName}.setType('${type}')\n`
                  if (size !== 'default') childCode += `  ${childVarName}.setSize('${size}')\n`
                  if (icon) childCode += `  ${childVarName}.setIcon('${icon}')\n`
                  if (plain) childCode += `  ${childVarName}.setPlain(true)\n`
                  if (round) childCode += `  ${childVarName}.setRound(true)\n`
                  if (circle) childCode += `  ${childVarName}.setCircle(true)\n`
                  if (loading) childCode += `  ${childVarName}.setLoading(true)\n`
                  if (disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  const childStyle = (child as any).getProperty?.('style') || (child as any)?._props?.style || {}
                  if (childStyle.width || childStyle.height) {
                    const styleProps: string[] = []
                    if (childStyle.width) styleProps.push(`width: '${childStyle.width}'`)
                    if (childStyle.height) styleProps.push(`height: '${childStyle.height}'`)
                    if (styleProps.length > 0) {
                      childCode += `  ${childVarName}.setStyle({ ${styleProps.join(', ')} })\n`
                    }
                  }
                  if (!usedTypes.has('button')) {
                    imports.push('NhaiButtonCommand')
                    usedTypes.add('button')
                  }
                } else if (child instanceof NhaiInputCommand) {
                  childVarName = `containerChild${index}_input${childIndex}`
                  const childOptions = (child as any)._options || {}
                  childCode = `const ${childVarName} = new NhaiInputCommand()\n`
                  if (childOptions.placeholder) childCode += `  ${childVarName}.setPlaceholder('${childOptions.placeholder}')\n`
                  if (childOptions.type && childOptions.type !== 'text') childCode += `  ${childVarName}.setType('${childOptions.type}')\n`
                  if (childOptions.size && childOptions.size !== 'default') childCode += `  ${childVarName}.setSize('${childOptions.size}')\n`
                  if (childOptions.disabled) childCode += `  ${childVarName}.setDisabled(true)\n`
                  if (childOptions.clearable) childCode += `  ${childVarName}.setClearable(true)\n`
                  if (!usedTypes.has('input')) {
                    imports.push('NhaiInputCommand')
                    usedTypes.add('input')
                  }
                } else if (child instanceof NhaiSelectCommand) {
                  childVarName = `containerChild${index}_select${childIndex}`
                  childCode = `const ${childVarName} = new NhaiSelectCommand()\n`
                  const placeholder = (child as any).placeholder || '请选择'
                  if (placeholder !== '请选择') childCode += `  ${childVarName}.setPlaceholder('${placeholder}')\n`
                  const options = (child as any).options || []
                  if (options.length > 0) {
                    const optionsStr = options.map((opt: any) => `{label: '${opt.label}', value: '${opt.value}'}`).join(', ')
                    childCode += `  ${childVarName}.setOptions([${optionsStr}])\n`
                  }
                  if (!usedTypes.has('select')) {
                    imports.push('NhaiSelectCommand')
                    usedTypes.add('select')
                  }
                } else if (child instanceof NhaiSwitchCommand) {
                  childVarName = `containerChild${index}_switch${childIndex}`
                  const value = (child as any).value ?? false
                  childCode = `const ${childVarName} = new NhaiSwitchCommand(${value})\n`
                  if (!usedTypes.has('switch')) {
                    imports.push('NhaiSwitchCommand')
                    usedTypes.add('switch')
                  }
                } else if (child instanceof NhaiCheckboxCommand) {
                  childVarName = `containerChild${index}_checkbox${childIndex}`
                  const text = (child as any).text || '复选框'
                  childCode = `const ${childVarName} = new NhaiCheckboxCommand('${text}')\n`
                  if (!usedTypes.has('checkbox')) {
                    imports.push('NhaiCheckboxCommand')
                    usedTypes.add('checkbox')
                  }
                }
                
                if (childCode && childVarName) {
                  code += childCode
                  code += `${childVarName}.render()\n`
                  code += `${comp.type}${index}.addChild(${childVarName})\n`
                }
              })
            }
          }
          break
        }
        case 'splitpanel': {
          const splitProps = comp.props || {}
          code += `const ${comp.type}${index} = new NhaiSplitPanelCommand()\n`
          if (splitProps.orientation && splitProps.orientation !== 'horizontal') {
            code += `${comp.type}${index}.setOrientation('${splitProps.orientation}')\n`
          }
          if (splitProps.splitPosition && splitProps.splitPosition !== 50) {
            code += `${comp.type}${index}.setSplitPosition(${splitProps.splitPosition})\n`
          }
          if (splitProps.minSize && splitProps.minSize !== 20) {
            code += `${comp.type}${index}.setMinSize(${splitProps.minSize})\n`
          }
          if (splitProps.maxSize && splitProps.maxSize !== 80) {
            code += `${comp.type}${index}.setMaxSize(${splitProps.maxSize})\n`
          }
          if (splitProps.resizable === false) {
            code += `${comp.type}${index}.setResizable(false)\n`
          }
          if (splitProps.disabled) {
            code += `${comp.type}${index}.setDisabled(true)\n`
          }
          if (splitProps.leftContent) {
            code += `${comp.type}${index}.setLeftContent('${splitProps.leftContent}')\n`
          }
          if (splitProps.rightContent) {
            code += `${comp.type}${index}.setRightContent('${splitProps.rightContent}')\n`
          }
          code += `const element${index} = ${comp.type}${index}.render()\n`
          break
        }
        default:
          break
      }
      
      // 只为需要绝对定位的组件设置位置样式
      const type = comp.type as string
      if (type !== 'dialog' && type !== 'widget' && type !== 'grid' && type !== 'container') {
        code += `element${index}.style.position = 'absolute'\n`
        code += `element${index}.style.left = '${comp.style.left}'\n`
        code += `element${index}.style.top = '${comp.style.top}'\n`
      }
      
      code += `container.appendChild(element${index})\n\n`
    })
    
    code += 'return container\n'
    return code
  }

  return {
    generateCode
  }
}

