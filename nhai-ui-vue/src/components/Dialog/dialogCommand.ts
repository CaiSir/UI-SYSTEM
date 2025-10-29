/**
 * Dialog 命令式组件
 * 提供对话框的命令式 API，基于 Element Plus 的 el-dialog 组件
 */

import { createApp, h, defineComponent } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Dialog from './Dialog.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface DialogOptions extends IBaseCommandProps {
  modelValue?: boolean
  title?: string
  width?: string | number
  fullscreen?: boolean
  top?: string
  modal?: boolean
  modalClass?: string
  modalStyle?: Record<string, any>
  modalBackdrop?: boolean
  modalFade?: boolean
  appendToBody?: boolean
  lockScroll?: boolean
  openDelay?: number
  closeDelay?: number
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  draggable?: boolean
  center?: boolean
  alignCenter?: boolean
  destroyOnClose?: boolean
  closeIcon?: string
  zIndex?: number
  headerAriaLevel?: string
  header?: string
  content?: string
  showFooter?: boolean
  confirmText?: string
  cancelText?: string
  dialogClass?: string
}

export interface DialogEvents extends IBaseCommandEvents {
  'update:modelValue': (value: boolean) => void
  open: () => void
  opened: () => void
  close: () => void
  closed: () => void
  confirm: () => void
  cancel: () => void
}

export class NhaiDialogCommand extends BaseCommand<DialogOptions, DialogEvents> {
  // ==================== 对话框状态属性 ====================
  private modelValue: boolean = false // 对话框显示/隐藏状态
  private title?: string // 对话框标题
  private width?: string | number // 对话框宽度，默认 '50%'
  private fullscreen: boolean = false // 是否全屏显示
  private top?: string // 对话框距离顶部的位置
  
  // ==================== 对话框行为属性 ====================
  private modal: boolean = true // 是否显示遮罩层
  private modalClass?: string // 遮罩层的自定义样式类名
  private modalStyle?: Record<string, any> // 遮罩层自定义样式
  private modalBackdrop: boolean = true // 是否显示遮罩层背景
  private modalFade: boolean = true // 遮罩层淡入淡出动画
  private appendToBody: boolean = false // 是否将对话框挂载到 body
  private lockScroll: boolean = true // 是否锁定背景滚动
  private openDelay: number = 0 // 打开延迟（毫秒）
  private closeDelay: number = 0 // 关闭延迟（毫秒）
  
  // ==================== 交互行为属性 ====================
  private closeOnClickModal: boolean = false // 点击遮罩层是否关闭（模态框默认不关闭）
  private closeOnPressEscape: boolean = true // 按 ESC 键是否关闭
  private showClose: boolean = true // 是否显示关闭按钮
  private draggable: boolean = false // 是否可拖动
  private center: boolean = false // 是否居中显示
  private alignCenter: boolean = false // 标题和内容是否居中
  private destroyOnClose: boolean = false // 关闭时是否销毁组件
  private closeIcon?: string // 自定义关闭图标
  private zIndex: number = 2000 // 层级，默认 2000
  
  // ==================== 内容属性 ====================
  private headerAriaLevel: string = '2' // 标题 ARIA 级别
  private header?: string // 头部内容
  private content?: string // 对话框内容，支持 HTML
  private showFooter: boolean = false // 是否显示底部按钮
  private confirmText: string = '确定' // 确认按钮文本
  private cancelText: string = '取消' // 取消按钮文本
  private dialogClass?: string // 自定义对话框样式类名
  
  // ==================== 子组件管理 ====================
  protected childElements: Map<BaseCommand<any, any>, HTMLElement> = new Map() // 子组件元素映射
  protected contentContainer?: HTMLElement // 内容容器

