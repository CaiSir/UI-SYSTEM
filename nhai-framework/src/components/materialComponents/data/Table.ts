import { NHAIWidget, NHAIObject, NHAIRenderContext, NHAIFrameworkRegistry } from '../../../core/NHAICore'

export interface TableColumn {
  key: string
  title: string
  dataIndex?: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: (value: any, record: any, index: number) => any
}

export interface TableData {
  [key: string]: any
}

/**
 * Material UI Table 组件
 * 基于 Svelte + Material UI 的命令式 API 实现
 */
export class MaterialTable extends NHAIWidget {
  private _columns: TableColumn[] = []
  private _dataSource: TableData[] = []
  private _loading: boolean = false
  private _pagination: boolean = true
  private _pageSize: number = 10
  private _currentPage: number = 1
  private _total: number = 0
  private _size: 'small' | 'medium' = 'medium'
  private _bordered: boolean = false
  private _striped: boolean = true
  private _hoverable: boolean = true
  private _sortField: string = ''
  private _sortOrder: 'asc' | 'desc' = 'asc'
  private _onRowClick?: (record: TableData, index: number) => void
  private _onSort?: (field: string, order: 'asc' | 'desc') => void
  private _onPageChange?: (page: number, pageSize: number) => void

  constructor(parent?: NHAIObject) {
    super(parent)
  }

  // 设置列配置
  setColumns(columns: TableColumn[]): void {
    this._columns = columns
  }

  columns(): TableColumn[] {
    return this._columns
  }

  // 设置数据源
  setDataSource(dataSource: TableData[]): void {
    this._dataSource = dataSource
    this._total = dataSource.length
  }

  dataSource(): TableData[] {
    return this._dataSource
  }

  // 设置加载状态
  setLoading(loading: boolean): void {
    this._loading = loading
  }

  loading(): boolean {
    return this._loading
  }

  // 设置分页
  setPagination(pagination: boolean): void {
    this._pagination = pagination
  }

  pagination(): boolean {
    return this._pagination
  }

  // 设置页面大小
  setPageSize(pageSize: number): void {
    this._pageSize = pageSize
  }

  pageSize(): number {
    return this._pageSize
  }

  // 设置当前页
  setCurrentPage(page: number): void {
    this._currentPage = page
  }

  currentPage(): number {
    return this._currentPage
  }

  // 设置总数
  setTotal(total: number): void {
    this._total = total
  }

  total(): number {
    return this._total
  }

  // 设置大小
  setSize(size: 'small' | 'medium'): void {
    this._size = size
  }

  size(): string {
    return this._size
  }

  // 设置边框
  setBordered(bordered: boolean): void {
    this._bordered = bordered
  }

  bordered(): boolean {
    return this._bordered
  }

  // 设置斑马纹
  setStriped(striped: boolean): void {
    this._striped = striped
  }

  striped(): boolean {
    return this._striped
  }

  // 设置悬停效果
  setHoverable(hoverable: boolean): void {
    this._hoverable = hoverable
  }

  hoverable(): boolean {
    return this._hoverable
  }

  // 设置事件处理器
  setOnRowClick(handler: (record: TableData, index: number) => void): void {
    this._onRowClick = handler
  }

  setOnSort(handler: (field: string, order: 'asc' | 'desc') => void): void {
    this._onSort = handler
  }

  setOnPageChange(handler: (page: number, pageSize: number) => void): void {
    this._onPageChange = handler
  }

  render(_context?: NHAIRenderContext): any {
    const adapter = NHAIFrameworkRegistry.getCurrent()
    if (!adapter) {
      throw new Error('No framework adapter registered')
    }

    const containerProps: any = {
      className: `mui-table-container mui-table-container--${this._size}`,
      style: {
        ...this.getWidgetStyle(),
        ...this.getMergedStyle(),
        width: '100%',
        overflow: 'auto'
      }
    }

    if (this._id) containerProps.id = this._id
    if (this._className) containerProps.className += ` ${this._className}`

    const children = []

    // 表格
    const tableProps: any = {
      className: `mui-table ${this._bordered ? 'mui-table--bordered' : ''} ${this._striped ? 'mui-table--striped' : ''}`,
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: this._size === 'small' ? '0.875rem' : '1rem'
      }
    }

    const tableChildren = []

    // 表头
    const theadProps: any = {
      className: 'mui-table-head'
    }

    const headerRowProps: any = {
      className: 'mui-table-row mui-table-row--header',
      style: {
        backgroundColor: '#f5f5f5',
        fontWeight: '500'
      }
    }

