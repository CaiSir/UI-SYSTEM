<template>
  <div 
    ref="gridElement"
    :class="['qt-grid-layout', container ? 'qt-grid-layout--container' : '']"
    :style="gridStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Qt Grid Layout 风格的属性接口
 * 类似于 Qt 的 QGridLayout，支持行列拉伸因子、最小/最大尺寸等
 */
interface Props {
  // 基本属性
  container?: boolean          // 是否为容器模式
  
  // 网格尺寸
  columnCount?: number          // 列数（默认自动计算）
  rowCount?: number             // 行数（默认自动计算）
  
  // 拉伸因子（类似于 Qt 的 stretch factor）
  columnStretch?: number[]      // 每列的拉伸因子数组，如 [1, 2, 1] 表示3列，中间列拉伸2倍
  rowStretch?: number[]         // 每行的拉伸因子数组
  
  // 最小/最大尺寸（类似于 Qt 的 minimumSize/maximumSize）
  columnMinWidths?: (number | string)[]  // 每列最小宽度，如 [100, 'auto', 150]
  rowMinHeights?: (number | string)[]    // 每行最小高度
  columnMaxWidths?: (number | string)[]  // 每列最大宽度
  rowMaxHeights?: (number | string)[]    // 每行最大高度
  
  // 间距
  horizontalSpacing?: number | string    // 水平间距（列间距）
  verticalSpacing?: number | string      // 垂直间距（行间距）
  spacing?: number                       // 统一间距（如果设置了，horizontalSpacing 和 verticalSpacing 将使用此值）
  
  // 边距（内容边距，类似于 Qt 的 contentsMargins）
  contentsMargins?: {
    left?: number | string
    top?: number | string
    right?: number | string
    bottom?: number | string
  }
  
  // 对齐方式（网格整体对齐）
  horizontalAlignment?: 'left' | 'center' | 'right' | 'stretch'  // 水平对齐
  verticalAlignment?: 'top' | 'center' | 'bottom' | 'stretch'   // 垂直对齐
  
  // 布局拉伸
  layoutStretch?: boolean                 // 是否拉伸到父容器宽度
  
  // 兼容旧版本的属性（保留以支持向后兼容）
  columns?: number | string
  rows?: number | string
  gap?: string
  layoutLeftMargin?: number | string
  topMargin?: number | string
  rightMargin?: number | string
  bottomMargin?: number | string
  layoutSpacing?: number
}

const props = withDefaults(defineProps<Props>(), {
  container: true,
  columnCount: undefined,
  rowCount: undefined,
  columnStretch: undefined,
  rowStretch: undefined,
  columnMinWidths: undefined,
  rowMinHeights: undefined,
  columnMaxWidths: undefined,
  rowMaxHeights: undefined,
  horizontalSpacing: undefined,
  verticalSpacing: undefined,
  spacing: undefined,
  contentsMargins: undefined,
  horizontalAlignment: 'stretch',
  verticalAlignment: 'stretch',
  layoutStretch: false,
  // 兼容属性
  columns: undefined,
  rows: undefined,
  gap: undefined,
  layoutLeftMargin: undefined,
  topMargin: undefined,
  rightMargin: undefined,
  bottomMargin: undefined,
  layoutSpacing: undefined
})

const gridElement = ref<HTMLElement | null>(null)

