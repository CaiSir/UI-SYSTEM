import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface ResponsiveProps {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
}
export interface ColOptions extends IBaseCommandProps {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
    xs?: number | ResponsiveProps;
    sm?: number | ResponsiveProps;
    md?: number | ResponsiveProps;
    lg?: number | ResponsiveProps;
    xl?: number | ResponsiveProps;
    xxl?: number | ResponsiveProps;
    class?: string;
    flex?: string | number;
}
export interface ColEvents extends IBaseCommandEvents {
}
/**
 * NHAI Col 的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 基于 24 列栅格系统的列容器
 */
export declare class NhaiColCommand extends BaseCommand<ColOptions, ColEvents> {

    constructor(options?: ColOptions);
    setSpan(span?: number): this;
    setOffset(offset: number): this;
    setPush(push: number): this;
    setPull(pull: number): this;
    setOrder(order?: number): this;
    setResponsive(breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', value: number | ResponsiveProps): this;
    setFlex(flex?: string | number): this;
    protected doRender(): HTMLElement;
    protected contentContainer?: HTMLElement;
    protected childElements: Map<BaseCommand<any, any>, HTMLElement>;
    addChild<C extends BaseCommand<any, any>>(child: C): this;
    removeChild<C extends BaseCommand<any, any>>(child: C): this;

    protected update(): void;
    unmount(): void;
}
export default NhaiColCommand;