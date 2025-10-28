import { createApp, h, defineComponent, type Component } from 'vue'
import Button from './Button.vue'
import { BaseCommand } from '../../lib/BaseCommand'

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
export class NhaiButtonCommand extends BaseCommand {
  public text: string = ''
  public type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' = 'primary'
  public size: 'large' | 'default' | 'small' = 'default'
  public plain: boolean = false
  public round: boolean = false
  public circle: boolean = false
  public loading: boolean = false
  public disabled: boolean = false
  public icon?: string
  public onClick?: () => void

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
   * 
   * 优化：使用缓存的组件定义，减少 defineComponent 的开销
   */
  render(): HTMLElement {
    const container = document.createElement('div')
    
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
      onClick: this.onClick
    }

    // 创建并挂载 Vue 应用
    const app = createApp(ButtonWrapper, props)
    app.mount(container)
    this._appInstance = app
    
    this._element = container
    this._mounted = true

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