const gridStyle = computed(() => {
  const style: Record<string, any> = {
    display: 'grid',
    boxSizing: 'border-box'
  }

  // 确定列数（优先使用新属性，兼容旧属性）
  let columnCount = props.columnCount
  if (columnCount === undefined && props.columns !== undefined) {
    columnCount = typeof props.columns === 'number' ? props.columns : undefined
  }
  
  // 确定行数
  let rowCount = props.rowCount
  if (rowCount === undefined && props.rows !== undefined) {
    rowCount = typeof props.rows === 'number' ? props.rows : undefined
  }

  // 生成列模板（使用拉伸因子）
  if (columnCount !== undefined) {
    if (props.columnStretch && props.columnStretch.length > 0) {
      // 使用拉伸因子生成 fr 单位
      const columnTemplates = Array.from({ length: columnCount }, (_, i) => {
        const stretch = props.columnStretch![i] ?? 1
        const minWidth = props.columnMinWidths?.[i]
        const maxWidth = props.columnMaxWidths?.[i]
        
        let template = `${stretch}fr`
        if (minWidth !== undefined) {
          const min = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
          template = `minmax(${min}, ${template})`
        }
        if (maxWidth !== undefined) {
          const max = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
          template = `minmax(${template}, ${max})`
        }
        
        return template
      })
      style.gridTemplateColumns = columnTemplates.join(' ')
    } else if (props.columnMinWidths || props.columnMaxWidths) {
      // 只有最小/最大宽度，没有拉伸因子
      const columnTemplates = Array.from({ length: columnCount }, (_, i) => {
        const minWidth = props.columnMinWidths?.[i]
        const maxWidth = props.columnMaxWidths?.[i]
        
        if (minWidth !== undefined && maxWidth !== undefined) {
          const min = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
          const max = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
          return `minmax(${min}, ${max})`
        } else if (minWidth !== undefined) {
          const min = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
          return `minmax(${min}, 1fr)`
        } else if (maxWidth !== undefined) {
          const max = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
          return `minmax(0, ${max})`
        }
        return '1fr'
      })
      style.gridTemplateColumns = columnTemplates.join(' ')
    } else {
      // 默认：所有列等宽
      style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`
    }
  } else if (typeof props.columns === 'string') {
    // 兼容旧版本：字符串模板
    style.gridTemplateColumns = props.columns
  }

  // 生成行模板（使用拉伸因子）
  if (rowCount !== undefined) {
    if (props.rowStretch && props.rowStretch.length > 0) {
      // 使用拉伸因子生成 fr 单位
      const rowTemplates = Array.from({ length: rowCount }, (_, i) => {
        const stretch = props.rowStretch![i] ?? 1
        const minHeight = props.rowMinHeights?.[i]
        const maxHeight = props.rowMaxHeights?.[i]
        
        let template = `${stretch}fr`
        if (minHeight !== undefined) {
          const min = typeof minHeight === 'number' ? `${minHeight}px` : minHeight
          template = `minmax(${min}, ${template})`
        }
        if (maxHeight !== undefined) {
          const max = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
          template = `minmax(${template}, ${max})`
        }
        
        return template
      })
      style.gridTemplateRows = rowTemplates.join(' ')
    } else if (props.rowMinHeights || props.rowMaxHeights) {
      // 只有最小/最大高度，没有拉伸因子
      const rowTemplates = Array.from({ length: rowCount }, (_, i) => {
        const minHeight = props.rowMinHeights?.[i]
        const maxHeight = props.rowMaxHeights?.[i]
        
        if (minHeight !== undefined && maxHeight !== undefined) {
          const min = typeof minHeight === 'number' ? `${minHeight}px` : minHeight
          const max = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
          return `minmax(${min}, ${max})`
        } else if (minHeight !== undefined) {
          const min = typeof minHeight === 'number' ? `${minHeight}px` : minHeight
          return `minmax(${min}, 1fr)`
        } else if (maxHeight !== undefined) {
          const max = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
          return `minmax(0, ${max})`
        }
        return '1fr'
      })
      style.gridTemplateRows = rowTemplates.join(' ')
    } else {
      // 默认：所有行等高（根据内容）
      style.gridTemplateRows = `repeat(${rowCount}, auto)`
    }
  } else if (typeof props.rows === 'string') {
    // 兼容旧版本：字符串模板
    style.gridTemplateRows = props.rows
  } else {
    // 未指定行数，使用自动行
    style.gridAutoRows = 'auto'
  }

  // 间距设置（Qt 风格：分别设置水平和垂直间距）
  const formatSpacing = (value: number | string | undefined): string | undefined => {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'number') {
      return `${value}px`
    }
    return value as string
  }

  // 优先使用新属性 spacing，然后是 horizontalSpacing/verticalSpacing，最后是兼容属性
  const effectiveSpacing = props.spacing ?? 
                           (props.layoutSpacing !== undefined ? props.layoutSpacing * 8 : undefined)
  
  if (props.gap) {
    // 兼容旧版本：统一间距
    style.gap = props.gap
  } else if (effectiveSpacing !== undefined) {
    // 使用统一间距
    style.gap = formatSpacing(effectiveSpacing)
  } else {
    // 分别设置水平和垂直间距
    const hSpacing = formatSpacing(props.horizontalSpacing)
    const vSpacing = formatSpacing(props.verticalSpacing)
    
    if (hSpacing !== undefined || vSpacing !== undefined) {
      style.columnGap = hSpacing ?? '0'
      style.rowGap = vSpacing ?? '0'
    }
  }

  // 边距设置（Qt 风格：contentsMargins）
  const formatMargin = (value: number | string | undefined): string | undefined => {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'number') {
      return `${value}px`
    }
    return value as string
  }

  if (props.contentsMargins) {
    // 新属性：contentsMargins
    if (props.contentsMargins.left !== undefined) {
      style.paddingLeft = formatMargin(props.contentsMargins.left)
    }
    if (props.contentsMargins.top !== undefined) {
      style.paddingTop = formatMargin(props.contentsMargins.top)
    }
    if (props.contentsMargins.right !== undefined) {
      style.paddingRight = formatMargin(props.contentsMargins.right)
    }
    if (props.contentsMargins.bottom !== undefined) {
      style.paddingBottom = formatMargin(props.contentsMargins.bottom)
    }
  } else {
    // 兼容旧版本：单独的边距属性
    if (props.layoutLeftMargin !== undefined && props.layoutLeftMargin !== null) {
      style.paddingLeft = formatMargin(props.layoutLeftMargin)
    }
    if (props.topMargin !== undefined && props.topMargin !== null) {
      style.paddingTop = formatMargin(props.topMargin)
    }
    if (props.rightMargin !== undefined && props.rightMargin !== null) {
      style.paddingRight = formatMargin(props.rightMargin)
    }
    if (props.bottomMargin !== undefined && props.bottomMargin !== null) {
      style.paddingBottom = formatMargin(props.bottomMargin)
    }
  }

  // 对齐方式（Qt 风格）
  // 水平对齐
  switch (props.horizontalAlignment) {
    case 'left':
      style.justifyItems = 'start'
      style.justifyContent = 'start'
      break
    case 'center':
      style.justifyItems = 'center'
      style.justifyContent = 'center'
      break
    case 'right':
      style.justifyItems = 'end'
      style.justifyContent = 'end'
      break
    case 'stretch':
    default:
      style.justifyItems = 'stretch'
      style.justifyContent = 'stretch'
      break
  }

  // 垂直对齐
  switch (props.verticalAlignment) {
    case 'top':
      style.alignItems = 'start'
      style.alignContent = 'start'
      break
    case 'center':
      style.alignItems = 'center'
      style.alignContent = 'center'
      break
    case 'bottom':
      style.alignItems = 'end'
      style.alignContent = 'end'
      break
    case 'stretch':
    default:
      style.alignItems = 'stretch'
      style.alignContent = 'stretch'
      break
  }

  // 布局拉伸
  if (props.layoutStretch) {
    style.width = '100%'
    style.height = '100%'
  }

  return style
})
</script>

<style scoped>
.qt-grid-layout {
  position: relative;
  padding: 0;
  margin: 0;
}

.qt-grid-layout--container {
  /* 容器模式样式（可根据需要扩展） */
  width: 100%;
}
</style>

