import { createApp, h, defineComponent, type Component } from 'vue'
import Button from './Button.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface ButtonOptions extends IBaseCommandProps {
  text?: string
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  size?: 'large' | 'default' | 'small'
  plain?: boolean
  round?: boolean
  circle?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: string
  onClick?: () => void
}

export interface ButtonEvents extends IBaseCommandEvents {
  click: () => void
}

/**
 * 缓存按钮包装器组件定义
 * 避免每次创建新实例时重复执行 defineComponent
 */
let cachedButtonWrapper: Component | null = null

/**
 * 获取或创建按钮包装器组件
 * 优化：组件定义只创建一次，减少开销
 */
function getButtonWrapper(): Component {
  if (!cachedButtonWrapper) {
    cachedButtonWrapper = defineComponent({
      props: {
        text: String,
        type: String,
        size: String,
        plain: Boolean,
        round: Boolean,
        circle: Boolean,
        loading: Boolean,
        disabled: Boolean,
        icon: String,
        onClick: Function
      },
      setup(props: any) {
        const handleClick = () => {
          if (props.onClick) {
            props.onClick()
          }
        }

        return () => h(Button, {
          text: props.text,
          type: props.type,
          size: props.size,
          plain: props.plain,
          round: props.round,
          circle: props.circle,
          loading: props.loading,
          disabled: props.disabled,
          icon: props.icon,
          onClick: handleClick
        })
      }
    })
  }
  return cachedButtonWrapper
}

/**
 * NHAI 按钮的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 继承 BaseCommand 获得统一的接口和生命周期
 * 
 * 优化：使用缓存的组件定义，减少重复创建开销
 */
export class NhaiButtonCommand extends BaseCommand<ButtonOptions, ButtonEvents> {
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

  constructor(textOrOptions: string | ButtonOptions = '') {
    const options: ButtonOptions = typeof textOrOptions === 'string' 
      ? { text: textOrOptions }
      : textOrOptions
    super(options)
    
    // 初始化属性
    this.text = options.text ?? ''
    this.type = options.type ?? 'primary'
    this.size = options.size ?? 'default'
    this.plain = options.plain ?? false
    this.round = options.round ?? false
    this.circle = options.circle ?? false
    this.loading = options.loading ?? false
    this.disabled = options.disabled ?? false
    this.icon = options.icon
    this.onClick = options.onClick
    
    // 同步到 _props
    Object.assign(this._props, {
      text: this.text,
      type: this.type,
      size: this.size,
      plain: this.plain,
      round: this.round,
      circle: this.circle,
      loading: this.loading,
      disabled: this.disabled,
      icon: this.icon,
      onClick: this.onClick,
      ...options
    })
  }

  /**
   * 设置按钮文本
   */
  setText(text: string): this {
    this.text = text
    this.setProperty('text', text)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 获取按钮文本
   */
  getText(): string {
    return this.getProperty('text') || this.text
  }

  /**
   * 设置按钮类型
   */
  setType(type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'): this {
    this.type = type
    this.setProperty('type', type)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置按钮尺寸
   */
  setSize(size: 'large' | 'default' | 'small'): this {
    this.size = size
    this.setProperty('size', size)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置朴素按钮
   */
  setPlain(plain: boolean): this {
    this.plain = plain
    this.setProperty('plain', plain)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置圆角按钮
   */
  setRound(round: boolean): this {
    this.round = round
    this.setProperty('round', round)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置圆形按钮
   */
  setCircle(circle: boolean): this {
    this.circle = circle
    this.setProperty('circle', circle)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置加载状态
   */
  setLoading(loading: boolean): this {
    this.loading = loading
    this.setProperty('loading', loading)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置禁用状态
   */
  setDisabled(disabled: boolean): this {
    this.disabled = disabled
    this.setProperty('disabled', disabled)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置图标
   */
  setIcon(icon: string): this {
    this.icon = icon
    this.setProperty('icon', icon)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  /**
   * 设置点击回调
   */
  setOnClick(callback: () => void): this {
    this.onClick = callback
    this.setProperty('onClick', callback)
    return this
  }

  /**
   * 渲染为 Vue 组件（命令式）
   * 返回 HTML 元素，可以直接添加到 DOM
   * 
   * 优化：使用缓存的组件定义，减少 defineComponent 的开销
   */
  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    const self = this
    
    // 使用缓存的组件定义
    const ButtonWrapper = getButtonWrapper()

    // 传递 props 给组件
    const props = {
      text: this.text,
      type: this.type,
      size: this.size,
      plain: this.plain,
      round: this.round,
      circle: this.circle,
      loading: this.loading,
      disabled: this.disabled,
      icon: this.icon,
      onClick: () => {
        if (this.onClick) {
          this.onClick()
        }
        self.emit('click')
      }
    }

    // 创建并挂载 Vue 应用
    const app = createApp(ButtonWrapper, props)
    app.mount(container)
    this._appInstance = app

    return container
  }

  /**
   * 批量渲染多个按钮（优化方法）
   * 使用一个共享的 Vue 应用来渲染所有按钮
   * 可以显著提升性能和减少内存占用
   * 
   * @param buttons - 要渲染的按钮命令数组
   * @param container - 目标容器（可选）
   * @returns HTML 元素数组
   */
  static renderBatch(buttons: NhaiButtonCommand[], container?: HTMLElement): HTMLElement[] {
    const ButtonWrapper = getButtonWrapper()
    
    // 为每个按钮创建 props
    const buttonProps = buttons.map(btn => ({
      text: btn.text,
      type: btn.type,
      size: btn.size,
      plain: btn.plain,
      round: btn.round,
      circle: btn.circle,
      loading: btn.loading,
      disabled: btn.disabled,
      icon: btn.icon,
      onClick: btn.onClick
    }))

    // 创建单个应用来渲染所有按钮
    const app = createApp({
      render() {
        return buttonProps.map(props => h(ButtonWrapper, props))
      }
    })

    const wrapper = container || document.createElement('div')
    app.mount(wrapper)
    
    // 返回所有按钮元素
    return Array.from(wrapper.children) as HTMLElement[]
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

export default NhaiButtonCommand

