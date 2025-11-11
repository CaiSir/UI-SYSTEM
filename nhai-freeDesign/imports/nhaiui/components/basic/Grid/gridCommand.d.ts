import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface GridOptions extends IBaseCommandProps {
    container?: boolean;
    columnCount?: number;
    rowCount?: number;
    columnStretch?: number[];
    rowStretch?: number[];
    columnMinWidths?: (number | string)[];
    rowMinHeights?: (number | string)[];
    columnMaxWidths?: (number | string)[];
    rowMaxHeights?: (number | string)[];
    horizontalSpacing?: number | string;
    verticalSpacing?: number | string;
    spacing?: number;
    contentsMargins?: {
        left?: number | string;
        top?: number | string;
        right?: number | string;
        bottom?: number | string;
    };
    horizontalAlignment?: 'left' | 'center' | 'right' | 'stretch';
    verticalAlignment?: 'top' | 'center' | 'bottom' | 'stretch';
    layoutStretch?: boolean;
    columns?: number | string;
    rows?: number | string;
    templateAreas?: string;
    autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
    justifyItems?: 'start' | 'end' | 'center' | 'stretch';
    alignItems?: 'start' | 'end' | 'center' | 'stretch';
    justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
    alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
    gap?: string;
    layoutLeftMargin?: number | string;
    topMargin?: number | string;
    rightMargin?: number | string;
    bottomMargin?: number | string;
    layoutSpacing?: number;
}
export interface GridEvents extends IBaseCommandEvents {
}
/**
 * Grid 子项配置接口
 * 用于配置子组件在 Grid 中的位置和大小
 */
export interface GridItemConfig {
    gridColumnStart?: number | string;
    gridColumnEnd?: number | string;
    gridRowStart?: number | string;
    gridRowEnd?: number | string;
    gridArea?: string;
    span?: number;
    rowSpan?: number;
}
/**
 * NHAI Grid 的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 支持高效的 CSS Grid 布局系统
 * 继承 BaseCommand 获得统一的接口和生命周期
 */
export declare class NhaiGridCommand extends BaseCommand<GridOptions, GridEvents> {

    constructor(options?: GridOptions | boolean | number);
    setContainer(container: boolean): this;
    setColumns(columns: number | string): this;
    setRows(rows: number | string): this;
    setTemplateAreas(templateAreas: string): this;
    setAutoFlow(autoFlow: 'row' | 'column' | 'row dense' | 'column dense'): this;
    setJustifyItems(justifyItems: 'start' | 'end' | 'center' | 'stretch'): this;
    setAlignItems(alignItems: 'start' | 'end' | 'center' | 'stretch'): this;
    setJustifyContent(justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'): this;
    setAlignContent(alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'): this;
    setSpacing(spacing: number): this;
    setGap(gap: string): this;
    setLayoutLeftMargin(margin: number | string): this;
    setTopMargin(margin: number | string): this;
    setRightMargin(margin: number | string): this;
    setBottomMargin(margin: number | string): this;
    setLayoutSpacing(spacing: number): this;
    setLayoutStretch(stretch: boolean): this;
    setColumnCount(count: number): this;
    setRowCount(count: number): this;
    setColumnStretch(stretch: number[]): this;
    setRowStretch(stretch: number[]): this;
    setColumnMinWidths(widths: (number | string)[]): this;
    setRowMinHeights(heights: (number | string)[]): this;
    setColumnMaxWidths(widths: (number | string)[]): this;
    setRowMaxHeights(heights: (number | string)[]): this;
    setHorizontalSpacing(spacing: number | string): this;
    setVerticalSpacing(spacing: number | string): this;
    setContentsMargins(margins: {
        left?: number | string;
        top?: number | string;
        right?: number | string;
        bottom?: number | string;
    }): this;
    setHorizontalAlignment(alignment: 'left' | 'center' | 'right' | 'stretch'): this;
    setVerticalAlignment(alignment: 'top' | 'center' | 'bottom' | 'stretch'): this;
    /**
     * 为子组件设置 Grid 布局配置
     * @param child 子组件实例
     * @param config Grid 布局配置
     */
    setChildGridConfig(child: BaseCommand<any, any>, config: GridItemConfig): this;
    /**
     * 获取子组件的 Grid 配置
     */
    getChildGridConfig(child: BaseCommand<any, any>): GridItemConfig | undefined;
    /**
     * 移除子组件的 Grid 配置
     */
    removeChildGridConfig(child: BaseCommand<any, any>): this;
    /**
     * 将 Grid 配置应用到 DOM 元素
     */

    /**
     * 从 DOM 元素移除 Grid 配置
     */

    /**
     * 获取子组件当前所在的列（用于计算 span）
     * 这是一个简化的实现，实际可能需要更复杂的逻辑
     */

    /**
     * 获取子组件当前所在的行（用于计算 rowSpan）
     */

    protected childElements: Map<BaseCommand<any, any>, HTMLElement>;
    protected contentContainer?: HTMLElement;
    addChild<C extends BaseCommand<any, any>>(child: C): this;
    removeChild<C extends BaseCommand<any, any>>(child: C): this;
    /**
     * 渲染子组件到内容容器
     */

    /**
     * 渲染所有子组件
     */

    protected doRender(): HTMLElement;
    /**
     * 重写 update 方法，确保属性变化时 Vue 组件能响应式更新
     */
    protected update(): void;
    unmount(): void;
    /**
     * 根据组件的根式（grid-area 配置）生成高效的 Grid 布局
     * 这是一个便捷方法，用于快速配置子组件的 Grid 位置
     *
     * @param child 子组件实例
     * @param areaName 网格区域名称（用于 grid-template-areas）
     * @param span 跨越多列（默认 1）
     * @param rowSpan 跨越多行（默认 1）
     */
    placeChild(child: BaseCommand<any, any>, areaName?: string, span?: number, rowSpan?: number): this;
    /**
     * 快速设置 Grid 布局（根据子组件自动生成）
     * 这是一个高效的方法，可以分析所有子组件的配置并自动生成最优的 Grid 布局
     *
     * 根据子组件的根式（grid-area、grid-column、grid-row 配置）智能生成布局：
     * 1. 如果子组件使用了 gridArea，会自动生成 grid-template-areas
     * 2. 如果子组件使用了 span，会自动计算需要的列数和行数
     * 3. 如果子组件使用了明确的 gridColumn/gridRow，会自动计算网格大小
     */
    autoLayout(): this;
    /**
     * 根据子组件的根式（配置）批量设置布局
     * 这是一个高效的方法，可以一次性配置多个子组件的 Grid 位置
     *
     * @param configs 子组件配置映射，key 为子组件实例，value 为 Grid 配置
     */
    setChildrenLayout(configs: Map<BaseCommand<any, any>, GridItemConfig> | Record<string, GridItemConfig>): this;
}
export default NhaiGridCommand;