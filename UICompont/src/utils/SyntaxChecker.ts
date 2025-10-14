/**
 * 代码语法检查工具
 * 用于检查 NHAI 组件代码的语法和潜在问题
 */

export interface SyntaxCheckResult {
  valid: boolean
  errors: SyntaxError[]
  warnings: SyntaxWarning[]
  suggestions: SyntaxSuggestion[]
}

export interface SyntaxError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}

export interface SyntaxWarning {
  line: number
  column: number
  message: string
  suggestion?: string
}

export interface SyntaxSuggestion {
  line: number
  column: number
  message: string
  replacement?: string
}

export class SyntaxChecker {
  private static readonly NHAI_METHODS = [
    'createButton', 'createLabel', 'createInput', 'createCard',
    'createContainer', 'createWindow', 'createVBoxLayout', 'createHBoxLayout',
    'setVariant', 'setWidth', 'setHeight', 'setOnClick', 'setStyle',
    'setText', 'setPlaceholder', 'setTitle', 'setSubtitle', 'addChild',
    'render', 'setSpacing', 'setLayout'
  ]


  /**
   * 检查代码语法
   */
  static checkSyntax(code: string): SyntaxCheckResult {
    const errors: SyntaxError[] = []
    const warnings: SyntaxWarning[] = []
    const suggestions: SyntaxSuggestion[] = []

    try {
      // 基本语法检查
      this.checkBasicSyntax(code, errors)
      
      // NHAI 特定检查
      this.checkNHAISyntax(code, errors, warnings, suggestions)
      
      // 最佳实践检查
      this.checkBestPractices(code, warnings, suggestions)
      
      return {
        valid: errors.length === 0,
        errors,
        warnings,
        suggestions
      }
    } catch (error) {
      return {
        valid: false,
        errors: [{
          line: 1,
          column: 1,
          message: `语法检查失败: ${error instanceof Error ? error.message : '未知错误'}`,
          severity: 'error'
        }],
        warnings: [],
        suggestions: []
      }
    }
  }

  /**
   * 基本语法检查
   */
  private static checkBasicSyntax(code: string, errors: SyntaxError[]): void {
    try {
      // 使用 Function 构造函数进行基本语法检查
      new Function(code)
    } catch (error) {
      if (error instanceof SyntaxError) {
        const match = error.message.match(/line (\d+)/)
        const line = match ? parseInt(match[1]) : 1
        
        errors.push({
          line,
          column: 1,
          message: error.message,
          severity: 'error'
        })
      }
    }
  }

  /**
   * NHAI 特定语法检查
   */
  private static checkNHAISyntax(
    code: string, 
    errors: SyntaxError[], 
    warnings: SyntaxWarning[], 
    suggestions: SyntaxSuggestion[]
  ): void {
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1
      
      // 检查是否使用了 NHAIObjectFactory
      if (line.includes('NHAIObjectFactory') && !line.includes('NHAIObjectFactory.')) {
        errors.push({
          line: lineNumber,
          column: line.indexOf('NHAIObjectFactory') + 1,
          message: 'NHAIObjectFactory 应该通过点号调用方法',
          severity: 'error'
        })
      }
      
      // 检查方法调用
      const methodMatches = line.matchAll(/NHAIObjectFactory\.(\w+)/g)
      for (const match of methodMatches) {
        const methodName = match[1]
        if (!this.NHAI_METHODS.includes(methodName)) {
          warnings.push({
            line: lineNumber,
            column: match.index! + 1,
            message: `未知的 NHAI 方法: ${methodName}`,
            suggestion: '请检查方法名是否正确'
          })
        }
      }
      
      // 检查是否缺少分号
      if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}')) {
        if (line.includes('NHAIObjectFactory') || line.includes('.set') || line.includes('.add')) {
          suggestions.push({
            line: lineNumber,
            column: line.length,
            message: '建议在语句末尾添加分号',
            replacement: line + ';'
          })
        }
      }
      
      // 检查是否缺少 render 调用
      if (line.includes('container.addChild') && !code.includes('.render()')) {
        warnings.push({
          line: lineNumber,
          column: 1,
          message: '添加组件后记得调用 render() 方法',
          suggestion: '在最后添加: const element = container.render()'
        })
      }
    })
  }

  /**
   * 最佳实践检查
   */
  private static checkBestPractices(
    code: string, 
    warnings: SyntaxWarning[], 
    suggestions: SyntaxSuggestion[]
  ): void {
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1
      
      // 检查是否使用了硬编码的样式值
      if (line.includes('setStyle') && line.includes('px')) {
        warnings.push({
          line: lineNumber,
          column: 1,
          message: '建议使用相对单位而不是像素值',
          suggestion: '考虑使用 rem、em 或 % 等单位'
        })
      }
      
      // 检查是否缺少错误处理
      if (line.includes('setOnClick') && !code.includes('try') && !code.includes('catch')) {
        suggestions.push({
          line: lineNumber,
          column: 1,
          message: '建议在事件处理中添加错误处理',
          replacement: 'try { /* 你的代码 */ } catch (error) { console.error(error) }'
        })
      }
      
      // 检查是否使用了过时的方法
      if (line.includes('setColor') && !line.includes('setStyle')) {
        suggestions.push({
          line: lineNumber,
          column: 1,
          message: '建议使用 setStyle 方法设置颜色',
          replacement: line.replace('setColor', 'setStyle({ color: ')
        })
      }
    })
  }

  /**
   * 获取代码建议
   */
  static getCodeSuggestions(code: string): string[] {
    const suggestions: string[] = []
    
    if (!code.includes('NHAIObjectFactory')) {
      suggestions.push('// 创建容器\nconst container = NHAIObjectFactory.createContainer()')
    }
    
    if (!code.includes('createButton')) {
      suggestions.push('// 创建按钮\nconst button = NHAIObjectFactory.createButton("点击我")\nbutton.setVariant("primary")')
    }
    
    if (!code.includes('render()')) {
      suggestions.push('// 渲染组件\nconst element = container.render()\ndocument.querySelector(".preview-area")?.appendChild(element)')
    }
    
    return suggestions
  }

  /**
   * 格式化代码
   */
  static formatCode(code: string): string {
    try {
      // 简单的代码格式化
      let formatted = code
      
      // 添加缺失的分号
      formatted = formatted.replace(/([^;}])\s*\n/g, '$1;\n')
      
      // 格式化缩进
      const lines = formatted.split('\n')
      let indentLevel = 0
      const formattedLines = lines.map(line => {
        const trimmed = line.trim()
        if (trimmed.endsWith('{')) {
          const result = '  '.repeat(indentLevel) + trimmed
          indentLevel++
          return result
        } else if (trimmed.startsWith('}')) {
          indentLevel--
          return '  '.repeat(indentLevel) + trimmed
        } else {
          return '  '.repeat(indentLevel) + trimmed
        }
      })
      
      return formattedLines.join('\n')
    } catch (error) {
      return code
    }
  }
}

// 导出单例实例
export const syntaxChecker = SyntaxChecker
