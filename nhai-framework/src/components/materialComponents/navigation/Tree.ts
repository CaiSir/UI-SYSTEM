import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface TreeNode {
  id: string | number
  label: string
  data?: any
  disabled?: boolean
  checked?: boolean
  expanded?: boolean
  children?: TreeNode[]
  icon?: string
  onClick?: () => void
}

/**
 * Material UI Tree 组件（树形目录组件）
 * 用于展示层次化数据，支持展开/折叠、选中/取消选中等功能
 */
export class MaterialTree extends NHAIWidget {
  private _nodes: TreeNode[] = []
  private _variant: 'default' | 'bordered' | 'compact' = 'default'
  private _size: 'small' | 'medium' | 'large' = 'medium'
  private _showCheckbox: boolean = false
  private _checkStrictly: boolean = false // 父子节点是否关联
  private _selectable: boolean = true
  private _defaultExpandAll: boolean = false
  private _expandedKeys: Set<string | number> = new Set()
  private _selectedKeys: Set<string | number> = new Set()
  private _checkedKeys: Set<string | number> = new Set()
  private _clickTimers: Map<string | number, any> = new Map()
  private _onSelect?: (selectedKeys: (string | number)[], selectedNodes: TreeNode[]) => void
  private _onCheck?: (checkedKeys: (string | number)[], checkedNodes: TreeNode[]) => void
  private _onExpand?: (expandedKeys: (string | number)[], expandedNodes: TreeNode[]) => void
  private _onRerender?: () => void

  constructor(parent?: NHAIObject) {
    super(parent)
    this._expandedKeys = new Set()
    this._selectedKeys = new Set()
    this._checkedKeys = new Set()
    this._clickTimers = new Map()
  }

  // 设置树节点
  setNodes(nodes: TreeNode[]): void {
    this._nodes = nodes
    this.initializeNodesState(nodes)
    if (this._defaultExpandAll) {
      this.expandAll()
    }
  }

  nodes(): TreeNode[] {
    return this._nodes
  }

  // 初始化节点状态
  private initializeNodesState(nodes: TreeNode[]): void {
    nodes.forEach(node => {
      if (node.expanded) {
        this._expandedKeys.add(node.id)
      }
      if (node.checked) {
        this._checkedKeys.add(node.id)
      }
      if (node.children && node.children.length > 0) {
        this.initializeNodesState(node.children)
      }
    })
  }

  // 设置变体
  setVariant(variant: 'default' | 'bordered' | 'compact'): void {
    this._variant = variant
  }

  variant(): string {
    return this._variant
  }

