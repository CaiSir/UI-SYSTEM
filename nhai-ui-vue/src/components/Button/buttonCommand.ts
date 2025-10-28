import { createApp, h, defineComponent } from 'vue'
import Button from './Button.vue'
import { BaseCommand } from '../../lib/BaseCommand'

/**
 * Vue 按钮的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 继承 BaseCommand 获得统一的接口和生命周期
 */
export class VueButtonCommand extends BaseCommand {
  private text: string = ''
  private type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' = 'primary'
  private size: 'large' | 'default' | 'small' = 'default'
  private plain: boolean = false
  private round: boolean = false
  private circle: boolean = false
  private loading: boolean = false
  private disabled: boolean = false
  private icon?: string
  private onClick?: () => void

  constructor(text: string = '') {
    super()
    this.text = text
  }

  /**
   * 设置按钮文本
   */
  setText(text: string): void {
    this.text = text
  }

  /**
   * 获取按钮文本
   */
  getText(): string {
    return this.text
  }

  /**
   * 设置按钮类型
   */
  setType(type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'): void {
    this.type = type
  }

  /**
   * 设置按钮尺寸
   */
  setSize(size: 'large' | 'default' | 'small'): void {
    this.size = size
  }

  /**
   * 设置朴素按钮
   */
  setPlain(plain: boolean): void {
    this.plain = plain
  }

  /**
   * 设置圆角按钮
   */
  setRound(round: boolean): void {
    this.round = round
  }

  /**
   * 设置圆形按钮
   */
  setCircle(circle: boolean): void {
    this.circle = circle
  }

  /**
   * 设置加载状态
   */
  setLoading(loading: boolean): void {
    this.loading = loading
  }

  /**
   * 设置禁用状态
   */
  setDisabled(disabled: boolean): void {
    this.disabled = disabled
  }

  /**
   * 设置图标
   */
  setIcon(icon: string): void {
    this.icon = icon
  }

  /**
   * 设置点击回调
   */
  setOnClick(callback: () => void): void {
    this.onClick = callback
  }

  /**
   * 渲染为 Vue 组件（命令式）
   * 返回 HTML 元素，可以直接添加到 DOM
   */
  render(): HTMLElement {
    const container = document.createElement('div')
    const self = this

    // 创建组件包装器
    const ButtonWrapper = defineComponent({
      setup() {
        const handleClick = () => {
          if (self.onClick) {
            self.onClick()
          }
        }

        return () => h(Button, {
          text: self.text,
          type: self.type,
          size: self.size,
          plain: self.plain,
          round: self.round,
          circle: self.circle,
          loading: self.loading,
          disabled: self.disabled,
          icon: self.icon,
          onClick: handleClick
        })
      }
    })

    // 创建并挂载 Vue 应用
    const app = createApp(ButtonWrapper)
    app.mount(container)
    this._appInstance = app
    
    this._element = container
    this._mounted = true

    return container
  }

  override unmount(): void {
    super.unmount()
  }

  /**
   * 降级方案：原生按钮（当 Vue 不可用时）
   */
  renderFallback(): HTMLElement {
    const button = document.createElement('button')
    button.textContent = this.text
    button.disabled = this.disabled
    button.className = `el-button el-button--${this.type}`
    
    if (this.onClick) {
      button.addEventListener('click', this.onClick)
    }
    
    return button
  }
}

export default VueButtonCommand

