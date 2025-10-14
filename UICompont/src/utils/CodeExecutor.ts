/**
 * 安全的代码执行器
 * 用于在受控环境中执行用户编写的 NHAI 组件代码
 */

import { 
  NHAIFrameworkRegistry,
  VanillaAdapter
} from 'nhai-framework'

export interface ExecutionResult {
  success: boolean
  error?: string
  executionTime: number
  componentCount: number
}

export class SafeCodeExecutor {
  private previewArea: HTMLElement | null = null
  private isExecuting = false
  private executionTimeout = 5000 // 5秒超时

  constructor(previewArea?: HTMLElement) {
    this.previewArea = previewArea || null
    this.initializeEnvironment()
  }

  /**
   * 初始化执行环境
   */
  private initializeEnvironment(): void {
    try {
      // 确保 Vanilla 适配器已注册
      if (!NHAIFrameworkRegistry.getCurrent()) {
        NHAIFrameworkRegistry.register(new VanillaAdapter())
        NHAIFrameworkRegistry.use('vanilla')
      }
    } catch (error) {
      console.error('Failed to initialize NHAI environment:', error)
    }
  }

  /**
   * 设置预览区域
   */
  setPreviewArea(area: HTMLElement): void {
    this.previewArea = area
  }

  /**
   * 执行用户代码
   */
  async executeCode(code: string): Promise<ExecutionResult> {
    if (this.isExecuting) {
      return {
        success: false,
        error: '代码正在执行中，请稍候...',
        executionTime: 0,
        componentCount: 0
      }
    }

    if (!this.previewArea) {
      return {
        success: false,
        error: '预览区域未设置',
        executionTime: 0,
        componentCount: 0
      }
    }

    const startTime = performance.now()
    this.isExecuting = true

    try {
      // 清空预览区域
      this.clearPreview()

      // 执行代码
      await this.executeWithTimeout(code)
      
      // 计算执行时间
      const executionTime = Math.round(performance.now() - startTime)
      
      // 计算组件数量
      const componentCount = this.countComponents()
      
      return {
        success: true,
        executionTime,
        componentCount
      }
    } catch (error) {
      const executionTime = Math.round(performance.now() - startTime)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime,
        componentCount: 0
      }
    } finally {
      this.isExecuting = false
    }
  }



  /**
   * 带超时的代码执行
   */
  private async executeWithTimeout(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('代码执行超时'))
      }, this.executionTimeout)

      try {
        // 使用 eval 执行代码，注入必要的全局变量
        console.log('执行代码，NHAIObjectFactory:', (window as any).NHAIObjectFactory)
        console.log('执行代码，预览区域:', this.previewArea)
        
        // 创建安全的执行环境
        const safeEval = (code: string) => {
          // 注入全局变量
          const NHAIObjectFactory = (window as any).NHAIObjectFactory;
          const previewArea = this.previewArea;
          
          console.log('开始执行用户代码...');
          console.log('用户代码内容:', code);
          
          // 创建包装的代码，确保 console 可用
          const wrappedCode = `
            // 确保 console 可用
            const console = window.console;
            
            // 用户代码
            ${code}
          `;
          
          // 直接执行用户代码
          try {
            // 创建执行函数，确保所有必要的变量都可用
            const executeUserCode = new Function(`
              // 确保所有必要的变量都可用
              const console = window.console;
              const NHAIObjectFactory = window.NHAIObjectFactory;
              const document = window.document;
              
              console.log('🚀 开始执行用户代码...');
              ${code}
              console.log('🎉 用户代码执行完成');
            `);
            
            executeUserCode();
            console.log('用户代码执行完成');
          } catch (error) {
            console.error('用户代码执行错误:', error);
            console.error('错误堆栈:', error.stack);
            throw error;
          }
          
        }
        
        safeEval(code)
        
        console.log('代码执行完成')
        clearTimeout(timeoutId)
        resolve()
      } catch (error) {
        clearTimeout(timeoutId)
        reject(error)
      }
    })
  }

  /**
   * 清空预览区域
   */
  private clearPreview(): void {
    if (this.previewArea) {
      this.previewArea.innerHTML = ''
    }
  }

  /**
   * 计算预览区域中的组件数量
   */
  private countComponents(): number {
    if (!this.previewArea) return 0
    
    // 计算 NHAI 组件数量（通过类名识别）
    const nhaiComponents = this.previewArea.querySelectorAll('[class*="nhai-"]')
    return nhaiComponents.length
  }

  /**
   * 验证代码语法
   */
  validateSyntax(code: string): { valid: boolean; error?: string } {
    try {
      // 使用 Function 构造函数进行语法检查
      new Function(code)
      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : '语法错误'
      }
    }
  }

  /**
   * 获取代码中的 NHAI 组件使用情况
   */
  analyzeCode(code: string): {
    components: string[]
    methods: string[]
    hasErrors: boolean
  } {
    const components: string[] = []
    const methods: string[] = []
    let hasErrors = false

    try {
      // 分析代码中使用的组件
      const componentPatterns = [
        'createButton', 'createLabel', 'createInput', 'createCard',
        'createContainer', 'createWindow', 'createVBoxLayout', 'createHBoxLayout'
      ]

      componentPatterns.forEach(pattern => {
        if (code.includes(pattern)) {
          components.push(pattern)
        }
      })

      // 分析代码中使用的方法
      const methodPatterns = [
        'setVariant', 'setWidth', 'setHeight', 'setOnClick', 'setStyle',
        'setText', 'setPlaceholder', 'setTitle', 'setSubtitle', 'addChild',
        'render', 'setSpacing', 'setLayout'
      ]

      methodPatterns.forEach(pattern => {
        if (code.includes(pattern)) {
          methods.push(pattern)
        }
      })

    } catch (error) {
      hasErrors = true
    }

    return {
      components,
      methods,
      hasErrors
    }
  }

  /**
   * 停止当前执行
   */
  stopExecution(): void {
    this.isExecuting = false
  }

  /**
   * 检查是否正在执行
   */
  isExecutingCode(): boolean {
    return this.isExecuting
  }
}

// 导出单例实例
export const codeExecutor = new SafeCodeExecutor()
