// 属性面板管理 Composable
import type { PropertyConfig } from '../types/designer'

export function usePropertyPanel() {
  // 属性配置映射
  const propertyConfig: Record<string, PropertyConfig[]> = {
    button: [
      { key: 'text', label: '按钮文本', type: 'text', placeholder: '按钮文本' },
      { key: 'type', label: '按钮类型', type: 'select', options: [
        { value: 'primary', label: 'primary（主要）' },
        { value: 'success', label: 'success（成功）' },
        { value: 'warning', label: 'warning（警告）' },
        { value: 'danger', label: 'danger（危险）' },
        { value: 'info', label: 'info（信息）' },
        { value: 'text', label: 'text（文本）' }
      ]},
      { key: 'size', label: '按钮大小', type: 'select', options: [
        { value: 'large', label: 'large（大）' },
        { value: 'default', label: 'default（默认）' },
        { value: 'small', label: 'small（小）' }
      ]},
      { key: 'icon', label: '图标', type: 'text', placeholder: '如：el-icon-edit' },
      { key: 'plain', label: '朴素按钮', type: 'boolean' },
      { key: 'round', label: '圆角按钮', type: 'boolean' },
      { key: 'circle', label: '圆形按钮', type: 'boolean' },
      { key: 'loading', label: '加载中', type: 'boolean' },
      { key: 'disabled', label: '禁用', type: 'boolean' },
      { key: 'width', label: '宽度', type: 'text', placeholder: '如：100px 或 50%' },
      { key: 'height', label: '高度', type: 'text', placeholder: '如：40px' }
    ],
    input: [
      { key: 'placeholder', label: '占位轴线', type: 'text', placeholder: '请输入' },
      { key: 'type', label: '输入框类型', type: 'select', options: [
        { value: 'text', label: 'text（文本）' },
        { value: 'password', label: 'password（密码）' },
        { value: 'number', label: 'number（数字）' },
        { value: 'email', label: 'email（邮箱）' }
      ]},
      { key: 'value', label: '默认值', type: 'text' },
      { key: 'size', label: '大小', type: 'select', options: [
        { value: 'large', label: 'large（大）' },
        { value: 'default', label: 'default（默认）' },
        { value: 'small', label: 'small（小）' }
      ]},
      { key: 'disabled', label: '禁用', type: 'boolean' },
      { key: 'clearable', label: '可清空', type: 'boolean' },
      { key: 'showPassword', label: '显示密码按钮', type: 'boolean' },
      { key: 'prefixIcon', label: '前缀图标', type: 'text' },
      { key: 'suffixIcon', label: '后缀图标', type: 'text' },
      { key: 'maxlength', label: '最大长度', type: 'number' },
      { key: 'minlength', label: '最小长度', type: 'number' },
      { key: 'width', label: '宽度', type: 'text', placeholder: '如：200px' },
      { key: 'height', label: '高度', type: 'text', placeholder: '如：40px' }
    ],
    select: [
      { key: 'placeholder', label: '占位符', type: 'text', placeholder: '请选择' },
      { key: 'size', label: '大小', type: 'select', options: [
        { value: 'large', label: 'large（大）' },
        { value: 'default', label: 'default（默认）' },
        { value: 'small', label: 'small（小）' }
      ]},
      { key: 'disabled', label: '禁用', type: 'boolean' },
      { key: 'clearable', label: '可清空', type: 'boolean' },
      { key: 'multiple', label: '多选', type: 'boolean' },
      { key: 'width', label: '宽度', type: 'text', placeholder: '如：200px' },
      { key: 'height', label: '高度', type: 'text', placeholder: '如：40px' }
    ],
    switch: [
      { key: 'value', label: '当前值', type: 'boolean' },
      { key: 'size', label: '大小', type: 'select', options: [
        { value: 'large', label: 'large（大）' },
        { value: 'default', label: 'default（默认）' },
        { value: 'small', label: 'small（小）' }
      ]},
      { key: 'disabled', label: '禁用', type: 'boolean' },
      { key: 'activeText', label: '激活时文本', type: 'text' },
      { key: 'inactiveText', label: '未激活时文本', type: 'text' },
      { key: 'activeColor', label: '激活时颜色', type: 'text' },
      { key: 'inactiveColor', label: '未激活时颜色', type: 'text' }
    ],
    checkbox: [
      { key: 'text', label: '文本', type: 'text', placeholder: '复选框文本' },
      { key: 'value', label: '选中状态', type: 'boolean' },
      { key: 'size', label: '大小', type: 'select', options: [
        { value: 'large', label: 'large（大）' },
        { value: 'default', label: 'default（默认）' },
        { value: 'small', label: 'small（小）' }
      ]},
      { key: 'disabled', label: '禁用', type: 'boolean' },
      { key: 'indeterminate', label: '半选状态', type: 'boolean' }
    ],
    card: [
      { key: 'header', label: '卡片标题', type: 'text', placeholder: '卡片标题' },
      { key: 'content', label: '卡片内容', type: 'text', placeholder: '卡片内容' },
      { key: 'shadow', label: '阴影效果', type: 'select', options: [
        { value: 'always', label: 'always（总是）' },
        { value: 'hover', label: 'hover（悬停）' },
        { value: 'never', label: 'never（从不）' }
      ]},
      { key: 'width', label: '宽度', type: 'text', placeholder: '如：300px' },
      { key: 'height', label: '高度', type: 'text', placeholder: '如：200px' }
    ],
    dialog: [
      { key: 'title', label: '对话框标题', type: 'text', placeholder: '对话框标题' },
      { key: 'content', label: '对话框内容', type: 'text', placeholder: '对话框内容' },
      { key: 'width', label: '宽度', type: 'text', placeholder: '如：500px 或 50%' },
      { key: 'fullscreen', label: '全屏显示', type: 'boolean' },
      { key: 'modal', label: '显示遮罩层', type: 'boolean' },
      { key: 'showFooter', label: '显示底部', type: 'boolean' },
      { key: 'confirmText', label: '确认按钮文本', type: 'text' },
      { key: 'cancelText', label: '取消按钮文本', type: 'text' },
      { key: 'draggable', label: '可拖拽', type: 'boolean' },
      { key: 'center', label: '居中显示', type: 'boolean' },
      { key: 'closeOnClickModal', label: '点击遮罩关闭', type: 'boolean' },
      { key: 'closeOnPressEscape', label: '按 ESC 关闭', type: 'boolean' },
      { key: 'showClose', label: '显示关闭按钮', type: 'boolean' }
    ],
    widget: [
      { key: 'title', label: '窗口标题', type: 'text', placeholder: '窗口标题' },
      { key: 'width', label: '宽度', type: 'text', placeholder: '如：800px 或 50%' },
      { key: 'height', label: '高度', type: 'text', placeholder: '如：600px' },
      { key: 'fullscreen', label: '全屏显示', type: 'boolean' },
      { key: 'menuBarVisible', label: '显示菜单栏', type: 'boolean' },
      { key: 'canMinimize', label: '允许最小化', type: 'boolean' },
      { key: 'canMaximize', label: '允许最大化', type: 'boolean' },
      { key: 'canClose', label: '允许关闭', type: 'boolean' }
    ],
    grid: [
      { key: 'container', label: '容器模式', type: 'boolean' },
      { key: 'columns', label: '列数/列模板', type: 'text', placeholder: '如：12 或 repeat(12, 1fr)' },
      { key: 'rows', label: '行数/行模板', type: 'text', placeholder: '可选，如：3 或 repeat(3, 1fr)' },
      { key: 'templateAreas', label: '模板区域', type: 'text', placeholder: '可选，如："a a a" "b b c"' },
      { key: 'autoFlow', label: '自动流动', type: 'select', options: [
        { value: 'row', label: 'row（行方向）' },
        { value: 'column', label: 'column（列方向）' },
        { value: 'row dense', label: 'row dense（行方向紧密）' },
        { value: 'column dense', label: 'column dense（列方向紧密）' }
      ]},
      { key: 'justifyItems', label: '网格项水平对齐', type: 'select', options: [
        { value: 'start', label: 'start（起始）' },
        { value: 'end', label: 'end（末尾）' },
        { value: 'center', label: 'center（居中）' },
        { value: 'stretch', label: 'stretch（拉伸）' }
      ]},
      { key: 'alignItems', label: '网格项垂直对齐', type: 'select', options: [
        { value: 'start', label: 'start（起始）' },
        { value: 'end', label: 'end（末尾）' },
        { value: 'center', label: 'center（居中）' },
        { value: 'stretch', label: 'stretch（拉伸）' }
      ]},
      { key: 'justifyContent', label: '容器水平对齐', type: 'select', options: [
        { value: 'start', label: 'start（起始）' },
        { value: 'end', label: 'end（末尾）' },
        { value: 'center', label: 'center（居中）' },
        { value: 'stretch', label: 'stretch（拉伸）' },
        { value: 'space-around', label: 'space-around（环绕）' },
        { value: 'space-between', label: 'space-between（两端）' },
        { value: 'space-evenly', label: 'space-evenly（均匀）' }
      ]},
      { key: 'alignContent', label: '容器垂直对齐', type: 'select', options: [
        { value: 'start', label: 'start（起始）' },
        { value: 'end', label: 'end（末尾）' },
        { value: 'center', label: 'center（居中）' },
        { value: 'stretch', label: 'stretch（拉伸）' },
        { value: 'space-around', label: 'space-around（环绕）' },
        { value: 'space-between', label: 'space-between（两端）' },
        { value: 'space-evenly', label: 'space-evenly（均匀）' }
      ]},
      { key: 'spacing', label: '间距', type: 'number', placeholder: '如：2（表示 2*8=16px）' },
      { key: 'gap', label: '间距（自定义）', type: 'text', placeholder: '如：16px 或 1rem' },
      { key: 'layoutLeftMargin', label: '左边距', type: 'number', placeholder: '如：0 或 16（单位：px）' },
      { key: 'topMargin', label: '上边距', type: 'number', placeholder: '如：0 或 16（单位：px）' },
      { key: 'rightMargin', label: '右边距', type: 'number', placeholder: '如：0 或 16（单位：px）' },
      { key: 'bottomMargin', label: '下边距', type: 'number', placeholder: '如：0 或 16（单位：px）' },
      { key: 'layoutSpacing', label: '布局间距', type: 'number', placeholder: '等同于 spacing，如：2' },
      { key: 'layoutStretch', label: '布局拉伸', type: 'boolean' },
      { key: 'width', label: '宽度', type: 'text', placeholder: '如：800px' },
      { key: 'height', label: '高度', type: 'text', placeholder: '如：600px' }
    ],
    container: [
      { key: 'maxWidth', label: '最大宽度', type: 'select', options: [
        { value: 'xs', label: 'xs（超小）' },
        { value: 'sm', label: 'sm（小）' },
        { value: 'md', label: 'md（中）' },
        { value: 'lg', label: 'lg（大）' },
        { value: 'xl', label: 'xl（超大）' },
        { value: false, label: 'false（无限制）' }
      ]},
      { key: 'fixed', label: '固定宽度', type: 'boolean' },
      { key: 'disableGutters', label: '禁用间距', type: 'boolean' },
      { key: 'display', label: '显示方式', type: 'select', options: [
        { value: 'flex', label: 'flex（弹性布局）' },
        { value: 'block', label: 'block（块级）' }
      ]},
      { key: 'flexDirection', label: 'Flex 方向', type: 'select', options: [
        { value: 'row', label: 'row（水平）' },
        { value: 'column', label: 'column（垂直）' }
      ]},
      { key: 'gap', label: '间距', type: 'text', placeholder: '如：16px 或 2rem' },
      { key: 'alignItems', label: '垂直对齐', type: 'select', options: [
        { value: 'start', label: 'start（起始）' },
        { value: 'center', label: 'center（居中）' },
        { value: 'end', label: 'end（末尾）' },
        { value: 'stretch', label: 'stretch（拉伸）' }
      ]},
      { key: 'layoutLeftMargin', label: '左边距', type: 'number', placeholder: '如：0 或 16（单位：px）' },
      { key: 'topMargin', label: '上边距', type: 'number', placeholder: '如：0 或 16（单位：px）' },
      { key: 'rightMargin', label: '右边距', type: 'number', placeholder: '如：0 或 16（单位：px）' },
      { key: 'bottomMargin', label: '下边距', type: 'number', placeholder: '如：0 或 16（单位：px）' },
      { key: 'layoutSpacing', label: '布局间距', type: 'number', placeholder: 'Flex 布局间距，如：2（即 16px）' },
      { key: 'layoutStretch', label: '布局拉伸', type: 'boolean' },
      { key: 'width', label: '宽度', type: 'text', placeholder: '如：800px' },
      { key: 'height', label: '高度', type: 'text', placeholder: '如：600px' }
    ],
    splitpanel: [
      { key: 'orientation', label: '方向', type: 'select', options: [
        { value: 'horizontal', label: 'horizontal（水平）' },
        { value: 'vertical', label: 'vertical（垂直）' }
      ]},
      { key: 'splitPosition', label: '分割位置', type: 'number', placeholder: '如：50（表示50%）' },
      { key: 'minSize', label: '最小尺寸', type: 'number', placeholder: '如：20（表示20%）' },
      { key: 'maxSize', label: '最大尺寸', type: 'number', placeholder: '如：80（表示80%）' },
      { key: 'resizable', label: '可调整大小', type: 'boolean' },
      { key: 'disabled', label: '禁用', type: 'boolean' },
      { key: 'leftContent', label: '左侧内容', type: 'text' },
      { key: 'rightContent', label: '右侧内容', type: 'text' }
    ]
  }

  const getPropertyList = (type: string): PropertyConfig[] => {
    return propertyConfig[type] || []
  }

  const getPropertyConfig = () => propertyConfig

  return {
    propertyConfig,
    getPropertyList,
    getPropertyConfig
  }
}