    const headerCells = this._columns.map(column => {
      const cellProps: any = {
        className: 'mui-table-cell mui-table-cell--header',
        style: {
          padding: this._size === 'small' ? '8px 12px' : '12px 16px',
          textAlign: column.align || 'left',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          cursor: column.sortable ? 'pointer' : 'default',
          userSelect: 'none'
        }
      }

      if (column.sortable) {
        cellProps.onClick = () => this.handleSort(column.key)
      }

      const cellContent = [column.title]
      if (column.sortable) {
        const sortIcon = this._sortField === column.key 
          ? (this._sortOrder === 'asc' ? '↑' : '↓')
          : '↕'
        cellContent.push(adapter.createElement('span', { 
          style: { marginLeft: '4px', fontSize: '0.75rem' } 
        }, [sortIcon]))
      }

      return adapter.createElement('th', cellProps, cellContent)
    })

    headerRowProps.children = headerCells
    theadProps.children = [adapter.createElement('tr', headerRowProps)]
    tableChildren.push(adapter.createElement('thead', theadProps))

    // 表体
    const tbodyProps: any = {
      className: 'mui-table-body'
    }

    const currentData = this.getCurrentPageData()
    const bodyRows = currentData.map((record, index) => {
      const rowProps: any = {
        className: `mui-table-row ${this._hoverable ? 'mui-table-row--hoverable' : ''}`,
        style: {
          backgroundColor: this._striped && index % 2 === 1 ? '#fafafa' : 'transparent',
          cursor: this._hoverable ? 'pointer' : 'default',
          transition: 'background-color 0.2s ease-in-out'
        }
      }

      if (this._onRowClick) {
        rowProps.onClick = () => this._onRowClick!(record, index)
      }

      const cells = this._columns.map(column => {
        const cellProps: any = {
          className: 'mui-table-cell',
          style: {
            padding: this._size === 'small' ? '8px 12px' : '12px 16px',
            textAlign: column.align || 'left',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }
        }

        const value = column.dataIndex ? record[column.dataIndex] : record[column.key]
        const cellContent = column.render ? column.render(value, record, index) : value

        return adapter.createElement('td', cellProps, [cellContent])
      })

      rowProps.children = cells
      return adapter.createElement('tr', rowProps)
    })

    tbodyProps.children = bodyRows
    tableChildren.push(adapter.createElement('tbody', tbodyProps))

    tableProps.children = tableChildren
    children.push(adapter.createElement('table', tableProps))

    // 分页
    if (this._pagination && this._total > this._pageSize) {
      const paginationProps: any = {
        className: 'mui-table-pagination',
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '16px',
          gap: '8px'
        }
      }

      const paginationChildren = []

      // 上一页
      const prevProps: any = {
        className: 'mui-pagination-button',
        style: {
          padding: '8px 12px',
          border: '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: '4px',
          backgroundColor: 'transparent',
          cursor: this._currentPage > 1 ? 'pointer' : 'not-allowed',
          opacity: this._currentPage > 1 ? 1 : 0.5
        }
      }

      if (this._currentPage > 1) {
        prevProps.onClick = () => this.handlePageChange(this._currentPage - 1)
      }

      paginationChildren.push(adapter.createElement('button', prevProps, ['上一页']))

      // 页码
      const totalPages = Math.ceil(this._total / this._pageSize)
      for (let i = 1; i <= totalPages; i++) {
        const pageProps: any = {
          className: `mui-pagination-button ${i === this._currentPage ? 'mui-pagination-button--active' : ''}`,
          style: {
            padding: '8px 12px',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            backgroundColor: i === this._currentPage ? '#1976d2' : 'transparent',
            color: i === this._currentPage ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
            cursor: 'pointer'
          }
        }

        pageProps.onClick = () => this.handlePageChange(i)
        paginationChildren.push(adapter.createElement('button', pageProps, [i.toString()]))
      }

      // 下一页
      const nextProps: any = {
        className: 'mui-pagination-button',
        style: {
          padding: '8px 12px',
          border: '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: '4px',
          backgroundColor: 'transparent',
          cursor: this._currentPage < totalPages ? 'pointer' : 'not-allowed',
          opacity: this._currentPage < totalPages ? 1 : 0.5
        }
      }

      if (this._currentPage < totalPages) {
        nextProps.onClick = () => this.handlePageChange(this._currentPage + 1)
      }

      paginationChildren.push(adapter.createElement('button', nextProps, ['下一页']))

      paginationProps.children = paginationChildren
      children.push(adapter.createElement('div', paginationProps))
    }

    return adapter.createElement('div', containerProps, children)
  }

  private getCurrentPageData(): TableData[] {
    if (!this._pagination) {
      return this._dataSource
    }

    const start = (this._currentPage - 1) * this._pageSize
    const end = start + this._pageSize
    return this._dataSource.slice(start, end)
  }

  private handleSort(field: string): void {
    if (this._sortField === field) {
      this._sortOrder = this._sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      this._sortField = field
      this._sortOrder = 'asc'
    }

    if (this._onSort) {
      this._onSort(this._sortField, this._sortOrder)
    }
  }

  private handlePageChange(page: number): void {
    this._currentPage = page
    
    if (this._onPageChange) {
      this._onPageChange(page, this._pageSize)
    }
  }
}