  /**
   * 构造函数
   * @param titleOrOptions - 对话框标题或完整选项对象
   * @param content - 对话框内容（支持 HTML）（仅在第一个参数为字符串时使用）
   */
  constructor(titleOrOptions?: string | DialogOptions, content?: string) {
    const options: DialogOptions = typeof titleOrOptions === 'string' 
      ? { title: titleOrOptions, content }
      : (titleOrOptions || {})
    super(options)
    
    // 初始化默认值
    this.modelValue = options.modelValue ?? false
    this.title = options.title
    this.content = options.content
    this.width = options.width
    this.fullscreen = options.fullscreen ?? false
    this.top = options.top
    this.modal = options.modal ?? true
    this.modalClass = options.modalClass
    this.modalStyle = options.modalStyle
    this.modalBackdrop = options.modalBackdrop ?? true
    this.modalFade = options.modalFade ?? true
    this.appendToBody = options.appendToBody ?? false
    this.lockScroll = options.lockScroll ?? true
    this.openDelay = options.openDelay ?? 0
    this.closeDelay = options.closeDelay ?? 0
    this.closeOnClickModal = options.closeOnClickModal ?? false
    this.closeOnPressEscape = options.closeOnPressEscape ?? true
    this.showClose = options.showClose ?? true
    this.draggable = options.draggable ?? false
    this.center = options.center ?? false
    this.alignCenter = options.alignCenter ?? false
    this.destroyOnClose = options.destroyOnClose ?? false
    this.closeIcon = options.closeIcon
    this.zIndex = options.zIndex ?? 2000
    this.headerAriaLevel = options.headerAriaLevel ?? '2'
    this.header = options.header
    this.showFooter = options.showFooter ?? false
    this.confirmText = options.confirmText ?? '确定'
    this.cancelText = options.cancelText ?? '取消'
    this.dialogClass = options.dialogClass
  }

  // ==================== 属性获取方法 ====================
  
  /**
   * 获取对话框显示状态
   */
  getModelValue(): boolean {
    return this.modelValue
  }

  /**
   * 获取对话框标题
   */
  getTitle(): string | undefined {
    return this.title
  }

  /**
   * 获取对话框宽度
   */
  getWidth(): string | number | undefined {
    return this.width
  }

  /**
   * 获取对话框内容
   */
  getContent(): string | undefined {
    return this.content
  }

