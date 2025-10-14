/**
 * NHAI框架无关的布局组件实现
 */

import { NHAIObject, NHAIRenderContext } from '../core/NHAICore'
import { NHAIFrameworkRegistry } from '../core/NHAICore'

// 基础布局类
export abstract class NHAILayout extends NHAIObject {
  protected _spacing: number = 8
  protected _margin: number | [number, number, number, number] = 0
  protected _alignment: 'start' | 'center' | 'end' | 'stretch' = 'start'

  setSpacing(spacing: number): void {
    this._spacing = spacing
  }

  spacing(): number {
    return this._spacing
  }

  setMargin(margin: number | [number, number, number, number]): void {
    this._margin = margin
  }

  margin(): number | [number, number, number, number] {
    return this._margin
  }

  setAlignment(alignment: 'start' | 'center' | 'end' | 'stretch'): void {
    this._alignment = alignment
  }

  alignment(): string {
    return this._alignment
  }

  addWidget(widget: NHAIObject): void {
    this.addChild(widget)
  }

  removeWidget(widget: NHAIObject): void {
    this.removeChild(widget)
  }

  widgets(): NHAIObject[] {
    return this.children()
  }

  protected getMarginStyle(): Record<string, any> {
    if (typeof this._margin === 'number') {
      return { margin: `${this._margin}px` }
    } else {
      const [top, right, bottom, left] = this._margin
      return { margin: `${top}px ${right}px ${bottom}px ${left}px` }
    }
  }
}

// 垂直布局
export class NHAIVBoxLayout extends NHAILayout {
  render(context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-vbox-layout',
      style: {
        ...this.getMergedStyle(),
        ...this.getMarginStyle(),
        display: 'flex',
        flexDirection: 'column',
        gap: `${this._spacing}px`,
        alignItems: this.getAlignmentValue(),
        justifyContent: 'flex-start'
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children = this._children.map(child => child.render(context))

    return adapter.createElement('div', props, children)
  }

  private getAlignmentValue(): string {
    const alignmentMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch'
    }
    return alignmentMap[this._alignment] || 'flex-start'
  }
}

// 水平布局
export class NHAIHBoxLayout extends NHAILayout {
  render(context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-hbox-layout',
      style: {
        ...this.getMergedStyle(),
        ...this.getMarginStyle(),
        display: 'flex',
        flexDirection: 'row',
        gap: `${this._spacing}px`,
        alignItems: 'center',
        justifyContent: this.getJustifyValue()
      }
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children = this._children.map(child => child.render(context))

    return adapter.createElement('div', props, children)
  }

  private getJustifyValue(): string {
    const alignmentMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch'
    }
    return alignmentMap[this._alignment] || 'flex-start'
  }
}

// 网格布局
export class NHAIGridLayout extends NHAILayout {
  private _columns: number = 1
  private _rows: number = 0

  setColumns(columns: number): void {
    this._columns = Math.max(1, columns)
  }

  columns(): number {
    return this._columns
  }

  setRows(rows: number): void {
    this._rows = Math.max(0, rows)
  }

  rows(): number {
    return this._rows
  }

  render(context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const props: any = {
      className: 'nhai-grid-layout',
      style: {
        ...this.getMergedStyle(),
        ...this.getMarginStyle(),
        display: 'grid',
        gridTemplateColumns: `repeat(${this._columns}, 1fr)`,
        gap: `${this._spacing}px`,
        alignItems: this.getAlignmentValue(),
        justifyContent: this.getJustifyValue()
      }
    }

    if (this._rows > 0) {
      props.style.gridTemplateRows = `repeat(${this._rows}, 1fr)`
    }

    if (this._id) props.id = this._id
    if (this._className) props.className += ` ${this._className}`

    const children = this._children.map(child => child.render(context))

    return adapter.createElement('div', props, children)
  }

  private getAlignmentValue(): string {
    const alignmentMap: Record<string, string> = {
      start: 'start',
      center: 'center',
      end: 'end',
      stretch: 'stretch'
    }
    return alignmentMap[this._alignment] || 'stretch'
  }

  private getJustifyValue(): string {
    const alignmentMap: Record<string, string> = {
      start: 'start',
      center: 'center',
      end: 'end',
      stretch: 'stretch'
    }
    return alignmentMap[this._alignment] || 'stretch'
  }
}