  // 设置大小
  setSize(size: 'small' | 'medium' | 'large'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置显示复选框
  setShowCheckbox(show: boolean): void {
    this._showCheckbox = show
  }

  showCheckbox(): boolean {
    return this._showCheckbox
  }

  // 设置严格模式（父子不关联）
  setCheckStrictly(strictly: boolean): void {
    this._checkStrictly = strictly
  }

  checkStrictly(): boolean {
    return this._checkStrictly
  }

  // 设置可选择
  setSelectable(selectable: boolean): void {
    this._selectable = selectable
  }

  selectable(): boolean {
    return this._selectable
  }

  // 设置默认展开全部
  setDefaultExpandAll(expandAll: boolean): void {
    this._defaultExpandAll = expandAll
  }

  defaultExpandAll(): boolean {
    return this._defaultExpandAll
  }

  // 展开指定节点
  expand(key: string | number): void {
    this._expandedKeys.add(key)
  }

  // 折叠指定节点
  collapse(key: string | number): void {
    this._expandedKeys.delete(key)
  }

  // 切换展开/折叠
  toggleExpand(key: string | number): void {
    if (this._expandedKeys.has(key)) {
      this._expandedKeys.delete(key)
    } else {
      this._expandedKeys.add(key)
    }
  }

  // 展开全部
  expandAll(): void {
    const keys = this.getAllNodeKeys(this._nodes)
    keys.forEach(key => this._expandedKeys.add(key))
  }

  // 折叠全部
  collapseAll(): void {
    this._expandedKeys.clear()
  }

  // 获取所有节点键
  private getAllNodeKeys(nodes: TreeNode[]): (string | number)[] {
    const keys: (string | number)[] = []
    nodes.forEach(node => {
      keys.push(node.id)
      if (node.children && node.children.length > 0) {
        keys.push(...this.getAllNodeKeys(node.children))
      }
    })
    return keys
  }

  // 检查节点是否展开
  isNodeExpanded(nodeId: string | number): boolean {
    return this._expandedKeys.has(nodeId)
  }

  // 设置节点展开状态
  setNodeExpanded(nodeId: string | number, expanded: boolean): void {
    if (expanded) {
      this._expandedKeys.add(nodeId)
    } else {
      this._expandedKeys.delete(nodeId)
    }
  }

  // 设置选中节点
  setSelectedKeys(keys: (string | number)[]): void {
    this._selectedKeys = new Set(keys)
  }

  selectedKeys(): (string | number)[] {
    return Array.from(this._selectedKeys)
  }

  // 设置选中节点
  setCheckedKeys(keys: (string | number)[]): void {
    this._checkedKeys = new Set(keys)
  }

  checkedKeys(): (string | number)[] {
    return Array.from(this._checkedKeys)
  }

  // 设置事件处理器
  setOnSelect(handler: (selectedKeys: (string | number)[], selectedNodes: TreeNode[]) => void): void {
    this._onSelect = handler
  }

  setOnCheck(handler: (checkedKeys: (string | number)[], checkedNodes: TreeNode[]) => void): void {
    this._onCheck = handler
  }

  setOnExpand(handler: (expandedKeys: (string | number)[], expandedNodes: TreeNode[]) => void): void {
    this._onExpand = handler
  }

  // 设置重新渲染回调（用于在Vanilla环境中手动触发重新渲染）
  setOnRerender(callback: () => void): void {
    this._onRerender = callback
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-tree mui-tree--${this._variant} mui-tree--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle()
      },
      onClick: (e: Event) => this.handleTreeClick(e),
      onDblClick: () => this.handleTreeDblClick()
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children: any[] = this._nodes.map((node) => 
      this.renderTreeNode(adapter, node, 0)
    )

    return adapter.createElement('div', containerProps, children)
  }

  // 处理树容器点击事件（事件委托）
  private handleTreeClick(e: Event): void {
    const target = e.target as HTMLElement
    const nodeElement = target.closest('.mui-tree-node')
    
    if (!nodeElement) return

    const nodeId = nodeElement.getAttribute('data-node-id')
    if (!nodeId) return

    // 找到对应的节点
    const node = this.findNodeById(this._nodes, nodeId)
    if (!node || node.disabled) return

    // 处理节点点击
    const timer = this._clickTimers.get(node.id)
    
    if (timer) {
      clearTimeout(timer)
      this._clickTimers.delete(node.id)
      
      // 双击：展开/折叠该节点的所有子节点
      const hasChildren = node.children && node.children.length > 0
      if (hasChildren) {
        const isExpanded = this._expandedKeys.has(node.id)
        if (isExpanded) {
          this.collapseNode(node)
        } else {
          this.expandNode(node)
        }
        
        // 触发重新渲染
        this.triggerRerender()
      }
    } else {
      // 单击处理
      const newTimer = setTimeout(() => {
        this.handleNodeClick(node)
        this._clickTimers.delete(node.id)
      }, 250)
      this._clickTimers.set(node.id, newTimer)
    }
  }

  // 处理树容器双击事件
  private handleTreeDblClick(): void {
    // 双击事件不在此处处理
  }

  // 触发重新渲染的辅助方法
  private triggerRerender(): void {
    if (this._onExpand) {
      const expandedNodes = this.findNodesByIds(this._nodes, Array.from(this._expandedKeys))
      this._onExpand(Array.from(this._expandedKeys), expandedNodes)
    }
    // 触发重新渲染回调
    if (this._onRerender) {
      this._onRerender()
    }
  }

