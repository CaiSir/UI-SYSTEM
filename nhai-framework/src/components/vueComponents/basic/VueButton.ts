import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'
import { 
  createApp,
  h, 
  defineComponent,
  ref, 
  reactive, 
  watch
} from 'vue'
import { loadElementPlusButton } from '../VueComponentsLoader'

/**
 * Vue + Element UI 按钮组件类型
 */
export enum VueButtonType {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  TEXT = 'text'
}

/**
 * Vue + Element UI 按钮尺寸
 */
export enum VueButtonSize {
  LARGE = 'large',
  DEFAULT = 'default',
  SMALL = 'small'
}

/**
 * Vue + Element UI 按钮组件
 * 基于 Element UI 的命令式 API 实现
 */
export class VueButton extends NHAIWidget {
  private _text: string = ''
  private _type: VueButtonType = VueButtonType.PRIMARY
  private _size: VueButtonSize = VueButtonSize.DEFAULT
  private _plain: boolean = false
  private _round: boolean = false
  private _circle: boolean = false
  private _loading: boolean = false
  private _disabled: boolean = false
  private _icon?: string
  private _autofocus: boolean = false
  private _nativeType: 'button' | 'submit' | 'reset' = 'button'
  private _onClick?: () => void
  private _containerElement?: HTMLElement
  private _componentId: string
  private _vueAppInstance: any = null

  constructor(text: string = '', parent?: NHAIObject) {
    super(parent)
    this._text = text
    this._componentId = `vue-button-${Date.now()}-${Math.random()}`
  }

  // ========== 基础属性设置 ==========

  /**
   * 设置按钮文本
   */
  setText(text: string): void {
    this._text = text
  }

  text(): string {
    return this._text
  }

  /**
   * 设置按钮类型
   */
  setType(type: VueButtonType): void {
    this._type = type
  }

  type(): VueButtonType {
    return this._type
  }

  /**
   * 设置按钮尺寸
   */
  setSize(size: VueButtonSize): void {
    this._size = size
  }

  size(): VueButtonSize {
    return this._size
  }

  /**
   * 设置朴素按钮
   */
  setPlain(plain: boolean): void {
    this._plain = plain
  }

  plain(): boolean {
    return this._plain
  }

  /**
   * 设置圆角按钮
   */
  setRound(round: boolean): void {
    this._round = round
  }

  round(): boolean {
    return this._round
  }

  /**
   * 设置圆形按钮
   */
  setCircle(circle: boolean): void {
    this._circle = circle
  }

  circle(): boolean {
    return this._circle
  }

  /**
   * 设置加载状态
   */
  setLoading(loading: boolean): void {
    this._loading = loading
  }

  loading(): boolean {
    return this._loading
  }

  /**
   * 设置禁用状态
   */
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  /**
   * 设置图标
   */
  setIcon(icon: string): void {
    this._icon = icon
  }

  icon(): string | undefined {
    return this._icon
  }

  /**
   * 设置点击回调
   */
  setOnClick(callback: () => void): void {
    this._onClick = callback
  }

  // ========== 渲染方法 ==========

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    // 创建容器
    const containerProps: any = {
      className: 'vue-button-container',
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle()
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    // 添加右键菜单处理器
    this.applyContextMenuHandler(containerProps)

    const container = adapter.createElement('div', containerProps, [])
    
    // 如果是DOM元素，挂载Vue组件
    if (container instanceof HTMLElement) {
      this.mountVueComponent(container)
    }

    return container
  }

  /**
   * 挂载Vue组件到容器
   */
  private mountVueComponent(container: HTMLElement): void {
    this._containerElement = container

    // 使用预加载缓存，避免重复 import
    loadElementPlusButton()
      .then((Button) => {
        // 保存引用以便在Vue组件中使用
        const self = this

        // 使用 defineComponent 创建 Vue 组件（轻量级）
        const ButtonComponent = defineComponent({
          name: `VueButton-${this._componentId}`,
          setup() {
            // ✅ Vue 3 特性: 响应式状态
            const clickCount = ref(0)
            const buttonState = reactive({
              loading: self._loading,
              disabled: self._disabled
            })
            
            // 监听外部状态变化
            watch(() => self._loading, (newLoading) => {
              buttonState.loading = newLoading
            })
            
            watch(() => self._disabled, (newDisabled) => {
              buttonState.disabled = newDisabled
            })
            
            // 事件处理
            const handleClick = () => {
              clickCount.value++
              if (self._onClick) {
                self._onClick()
              }
            }
            
            // 返回渲染函数
            return () => h(Button, {
              type: self._type,
              size: self._size,
              plain: self._plain,
              round: self._round,
              circle: self._circle,
              loading: buttonState.loading,
              disabled: buttonState.disabled,
              icon: self._icon,
              autofocus: self._autofocus,
              nativeType: self._nativeType,
              onClick: handleClick
            }, {
              default: () => self._text || '按钮'
            })
          }
        })

        // 创建轻量级 app 并挂载
        const app = createApp(ButtonComponent)
        this._vueAppInstance = app
        app.mount(container)
      })
      .catch((error) => {
        console.error('Failed to mount Vue component:', error)
        this.mountNativeButton(container)
      })
  }

  /**
   * 挂载原生按钮（降级方案）
   */
  private mountNativeButton(container: HTMLElement): void {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) return

    const buttonStyle: any = {
      padding: '8px 16px',
      border: '1px solid #dcdfe6',
      borderRadius: '4px',
      backgroundColor: '#fff',
      color: '#606266',
      cursor: this._disabled ? 'not-allowed' : 'pointer'
    }

    const button = adapter.createElement('button', {
      innerText: this._text,
      disabled: this._disabled,
      style: buttonStyle,
      onClick: this._onClick
    }, [])

    container.appendChild(button)
  }
}