  // ==================== 属性设置方法 ====================
  /**
   * 设置对话框显示状态
   * @param value - true 显示，false 隐藏
   */
  setModelValue(value: boolean): this {
    this.modelValue = value
    this.setProperty('modelValue', value)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置对话框标题
   * @param title - 标题文本
   */
  setTitle(title: string): this {
    this.title = title
    this.setProperty('title', title)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置对话框宽度
   * @param width - 宽度值，支持字符串（如 '50%', '500px'）或数字
   */
  setWidth(width: string | number): this {
    this.width = width
    this.setProperty('width', width)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否全屏显示
   * @param fullscreen - true 全屏，false 非全屏
   */
  setFullscreen(fullscreen: boolean): this {
    this.fullscreen = fullscreen
    this.setProperty('fullscreen', fullscreen)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置对话框距离顶部的位置
   * @param top - 距离值，如 '15vh'
   */
  setTop(top: string): this {
    this.top = top
    this.setProperty('top', top)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否显示遮罩层
   * @param modal - true 显示遮罩，false 不显示
   */
  setModal(modal: boolean): this {
    this.modal = modal
    this.setProperty('modal', modal)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置遮罩层的自定义样式类名
   * @param modalClass - 样式类名
   */
  setModalClass(modalClass: string): this {
    this.modalClass = modalClass
    this.setProperty('modalClass', modalClass)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置遮罩层的自定义样式
   * @param modalStyle - 样式对象，如 { backgroundColor: 'rgba(0,0,0,0.8)' }
   */
  setModalStyle(modalStyle: Record<string, any>): this {
    this.modalStyle = modalStyle
    this.setProperty('modalStyle', modalStyle)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否显示遮罩层背景
   * @param modalBackdrop - true 显示背景，false 透明背景
   */
  setModalBackdrop(modalBackdrop: boolean): this {
    this.modalBackdrop = modalBackdrop
    this.setProperty('modalBackdrop', modalBackdrop)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置遮罩层淡入淡出动画
   * @param modalFade - true 启用动画，false 禁用动画
   */
  setModalFade(modalFade: boolean): this {
    this.modalFade = modalFade
    this.setProperty('modalFade', modalFade)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否将对话框挂载到 body
   * 建议设置为 true，避免样式和层级问题
   * @param appendToBody - true 挂载到 body，false 不挂载
   */
  setAppendToBody(appendToBody: boolean): this {
    this.appendToBody = appendToBody
    this.setProperty('appendToBody', appendToBody)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否锁定背景滚动
   * @param lockScroll - true 锁定，false 不锁定
   */
  setLockScroll(lockScroll: boolean): this {
    this.lockScroll = lockScroll
    this.setProperty('lockScroll', lockScroll)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置点击遮罩层是否关闭对话框
   * 模态对话框建议设置为 false，防止意外关闭
   * @param closeOnClickModal - true 点击关闭，false 不关闭（默认 false）
   */
  setCloseOnClickModal(closeOnClickModal: boolean): this {
    this.closeOnClickModal = closeOnClickModal
    this.setProperty('closeOnClickModal', closeOnClickModal)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置按 ESC 键是否关闭对话框
   * @param closeOnPressEscape - true 按 ESC 关闭，false 不关闭
   */
  setCloseOnPressEscape(closeOnPressEscape: boolean): this {
    this.closeOnPressEscape = closeOnPressEscape
    this.setProperty('closeOnPressEscape', closeOnPressEscape)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否显示关闭按钮
   * @param showClose - true 显示，false 不显示
   */
  setShowClose(showClose: boolean): this {
    this.showClose = showClose
    this.setProperty('showClose', showClose)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置对话框是否可拖动
   * @param draggable - true 可拖动，false 不可拖动
   */
  setDraggable(draggable: boolean): this {
    this.draggable = draggable
    this.setProperty('draggable', draggable)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置对话框是否居中显示
   * @param center - true 居中，false 不居中
   */
  setCenter(center: boolean): this {
    this.center = center
    this.setProperty('center', center)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置标题和内容是否居中
   * @param alignCenter - true 居中，false 不居中
   */
  setAlignCenter(alignCenter: boolean): this {
    this.alignCenter = alignCenter
    this.setProperty('alignCenter', alignCenter)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置关闭时是否销毁组件
   * @param destroyOnClose - true 销毁，false 不销毁
   */
  setDestroyOnClose(destroyOnClose: boolean): this {
    this.destroyOnClose = destroyOnClose
    this.setProperty('destroyOnClose', destroyOnClose)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置对话框层级（z-index）
   * @param zIndex - 层级值，默认 2000
   */
  setZIndex(zIndex: number): this {
    this.zIndex = zIndex
    this.setProperty('zIndex', zIndex)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置头部内容（覆盖标题）
   * @param header - 头部文本或 HTML
   */
  setHeader(header: string): this {
    this.header = header
    this.setProperty('header', header)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置对话框内容（支持 HTML）
   * @param content - 内容文本或 HTML
   */
  setContent(content: string): this {
    this.content = content
    this.setProperty('content', content)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置是否显示底部按钮（确认/取消）
   * @param showFooter - true 显示，false 不显示
   */
  setShowFooter(showFooter: boolean): this {
    this.showFooter = showFooter
    this.setProperty('showFooter', showFooter)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置确认按钮文本
   * @param confirmText - 按钮文本，默认 '确定'
   */
  setConfirmText(confirmText: string): this {
    this.confirmText = confirmText
    this.setProperty('confirmText', confirmText)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置取消按钮文本
   * @param cancelText - 按钮文本，默认 '取消'
   */
  setCancelText(cancelText: string): this {
    this.cancelText = cancelText
    this.setProperty('cancelText', cancelText)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置对话框的自定义样式类名
   * @param className - 样式类名
   */
  setClass(className: string): this {
    this.dialogClass = className
    this.setProperty('dialogClass', className)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  // ==================== 子组件管理方法 ====================
  
  /**
   * 重写 addChild 方法以支持在对话框内容中添加控件
   * @param child - BaseCommand 子组件实例
   */
  override addChild(child: BaseCommand<any, any>): this {
    console.log('addChild called, mounted:', this._mounted, 'contentContainer:', this.contentContainer)
    // 调用基类方法建立父子关系
    super.addChild(child)
    
    // 如果对话框已挂载且内容容器已准备好，立即渲染子组件
    if (this._mounted && this.contentContainer && this.contentContainer.parentNode) {
      console.log('Content container ready, rendering immediately')
      this.renderChild(child)
    } else if (this._mounted && this.modelValue) {
      // 如果对话框已经打开但内容容器还未附加，尝试附加
      console.log('Dialog is open, trying to attach content container')
      this.attachContentContainer()
    } else {
      console.log('Content container not ready, will render when dialog opens')
    }
    return this
  }
  
  /**
   * 重写 removeChild 方法
   * @param child - BaseCommand 子组件实例
   */
  override removeChild(child: BaseCommand<any, any>): this {
    super.removeChild(child)
    
    // 从内容容器中移除子组件元素
    const childElement = this.childElements.get(child)
    if (childElement && childElement.parentNode) {
      childElement.parentNode.removeChild(childElement)
    }
    this.childElements.delete(child)
    return this
  }
  
  /**
   * 渲染子组件到内容容器
   * @param child - BaseCommand 子组件实例
   */
  private renderChild(child: BaseCommand): void {
    console.log('renderChild called, contentContainer:', this.contentContainer)
    if (!this.contentContainer) {
      console.warn('No content container available')
      return
    }
    
    try {
      // 如果子组件已经渲染过且有映射，先移除旧的
      const oldElement = this.childElements.get(child)
      if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.removeChild(oldElement)
      }
      
      // 渲染子组件
      const childElement = child.render()
      console.log('Child element rendered:', childElement)
      
      // 挂载到内容容器
      this.contentContainer.appendChild(childElement)
      console.log('Child appended to content container')
      
      // 保存映射关系
      this.childElements.set(child, childElement)
    } catch (error) {
      console.error('Error rendering child component:', error)
    }
  }
  
  /**
   * 渲染所有子组件
   */
  private renderAllChildren(): void {
    if (!this.contentContainer) return
    
    this.getChildren().forEach(child => {
      this.renderChild(child)
    })
  }
  
  // ==================== 对话框控制方法 ====================
  
  /**
   * 打开对话框
   * 等同于调用 setModelValue(true)
   */
  open(): void {
    this.setModelValue(true)
  }

  /**
   * 关闭对话框
   * 等同于调用 setModelValue(false)
   */
  close(): void {
    this.setModelValue(false)
  }

  /**
   * 切换对话框显示状态
   * 如果当前是打开状态则关闭，如果是关闭状态则打开
   */
  toggle(): void {
    this.setModelValue(!this.modelValue)
  }

  /**
   * 渲染对话框为 DOM 元素
   * 创建 Vue 组件实例并挂载到容器中
   * @returns HTMLDivElement - 渲染后的容器元素
   */
  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    // 创建内容容器
    const contentWrapper = document.createElement('div')
    contentWrapper.className = 'nhai-dialog-content-wrapper'
    
    // 将 content 添加到内容容器
    if (self.content) {
      const contentDiv = document.createElement('div')
      contentDiv.innerHTML = self.content
      contentWrapper.appendChild(contentDiv)
    }
    
    // 保存内容容器的引用
    this.contentContainer = contentWrapper
    
    // 创建 Vue 组件包装器，绑定所有属性
    const DialogWrapper = defineComponent({
      setup() {
        return () => h(Dialog, {
          // 绑定所有属性
          modelValue: self.modelValue,
          title: self.title,
          width: self.width,
          fullscreen: self.fullscreen,
          top: self.top,
          modal: self.modal,
          modalClass: self.modalClass,
          modalStyle: self.modalStyle,
          modalBackdrop: self.modalBackdrop,
          modalFade: self.modalFade,
          appendToBody: self.appendToBody,
          lockScroll: self.lockScroll,
          openDelay: self.openDelay,
          closeDelay: self.closeDelay,
          closeOnClickModal: self.closeOnClickModal,
          closeOnPressEscape: self.closeOnPressEscape,
          showClose: self.showClose,
          draggable: self.draggable,
          center: self.center,
          alignCenter: self.alignCenter,
          destroyOnClose: self.destroyOnClose,
          closeIcon: self.closeIcon,
          zIndex: self.zIndex,
          headerAriaLevel: self.headerAriaLevel,
          header: self.header,
          content: self.content, // 先使用 content 属性
          showFooter: self.showFooter,
          confirmText: self.confirmText,
          cancelText: self.cancelText,
          dialogClass: self.dialogClass,
          
          // 绑定事件处理器
          onUpdateModelValue: (value: boolean) => {
            self.modelValue = value
          },
          onOpen: () => {
            self.emit('open')
            // 对话框打开时尝试附加内容容器
            self.attachContentContainer()
          },
          onOpened: () => {
            self.emit('opened')
            // 对话框完全打开后尝试附加内容容器和渲染子组件
            self.attachContentContainer()
          },
          onClose: () => {
            self.emit('close')
          },
          onClosed: () => {
            self.emit('closed')
          },
          onConfirm: () => {
            self.emit('confirm')
          },
          onCancel: () => {
            self.emit('cancel')
          }
        })
      }
    })

    // 创建并挂载 Vue 应用
    const app = createApp(DialogWrapper)
    app.use(ElementPlus) // 注册 Element Plus
    app.mount(container)
    this._appInstance = app
    
    this._element = container
    this._mounted = true

    // 如果设置了 appendToBody，将对话框挂载到 body
    // 这样可以避免样式和层级问题
    if (this.appendToBody) {
      document.body.appendChild(container)
    }
    
    // 如果对话框已经打开，立即尝试附加内容容器
    if (this.modelValue) {
      setTimeout(() => this.attachContentContainer())
    }

    return container
  }
  
  /**
   * 尝试附加内容容器到对话框内容区域
   * 在对话框打开时调用此方法
   */
  private attachContentContainer(attempt = 0): void {
    if (!this._element) return
    
    const maxAttempts = 20 // 最多尝试 20 次（约 2 秒）
    
    // 查找对话框内容区域
    // 当 appendToBody 为 true 时，Element Plus 会将对话框元素 teleport 到 body，所以不能在 container 中查找
    let dialogContent: Element | null = null
    
    if (this.appendToBody) {
      // 当使用 appendToBody 时，对话框元素被 teleport 到 body，需要从 body 中查找
      // 查找最近创建的对话框
      // 方法1: 通过 overlay 查找
      const overlays = document.querySelectorAll('.el-overlay')
      if (overlays.length > 0) {
        const lastOverlay = overlays[overlays.length - 1]
        dialogContent = lastOverlay.querySelector('.el-dialog__body')
        console.log('Found dialog in document.body via overlay:', lastOverlay)
      }
      
      // 方法2: 如果方法1失败，直接通过 dialog 查找
      if (!dialogContent) {
        const dialogs = document.querySelectorAll('.el-dialog')
        if (dialogs.length > 0) {
          const lastDialog = dialogs[dialogs.length - 1]
          dialogContent = lastDialog.querySelector('.el-dialog__body')
          console.log('Found dialog in document.body directly:', lastDialog)
        }
      }
    } else {
      // 不使用 appendToBody 时，对话框在 container 中
      dialogContent = this._element.querySelector('.el-dialog__body')
      console.log('Looking for dialog in container')
    }
    
    console.log('Dialog content area found:', dialogContent, 'attempt:', attempt)
    console.log('Element HTML:', this._element?.outerHTML?.substring(0, 200))
    
    if (!dialogContent) {
      if (attempt < maxAttempts) {
        // 100ms 后重试
        setTimeout(() => {
          this.attachContentContainer(attempt + 1)
        }, 100)
      } else {
        console.warn('Failed to find dialog content area after', maxAttempts, 'attempts')
        console.warn('Container element:', this._element)
        console.warn('AppendToBody:', this.appendToBody)
        console.warn('ModelValue:', this.modelValue)
        
        // 尝试查找任何对话框元素
        const allDialogs = document.querySelectorAll('.el-dialog')
        console.warn('Total dialogs found in document:', allDialogs.length)
        allDialogs.forEach((d, i) => {
          console.warn(`Dialog ${i}:`, d)
        })
      }
      return
    }
    
    if (!this.contentContainer) {
      console.warn('Content container not initialized')
      return
    }
    
    // 检查内容容器是否已经附加
    if (this.contentContainer.parentNode === dialogContent) {
      console.log('Content container already attached')
      // 如果已经附加，只需渲染所有子组件
      this.renderAllChildren()
      return
    }
    
    // 清空原有的 content 内容
    while (dialogContent.firstChild) {
      dialogContent.removeChild(dialogContent.firstChild)
    }
    
    // 附加内容容器到对话框内容区域
    dialogContent.appendChild(this.contentContainer)
    console.log('Content container appended')
    
    // 渲染所有子组件
    console.log('Rendering all children, count:', this.getChildren().length)
    this.renderAllChildren()
  }

  /**
   * 卸载对话框组件
   * 清理所有资源，包括从 DOM 中移除元素
   */
  override unmount(): void {
    // 清空子组件映射
    this.childElements.clear()
    
    super.unmount()
    
    // 如果对话框挂载在 body 上，需要手动移除
    if (this._element && this._element.parentNode) {
      this._element.parentNode.removeChild(this._element)
    }
    
    // 清理内容容器引用
    this.contentContainer = undefined
  }
}

export default NhaiDialogCommand