  // 根据ID查找节点
  private findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
    for (const node of nodes) {
      if (String(node.id) === id) {
        return node
      }
      if (node.children && node.children.length > 0) {
        const found = this.findNodeById(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  private renderTreeNode(adapter: any, node: TreeNode, indentLevel: number): any {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = hasChildren && this._expandedKeys.has(node.id)
    const isSelected = this._selectedKeys.has(node.id)
    const isChecked = this._checkedKeys.has(node.id)
    const paddingLeft = indentLevel * 24

    // 树节点容器
    const nodeProps: any = {
      'data-node-id': String(node.id), // 添加节点ID标识
      className: `mui-tree-node ${isSelected ? 'mui-tree-node--selected' : ''} ${node.disabled ? 'mui-tree-node--disabled' : ''}`,
      style: {
        display: 'flex',
        alignItems: 'center',
        padding: this.getPaddingSize(),
        paddingLeft: `${paddingLeft}px`,
        cursor: node.disabled ? 'not-allowed' : 'pointer',
        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        fontSize: this.getFontSize(),
        minHeight: this.getNodeHeight(),
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none'
      }
    }

    const children: any[] = []

    // 展开/折叠图标
    if (hasChildren) {
      const iconProps: any = {
        className: `mui-tree-icon mui-tree-icon--${isExpanded ? 'expanded' : 'collapsed'}`,
        style: {
          width: '16px',
          height: '16px',
          marginRight: '8px',
          transition: 'transform 0.2s ease-in-out',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          fontSize: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        },
        onClick: (e: Event) => {
          e.stopPropagation()
          this.handleExpandIconClick(node)
        }
      }
      children.push(adapter.createElement('span', iconProps, [isExpanded ? '▶' : '▶']))
    } else {
      // 占位符，保持对齐
      const spacerProps: any = {
        style: {
          width: '16px',
          marginRight: '8px'
        }
      }
      children.push(adapter.createElement('span', spacerProps))
    }

    // 复选框（如果启用）
    if (this._showCheckbox) {
      const checkboxProps: any = {
        type: 'checkbox',
        checked: isChecked,
        style: {
          marginRight: '8px',
          cursor: 'pointer'
        },
        onClick: (e: Event) => {
          e.stopPropagation()
        },
        onChange: () => {
          this.handleCheckboxClick(node)
        }
      }
      children.push(adapter.createElement('input', checkboxProps))
    }

    // 自定义图标（如果有）
    if (node.icon) {
      const iconProps: any = {
        style: {
          marginRight: '8px',
          fontSize: '16px'
        }
      }
      children.push(adapter.createElement('span', iconProps, [node.icon]))
    }

    // 文本标签
    const labelProps: any = {
      className: 'mui-tree-label',
      style: {
        flex: 1,
        lineHeight: this.getLineHeight(),
        color: node.disabled ? 'rgba(0, 0, 0, 0.38)' : (isSelected ? '#1976d2' : 'rgba(0, 0, 0, 0.87)')
      }
    }
    children.push(adapter.createElement('span', labelProps, [node.label]))

    const nodeElement = adapter.createElement('div', nodeProps, children)

    // 子节点
    if (hasChildren && isExpanded) {
      const childrenContainerProps: any = {
        className: 'mui-tree-children',
        style: {
          display: 'block'
        }
      }
      const childrenElements: any[] = (node.children || []).map((child) =>
        this.renderTreeNode(adapter, child, indentLevel + 1)
      )
      
      const childrenWrapper = adapter.createElement('div', childrenContainerProps, childrenElements)
      
      return adapter.createElement('div', { className: 'mui-tree-node-wrapper' }, [
        nodeElement,
        childrenWrapper
      ])
    }

    return nodeElement
  }

  private getPaddingSize(): string {
    const paddingMap: Record<string, string> = {
      small: '4px 8px',
      medium: '6px 12px',
      large: '8px 16px'
    }
    return paddingMap[this._size] || paddingMap.medium
  }

  private getFontSize(): string {
    const fontSizeMap: Record<string, string> = {
      small: '0.875rem',
      medium: '0.9375rem',
      large: '1rem'
    }
    return fontSizeMap[this._size] || fontSizeMap.medium
  }

  private getLineHeight(): string {
    const lineHeightMap: Record<string, string> = {
      small: '1.4',
      medium: '1.5',
      large: '1.6'
    }
    return lineHeightMap[this._size] || lineHeightMap.medium
  }

  private getNodeHeight(): string {
    const heightMap: Record<string, string> = {
      small: '28px',
      medium: '32px',
      large: '36px'
    }
    return heightMap[this._size] || heightMap.medium
  }

  private handleNodeClick(node: TreeNode): void {
    if (node.disabled) return

    // 如果有子节点，切换展开/折叠
    if (node.children && node.children.length > 0) {
      this.toggleExpand(node.id)
      
      // 触发展开事件
      if (this._onExpand) {
        const expandedNodes = this.findNodesByIds(this._nodes, Array.from(this._expandedKeys))
        this._onExpand(Array.from(this._expandedKeys), expandedNodes)
      }
    } else if (this._selectable) {
      // 单选模式
      if (!this._showCheckbox) {
        this._selectedKeys.clear()
        this._selectedKeys.add(node.id)
        
        if (this._onSelect) {
          const selectedNodes = this.findNodesByIds(this._nodes, [node.id])
          this._onSelect([node.id], selectedNodes)
        }
      }
    }

    // 调用节点的 onClick
    if (node.onClick) {
      node.onClick()
    }
  }

  private handleExpandIconClick(node: TreeNode): void {
    if (node.disabled) return
    
    // 切换展开/折叠状态
    this.toggleExpand(node.id)
    
    // 触发展开事件
    if (this._onExpand) {
      const expandedNodes = this.findNodesByIds(this._nodes, Array.from(this._expandedKeys))
      this._onExpand(Array.from(this._expandedKeys), expandedNodes)
    }
  }

  // 展开/折叠节点的所有子节点
  expandNode(node: TreeNode): void {
    this._expandedKeys.add(node.id)
    
    // 如果节点有子节点，递归展开所有子节点
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        this.expandNode(child)
      })
    }
  }

