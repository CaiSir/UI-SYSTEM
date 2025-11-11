import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface ButtonOptions extends IBaseCommandProps {
    text?: string;
    type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
    size?: 'large' | 'default' | 'small';
    plain?: boolean;
    round?: boolean;
    circle?: boolean;
    loading?: boolean;
    disabled?: boolean;
    icon?: string;
    onClick?: () => void;
}
export interface ButtonEvents extends IBaseCommandEvents {
    click: () => void;
}
/**
 * NHAI 按钮的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 继承 BaseCommand 获得统一的接口和生命周期
 *
 * 优化：使用缓存的组件定义，减少重复创建开销
 */
export declare class NhaiButtonCommand extends BaseCommand<ButtonOptions, ButtonEvents> {

    constructor(textOrOptions?: string | ButtonOptions);
    /**
     * 设置按钮文本
     */
    setText(text: string): this;
    /**
     * 获取按钮文本
     */
    getText(): string;
    /**
     * 设置按钮类型
     */
    setType(type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'): this;
    /**
     * 设置按钮尺寸
     */
    setSize(size: 'large' | 'default' | 'small'): this;
    /**
     * 设置朴素按钮
     */
    setPlain(plain: boolean): this;
    /**
     * 设置圆角按钮
     */
    setRound(round: boolean): this;
    /**
     * 设置圆形按钮
     */
    setCircle(circle: boolean): this;
    /**
     * 设置加载状态
     */
    setLoading(loading: boolean): this;
    /**
     * 设置禁用状态
     */
    setDisabled(disabled: boolean): this;
    /**
     * 设置图标
     */
    setIcon(icon: string): this;
    /**
     * 重写 update 方法，优化样式更新
     * 对于样式属性（如 width、height），直接更新 DOM 而不是重新渲染整个组件
     */
    protected update(): void;
    /**
     * 设置点击回调
     */
    setOnClick(callback: () => void): this;
    /**
     * 渲染为 Vue 组件（命令式）
     * 返回 HTML 元素，可以直接添加到 DOM
     *
     * 优化：使用缓存的组件定义，减少 defineComponent 的开销
     */
    protected doRender(): HTMLElement;
    /**
     * 批量渲染多个按钮（优化方法）
     * 使用一个共享的 Vue 应用来渲染所有按钮
     * 可以显著提升性能和减少内存占用
     *
     * @param buttons - 要渲染的按钮命令数组
     * @param container - 目标容器（可选）
     * @returns HTML 元素数组
     */
    static renderBatch(buttons: NhaiButtonCommand[], container?: HTMLElement): HTMLElement[];
    unmount(): void;
    /**
     * 降级方案：原生按钮（当 Vue 不可用时）
     */
    renderFallback(): HTMLElement;
}
export default NhaiButtonCommand;