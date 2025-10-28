import { BaseCommand } from './BaseCommand'

/**
 * 组件注册系统
 * 允许通过名称创建组件实例（类似工厂模式）
 */
export class ComponentRegistry {
  private static registry = new Map<string, new (...args: any[]) => BaseCommand>()
  private static instanceMap = new Map<string, Map<string, BaseCommand>>()

  /**
   * 注册组件
   * @param name 组件名称
   * @param component 组件类
   */
  static register(name: string, component: new (...args: any[]) => BaseCommand): void {
    this.registry.set(name, component)
  }

  /**
   * 创建组件实例
   * @param name 组件名称
   * @param args 构造函数参数
   */
  static create<T extends BaseCommand>(name: string, ...args: any[]): T {
    const Component = this.registry.get(name)
    if (!Component) {
      throw new Error(`Component "${name}" is not registered`)
    }
    
    const instance = new Component(...args) as T
    
    // 注册实例
    const instanceId = this.generateId()
    if (!this.instanceMap.has(name)) {
      this.instanceMap.set(name, new Map())
    }
    this.instanceMap.get(name)!.set(instanceId, instance)
    
    return instance
  }

  /**
   * 列出所有已注册的组件
   */
  static listRegistered(): string[] {
    return Array.from(this.registry.keys())
  }

  /**
   * 检查组件是否已注册
   */
  static isRegistered(name: string): boolean {
    return this.registry.has(name)
  }

  /**
   * 获取所有实例
   */
  static getAllInstances(name: string): BaseCommand[] {
    const instances = this.instanceMap.get(name)
    return instances ? Array.from(instances.values()) : []
  }

  /**
   * 清空注册表（用于测试）
   */
  static clear(): void {
    this.registry.clear()
    this.instanceMap.clear()
  }

  /**
   * 生成唯一 ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * 便捷装饰器：自动注册组件
 */
export function Component(name: string) {
  return function <T extends new (...args: any[]) => BaseCommand>(constructor: T) {
    ComponentRegistry.register(name, constructor)
    return constructor
  }
}

