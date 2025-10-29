import { createApp, h, defineComponent } from 'vue'
import SplitPanel from './SplitPanel.vue'
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../lib/BaseCommand'

// 类型定义
export interface SplitPanelOptions extends IBaseCommandProps {
  orientation?: 'horizontal' | 'vertical'
  splitPosition?: number
  minSize?: number
  maxSize?: number
  resizable?: boolean
  disabled?: boolean
  leftContent?: string
  rightContent?: string
  onResize?: (position: number) => void
}

export interface SplitPanelEvents extends IBaseCommandEvents {
  resize: (position: number) => void
}

export class NhaiSplitPanelCommand extends BaseCommand<SplitPanelOptions, SplitPanelEvents> {
  private orientation: 'horizontal' | 'vertical' = 'horizontal'
  private splitPosition: number = 50
  private minSize: number = 20
  private maxSize: number = 80
  private resizable: boolean = true
  private disabled: boolean = false
  private leftContent?: string
  private rightContent?: string
  private onResize?: (position: number) => void

  constructor(
    leftContentOrOptions?: string | SplitPanelOptions,
    rightContent?: string,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ) {
    const options: SplitPanelOptions = typeof leftContentOrOptions === 'string' || !leftContentOrOptions
      ? { leftContent: leftContentOrOptions, rightContent, orientation }
      : leftContentOrOptions
    super(options)
    
    this.orientation = options.orientation ?? orientation
    this.splitPosition = options.splitPosition ?? 50
    this.minSize = options.minSize ?? 20
    this.maxSize = options.maxSize ?? 80
    this.resizable = options.resizable ?? true
    this.disabled = options.disabled ?? false
    this.leftContent = options.leftContent ?? (typeof leftContentOrOptions === 'string' ? leftContentOrOptions : undefined)
    this.rightContent = options.rightContent ?? rightContent
    this.onResize = options.onResize
    
    Object.assign(this._props, {
      orientation: this.orientation,
      splitPosition: this.splitPosition,
      minSize: this.minSize,
      maxSize: this.maxSize,
      resizable: this.resizable,
      disabled: this.disabled,
      leftContent: this.leftContent,
      rightContent: this.rightContent,
      ...options
    })
  }

  setOrientation(orientation: 'horizontal' | 'vertical'): this {
    this.orientation = orientation
    this.setProperty('orientation', orientation)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setSplitPosition(position: number): this {
    this.splitPosition = Math.max(this.minSize, Math.min(this.maxSize, position))
    this.setProperty('splitPosition', this.splitPosition)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  getSplitPosition(): number {
    return this.getProperty('splitPosition') ?? this.splitPosition
  }

  setMinSize(minSize: number): this {
    this.minSize = minSize
    this.setProperty('minSize', minSize)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setMaxSize(maxSize: number): this {
    this.maxSize = maxSize
    this.setProperty('maxSize', maxSize)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setResizable(resizable: boolean): this {
    this.resizable = resizable
    this.setProperty('resizable', resizable)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setDisabled(disabled: boolean): this {
    this.disabled = disabled
    this.setProperty('disabled', disabled)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setLeftContent(content: string): this {
    this.leftContent = content
    this.setProperty('leftContent', content)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setRightContent(content: string): this {
    this.rightContent = content
    this.setProperty('rightContent', content)
    if (this._mounted) {
      this.scheduleUpdate()
    }
    return this
  }

  setOnResize(callback: (position: number) => void): this {
    this.onResize = callback
    this.setProperty('onResize', callback)
    return this
  }

  protected doRender(): HTMLElement {
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '500px'
    
    const self = this

    const SplitPanelWrapper = defineComponent({
      setup() {
        return () => h(SplitPanel, {
          orientation: self.orientation,
          splitPosition: self.splitPosition,
          minSize: self.minSize,
          maxSize: self.maxSize,
          resizable: self.resizable,
          disabled: self.disabled,
          leftContent: self.leftContent,
          rightContent: self.rightContent,
          onResize: (position: number) => {
            if (self.onResize) {
              self.onResize(position)
            }
            self.emit('resize', position)
          }
        })
      }
    })

    const app = createApp(SplitPanelWrapper)
    app.mount(container)
    this._appInstance = app

    return container
  }

  override unmount(): void {
    super.unmount()
  }
}

export default NhaiSplitPanelCommand

