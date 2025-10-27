import { createApp, h, defineComponent } from 'vue'
import SplitPanel from './SplitPanel.vue'

export class VueSplitPanelCommand {
  private orientation: 'horizontal' | 'vertical' = 'horizontal'
  private splitPosition: number = 50
  private minSize: number = 20
  private maxSize: number = 80
  private resizable: boolean = true
  private disabled: boolean = false
  private leftContent?: string
  private rightContent?: string
  private onResize?: (position: number) => void
  private _appInstance: any = null

  constructor(
    leftContent?: string,
    rightContent?: string,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ) {
    this.leftContent = leftContent
    this.rightContent = rightContent
    this.orientation = orientation
  }

  setOrientation(orientation: 'horizontal' | 'vertical'): void {
    this.orientation = orientation
  }

  setSplitPosition(position: number): void {
    this.splitPosition = Math.max(this.minSize, Math.min(this.maxSize, position))
  }

  getSplitPosition(): number {
    return this.splitPosition
  }

  setMinSize(minSize: number): void {
    this.minSize = minSize
  }

  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize
  }

  setResizable(resizable: boolean): void {
    this.resizable = resizable
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled
  }

  setLeftContent(content: string): void {
    this.leftContent = content
  }

  setRightContent(content: string): void {
    this.rightContent = content
  }

  setOnResize(callback: (position: number) => void): void {
    this.onResize = callback
  }

  render(): HTMLElement {
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
          onResize: self.onResize
        })
      }
    })

    const app = createApp(SplitPanelWrapper)
    app.mount(container)
    this._appInstance = app

    return container
  }

  unmount(): void {
    if (this._appInstance) {
      this._appInstance.unmount()
      this._appInstance = null
    }
  }
}

export default VueSplitPanelCommand

