/**
 * Dialog 命令式组件
 * 提供对话框的命令式 API，基于 Element Plus 的 el-dialog 组件
 */

import { createApp, h, defineComponent } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Dialog from './Dialog.vue'
import { BaseCommand } from '../../lib/BaseCommand'

export class NhaiDialogCommand extends BaseCommand {
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

  /**
   * 构造函数
   * @param title - 对话框标题
   * @param content - 对话框内容（支持 HTML）
   */
  constructor(title?: string, content?: string) {
    super()
    this.title = title
    this.content = content
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
  setModelValue(value: boolean): void {
    this.modelValue = value
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置对话框标题
   * @param title - 标题文本
   */
  setTitle(title: string): void {
    this.title = title
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置对话框宽度
   * @param width - 宽度值，支持字符串（如 '50%', '500px'）或数字
   */
  setWidth(width: string | number): void {
    this.width = width
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置是否全屏显示
   * @param fullscreen - true 全屏，false 非全屏
   */
  setFullscreen(fullscreen: boolean): void {
    this.fullscreen = fullscreen
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置对话框距离顶部的位置
   * @param top - 距离值，如 '15vh'
   */
  setTop(top: string): void {
    this.top = top
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置是否显示遮罩层
   * @param modal - true 显示遮罩，false 不显示
   */
  setModal(modal: boolean): void {
    this.modal = modal
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置遮罩层的自定义样式类名
   * @param modalClass - 样式类名
   */
  setModalClass(modalClass: string): void {
    this.modalClass = modalClass
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置遮罩层的自定义样式
   * @param modalStyle - 样式对象，如 { backgroundColor: 'rgba(0,0,0,0.8)' }
   */
  setModalStyle(modalStyle: Record<string, any>): void {
    this.modalStyle = modalStyle
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置是否显示遮罩层背景
   * @param modalBackdrop - true 显示背景，false 透明背景
   */
  setModalBackdrop(modalBackdrop: boolean): void {
    this.modalBackdrop = modalBackdrop
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置遮罩层淡入淡出动画
   * @param modalFade - true 启用动画，false 禁用动画
   */
  setModalFade(modalFade: boolean): void {
    this.modalFade = modalFade
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置是否将对话框挂载到 body
   * 建议设置为 true，避免样式和层级问题
   * @param appendToBody - true 挂载到 body，false 不挂载
   */
  setAppendToBody(appendToBody: boolean): void {
    this.appendToBody = appendToBody
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置是否锁定背景滚动
   * @param lockScroll - true 锁定，false 不锁定
   */
  setLockScroll(lockScroll: boolean): void {
    this.lockScroll = lockScroll
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置点击遮罩层是否关闭对话框
   * 模态对话框建议设置为 false，防止意外关闭
   * @param closeOnClickModal - true 点击关闭，false 不关闭（默认 false）
   */
  setCloseOnClickModal(closeOnClickModal: boolean): void {
    this.closeOnClickModal = closeOnClickModal
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置按 ESC 键是否关闭对话框
   * @param closeOnPressEscape - true 按 ESC 关闭，false 不关闭
   */
  setCloseOnPressEscape(closeOnPressEscape: boolean): void {
    this.closeOnPressEscape = closeOnPressEscape
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置是否显示关闭按钮
   * @param showClose - true 显示，false 不显示
   */
  setShowClose(showClose: boolean): void {
    this.showClose = showClose
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置对话框是否可拖动
   * @param draggable - true 可拖动，false 不可拖动
   */
  setDraggable(draggable: boolean): void {
    this.draggable = draggable
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置对话框是否居中显示
   * @param center - true 居中，false 不居中
   */
  setCenter(center: boolean): void {
    this.center = center
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置标题和内容是否居中
   * @param alignCenter - true 居中，false 不居中
   */
  setAlignCenter(alignCenter: boolean): void {
    this.alignCenter = alignCenter
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置关闭时是否销毁组件
   * @param destroyOnClose - true 销毁，false 不销毁
   */
  setDestroyOnClose(destroyOnClose: boolean): void {
    this.destroyOnClose = destroyOnClose
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置对话框层级（z-index）
   * @param zIndex - 层级值，默认 2000
   */
  setZIndex(zIndex: number): void {
    this.zIndex = zIndex
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置头部内容（覆盖标题）
   * @param header - 头部文本或 HTML
   */
  setHeader(header: string): void {
    this.header = header
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置对话框内容（支持 HTML）
   * @param content - 内容文本或 HTML
   */
  setContent(content: string): void {
    this.content = content
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置是否显示底部按钮（确认/取消）
   * @param showFooter - true 显示，false 不显示
   */
  setShowFooter(showFooter: boolean): void {
    this.showFooter = showFooter
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置确认按钮文本
   * @param confirmText - 按钮文本，默认 '确定'
   */
  setConfirmText(confirmText: string): void {
    this.confirmText = confirmText
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置取消按钮文本
   * @param cancelText - 按钮文本，默认 '取消'
   */
  setCancelText(cancelText: string): void {
    this.cancelText = cancelText
    if (this._mounted) {
      this.update()
    }
  }

  /**
   * 设置对话框的自定义样式类名
   * @param className - 样式类名
   */
  setClass(className: string): void {
    this.dialogClass = className
    if (this._mounted) {
      this.update()
    }
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
  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

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
          content: self.content,
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
          },
          onOpened: () => {
            self.emit('opened')
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

    return container
  }

  /**
   * 卸载对话框组件
   * 清理所有资源，包括从 DOM 中移除元素
   */
  override unmount(): void {
    super.unmount()
    // 如果对话框挂载在 body 上，需要手动移除
    if (this._element && this._element.parentNode) {
      this._element.parentNode.removeChild(this._element)
    }
  }
}

export default NhaiDialogCommand