  collapseNode(node: TreeNode): void {
    this._expandedKeys.delete(node.id)
    
    // 如果节点有子节点，递归折叠所有子节点
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        this.collapseNode(child)
      })
    }
  }

  private handleCheckboxClick(node: TreeNode): void {
    if (node.disabled) return

    const isChecked = this._checkedKeys.has(node.id)
    
    if (isChecked) {
      this._checkedKeys.delete(node.id)
      // 如果严格模式，也要取消子节点
      if (!this._checkStrictly && node.children) {
        this.uncheckChildren(node.children)
      }
    } else {
      this._checkedKeys.add(node.id)
      // 如果严格模式，也要选中子节点
      if (!this._checkStrictly && node.children) {
        this.checkChildren(node.children)
      }
    }

    if (this._onCheck) {
      const checkedNodes = this.findNodesByIds(this._nodes, Array.from(this._checkedKeys))
      this._onCheck(Array.from(this._checkedKeys), checkedNodes)
    }
  }

  private checkChildren(nodes: TreeNode[]): void {
    nodes.forEach(node => {
      this._checkedKeys.add(node.id)
      if (node.children && node.children.length > 0) {
        this.checkChildren(node.children)
      }
    })
  }

  private uncheckChildren(nodes: TreeNode[]): void {
    nodes.forEach(node => {
      this._checkedKeys.delete(node.id)
      if (node.children && node.children.length > 0) {
        this.uncheckChildren(node.children)
      }
    })
  }

  private findNodesByIds(nodes: TreeNode[], ids: (string | number)[]): TreeNode[] {
    const result: TreeNode[] = []
    nodes.forEach(node => {
      if (ids.includes(node.id)) {
        result.push(node)
      }
      if (node.children && node.children.length > 0) {
        result.push(...this.findNodesByIds(node.children, ids))
      }
    })
    return result
  }
}

