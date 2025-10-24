import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

/**
 * Material Slider 组件
 * 基于 Materialize CSS 框架的命令式 API 实现
 */
export class MaterialSlider extends NHAIWidget {
  private _value: number | number[] = 0                                                                           // 当前值
  private _min: number = 0                                                                                        // 最小值
  private _max: number = 100                                                                                     // 最大值
  private _step: number = 1                                                                                      // 步长
  private _disabled: boolean = false                                                                               // 是否禁用
  private _marks: boolean | Array<{ value: number; label?: string }> = false                                     // 刻度标记
  private _orientation: 'horizontal' | 'vertical' = 'horizontal'                                                 // 方向：水平、垂直
  private _size: 'small' | 'medium' = 'medium'                                                                    // 大小：小、中
  private _color: 'primary' | 'secondary' = 'primary'                                                            // 颜色：主要、次要
  private _track: 'normal' | 'inverted' | false = 'normal'                                                       // 轨道样式：正常、反转、无
  private _valueLabelDisplay: 'on' | 'auto' | 'off' = 'off'                                                      // 值标签显示：开启、自动、关闭
  private _onChange?: (value: number | number[]) => void                                                          // 变化回调函数
  // private _onChangeCommitted?: (value: number | number[]) => void  // 提交变化回调函数（暂时未使用）

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置值
  setValue(value: number | number[]): void {
    this._value = value
  }

  value(): number | number[] {
    return this._value
  }

  // 设置最小值
  setMin(min: number): void {
    this._min = min
  }

  min(): number {
    return this._min
  }

  // 设置最大值
  setMax(max: number): void {
    this._max = max
  }

  max(): number {
    return this._max
  }

  // 设置步长
  setStep(step: number): void {
    this._step = step
  }

  step(): number {
    return this._step
  }

  // 设置禁用状态
  setDisabled(disabled: boolean): void {
    this._disabled = disabled
  }

  disabled(): boolean {
    return this._disabled
  }

  // 设置标记
  setMarks(marks: boolean | Array<{ value: number; label?: string }>): void {
    this._marks = marks
  }

  marks(): boolean | Array<{ value: number; label?: string }> {
    return this._marks
  }

  // 设置方向
  setOrientation(orientation: 'horizontal' | 'vertical'): void {
    this._orientation = orientation
  }

  orientation(): string {
    return this._orientation
  }

  // 设置大小
  setSize(size: 'small' | 'medium'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置颜色
  setColor(color: 'primary' | 'secondary'): void {
    this._color = color
  }

  color(): string {
    return this._color
  }

  // 设置轨道
  setTrack(track: 'normal' | 'inverted' | false): void {
    this._track = track
  }

  track(): string | false {
    return this._track
  }

  // 设置值标签显示
  setValueLabelDisplay(display: 'on' | 'auto' | 'off'): void {
    this._valueLabelDisplay = display
  }

  valueLabelDisplay(): string {
    return this._valueLabelDisplay
  }

  // 设置事件处理器
  setOnChange(handler: (value: number | number[]) => void): void {
    this._onChange = handler
  }

  // setOnChangeCommitted(handler: (value: number | number[]) => void): void {
  //   this._onChangeCommitted = handler
  // }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-slider-container mui-slider-container--${this._orientation} mui-slider-container--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        display: 'flex',
        flexDirection: this._orientation === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        width: this._orientation === 'horizontal' ? '100%' : 'auto',
        height: this._orientation === 'vertical' ? '200px' : 'auto',
        position: 'relative',
        opacity: this._disabled ? 0.6 : 1
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 滑块轨道
    const trackHeight = this._size === 'small' ? '2px' : '4px'
    const trackProps: any = {
      className: 'mui-slider-track',
      style: {
        width: this._orientation === 'horizontal' ? '100%' : trackHeight,
        height: this._orientation === 'horizontal' ? trackHeight : '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.26)',
        borderRadius: '2px',
        position: 'relative',
        cursor: this._disabled ? 'not-allowed' : 'pointer'
      }
    }

    // 活动轨道
    const activeTrackProps: any = {
      className: 'mui-slider-track-active',
      style: {
        position: 'absolute',
        backgroundColor: this.getColorValue(),
        borderRadius: '2px',
        ...this.getActiveTrackStyle()
      }
    }

    // 滑块按钮
    const thumbSize = this._size === 'small' ? '16px' : '20px'
    const thumbProps: any = {
      className: 'mui-slider-thumb',
      style: {
        width: thumbSize,
        height: thumbSize,
        backgroundColor: this.getColorValue(),
        borderRadius: '50%',
        position: 'absolute',
        cursor: this._disabled ? 'not-allowed' : 'grab',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        border: '2px solid #ffffff',
        ...this.getThumbStyle()
      }
    }

    if (this._onChange) {
      thumbProps.onMouseDown = (e: any) => {
        if (!this._disabled) {
          this.handleThumbMove(e)
        }
      }
    }

    trackProps.children = [
      adapter.createElement('div', activeTrackProps),
      adapter.createElement('div', thumbProps)
    ]

    children.push(adapter.createElement('div', trackProps))

    // 标记
    if (this._marks && Array.isArray(this._marks)) {
      this._marks.forEach(mark => {
        const markProps: any = {
          className: 'mui-slider-mark',
          style: {
            position: 'absolute',
            ...this.getMarkStyle(mark.value)
          }
        }
        children.push(adapter.createElement('div', markProps, [mark.label || '']))
      })
    }

    return adapter.createElement('div', containerProps, children)
  }

  private getColorValue(): string {
    const colorMap: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#dc004e'
    }
    return colorMap[this._color] || colorMap.primary
  }

  private getActiveTrackStyle(): Record<string, any> {
    const percentage = this.getPercentage()
    
    if (this._orientation === 'horizontal') {
      return {
        left: '0%',
        width: `${percentage}%`,
        height: '100%'
      }
    } else {
      return {
        bottom: '0%',
        height: `${percentage}%`,
        width: '100%'
      }
    }
  }

  private getThumbStyle(): Record<string, any> {
    const percentage = this.getPercentage()
    
    if (this._orientation === 'horizontal') {
      return {
        left: `${percentage}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }
    } else {
      return {
        bottom: `${percentage}%`,
        left: '50%',
        transform: 'translate(-50%, 50%)'
      }
    }
  }

  private getMarkStyle(value: number): Record<string, any> {
    const percentage = ((value - this._min) / (this._max - this._min)) * 100
    
    if (this._orientation === 'horizontal') {
      return {
        left: `${percentage}%`,
        top: '100%',
        marginTop: '8px',
        fontSize: '0.75rem',
        color: 'rgba(0, 0, 0, 0.6)',
        transform: 'translateX(-50%)'
      }
    } else {
      return {
        bottom: `${percentage}%`,
        right: '100%',
        marginRight: '8px',
        fontSize: '0.75rem',
        color: 'rgba(0, 0, 0, 0.6)',
        transform: 'translateY(50%)'
      }
    }
  }

  private getPercentage(): number {
    const currentValue = Array.isArray(this._value) ? this._value[0] : this._value
    return ((currentValue - this._min) / (this._max - this._min)) * 100
  }

  private handleThumbMove(_e: any): void {
    // 这里应该实现拖拽逻辑
    // 为了简化，这里只是示例
    if (this._onChange) {
      this._onChange(this._value)
    }
  }
}
