/**
 * 所有命令式组件的基类
 * 提供统一的接口和生命周期管理
 */
export interface IBaseCommandProps {
    id?: string;
    className?: string;
    style?: Partial<CSSStyleDeclaration>;
}
export interface IBaseCommandEvents extends Record<string, (...args: any[]) => void> {
    mounted: () => void;
    unmounted: () => void;
    updated: () => void;
}
export declare abstract class BaseCommand<TProps extends IBaseCommandProps = IBaseCommandProps, TEvents extends Record<string, (...args: any[]) => void> = IBaseCommandEvents> {
    protected _mounted: boolean;
    protected _element?: HTMLElement;
    protected _appInstance?: any;
    protected _children: BaseCommand<TProps, TEvents>[];
    protected _parent?: BaseCommand<TProps, TEvents>;
    protected _props: TProps;

    constructor(props?: TProps);
    on<K extends keyof TEvents>(event: K, handler: TEvents[K]): this;
    off<K extends keyof TEvents>(event: K, handler?: TEvents[K]): this;
    emit<K extends keyof TEvents>(event: K): void;
    emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): void;
    protected scheduleUpdate(): void;
    /**
     * 更新组件（子类可以重写）
     */
    protected update(): void;
    /**
     * 渲染组件为 DOM 元素
     * 如果已经渲染过，返回现有元素（避免重复渲染）
     */
    render(): HTMLElement;
    /**
     * 具体的渲染实现（子类实现）
     */
    protected abstract doRender(): HTMLElement;
    /**
     * 挂载前钩子
     */
    protected willMount(): void;
    /**
     * 挂载后钩子
     */
    protected didMount(): void;
    /**
     * 卸载组件
     */
    unmount(): void;
    /**
     * 卸载前钩子
     */
    protected willUnmount(): void;
    /**
     * 注册清理回调
     */
    protected addCleanup(callback: () => void): void;
    /**
     * 设置属性
     */
    setProperty<K extends keyof TProps>(key: K, value: TProps[K]): this;
    /**
     * 获取属性
     */
    getProperty<K extends keyof TProps>(key: K): TProps[K];
    /**
     * 获取所有属性
     */
    getProperties(): TProps;
    /**
     * 批量更新属性
     */
    setProperties(props: Partial<TProps>): this;
    addChild<C extends BaseCommand<TProps, TEvents>>(child: C): this;
    removeChild<C extends BaseCommand<TProps, TEvents>>(child: C): this;
    getChildren(): BaseCommand<TProps, TEvents>[];
    getParent(): BaseCommand<TProps, TEvents> | undefined;
    clearChildren(): this;
    isMounted(): boolean;
    getElement(): HTMLElement | undefined;
    setId(id: string): this;
    getId(): string | undefined;
    setStyle(style: Partial<CSSStyleDeclaration>): this;
    setClassName(className: string): this;
    findChild(predicate: (child: BaseCommand<TProps, TEvents>) => boolean): BaseCommand<TProps, TEvents> | undefined;
    findChildren(predicate: (child: BaseCommand<TProps, TEvents>) => boolean): BaseCommand<TProps, TEvents>[];
    /**
     * 递归查找子组件
     */
    findChildRecursive(predicate: (child: BaseCommand<TProps, TEvents>) => boolean): BaseCommand<TProps, TEvents> | undefined;
}