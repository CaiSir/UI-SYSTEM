import { BaseCommand } from './BaseCommand';
/**
 * 组件注册系统
 * 允许通过名称创建组件实例（类似工厂模式）
 */
export declare class ComponentRegistry {

    /**
     * 注册组件
     * @param name 组件名称
     * @param component 组件类
     */
    static register(name: string, component: new (...args: any[]) => BaseCommand): void;
    /**
     * 创建组件实例
     * @param name 组件名称
     * @param args 构造函数参数
     */
    static create<T extends BaseCommand>(name: string, ...args: any[]): T;
    /**
     * 列出所有已注册的组件
     */
    static listRegistered(): string[];
    /**
     * 检查组件是否已注册
     */
    static isRegistered(name: string): boolean;
    /**
     * 获取所有实例
     */
    static getAllInstances(name: string): BaseCommand[];
    /**
     * 清空注册表（用于测试）
     */
    static clear(): void;
    /**
     * 生成唯一 ID
     */

}
/**
 * 便捷装饰器：自动注册组件
 */
export declare function Component(name: string): <T extends new (...args: any[]) => BaseCommand>(constructor: T) => T;