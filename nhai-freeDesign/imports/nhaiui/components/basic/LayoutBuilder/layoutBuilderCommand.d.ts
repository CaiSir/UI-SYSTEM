import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
/**
 * 布局项接口
 */
export interface LayoutItem {
    id: string;
    element: HTMLElement;
    data?: any;
}
export interface LayoutBuilderOptions extends IBaseCommandProps {
    layoutType?: 'vbox' | 'hbox' | 'grid' | 'container';
    direction?: 'row' | 'column';
    spacing?: number;
    padding?: string;
    gap?: string;
    width?: string;
    height?: string;
    backgroundColor?: string;
    onItemClick?: (item: LayoutItem) => void;
}
export interface LayoutBuilderEvents extends IBaseCommandEvents {
    itemClick: (item: LayoutItem) => void;
}
/**
 * 布局构建器命令式 API
 * 提供灵活的布局管理，支持 vbox、hbox、grid、container 等布局方式
 * 允许通过命令式 API 动态构建和管理复杂布局
 */
export declare class NhaiLayoutBuilderCommand extends BaseCommand<LayoutBuilderOptions, LayoutBuilderEvents> {

    /**
     * 创建布局构建器
     * @param layoutTypeOrOptions - 布局类型或选项对象
     */
    constructor(layoutTypeOrOptions?: 'vbox' | 'hbox' | 'grid' | 'container' | LayoutBuilderOptions);
    setLayoutType(type: 'vbox' | 'hbox' | 'grid' | 'container'): this;
    setDirection(direction: 'row' | 'column'): this;
    setSpacing(spacing: number): this;
    getSpacing(): number;
    setPadding(padding: string): this;
    setGap(gap: string): this;
    setWidth(width: string): this;
    setHeight(height: string): this;
    setBackgroundColor(color: string): this;
    /**
     * 设置自定义样式（覆盖默认样式）
     */
    setStyle(style: Record<string, string>): this;
    /**
     * 添加自定义样式类名
     */
    setClassName(className: string): this;
    /**
     * 添加元素到布局
     * @param id - 元素唯一标识
     * @param element - DOM 元素
     * @param data - 附加数据
     */
    addElement(id: string, element: HTMLElement, data?: any): void;
    /**
     * 添加组件（自动调用 render 方法）
     */
    addWidget(id: string, widget: any, data?: any): void;
    /**
     * 重写 addChild 以兼容 BaseCommand
     */
    addChild(child: BaseCommand<any, any>): this;
    /**
     * 移除组件
     */
    removeComponent(id: string): void;
    /**
     * 获取所有组件
     */
    getItems(): LayoutItem[];
    /**
     * 清空所有组件
     */
    clear(): void;
    /**
     * 查找组件
     */
    findItem(id: string): LayoutItem | undefined;
    /**
     * 更新项数据
     */
    updateItem(id: string, data: any): void;
    /**
     * 更新元素的 innerHTML
     */
    setItemContent(id: string, content: string): void;
    setOnItemClick(callback: (item: LayoutItem) => void): this;
    unmount(): void;
    protected doRender(): HTMLElement;
}
export default NhaiLayoutBuilderCommand;