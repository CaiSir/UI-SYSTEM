import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface RowOptions extends IBaseCommandProps {
    gutter?: number | [number, number];
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
    align?: 'top' | 'middle' | 'bottom' | 'stretch';
    wrap?: boolean;
    class?: string;
}
export interface RowEvents extends IBaseCommandEvents {
}
/**
 * NHAI Row 的命令式封装
 * 提供命令式 API 用于在非 Vue 环境中使用
 * 基于 24 列栅格系统的行容器
 */
export declare class NhaiRowCommand extends BaseCommand<RowOptions, RowEvents> {

    constructor(options?: RowOptions);
    setGutter(gutter: number | [number, number]): this;
    setJustify(justify: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'): this;
    setAlign(align: 'top' | 'middle' | 'bottom' | 'stretch'): this;
    setWrap(wrap: boolean): this;
    protected doRender(): HTMLElement;
    protected contentContainer?: HTMLElement;
    protected childElements: Map<BaseCommand<any, any>, HTMLElement>;
    addChild<C extends BaseCommand<any, any>>(child: C): this;
    removeChild<C extends BaseCommand<any, any>>(child: C): this;

    protected update(): void;
    unmount(): void;
}
export default NhaiRowCommand;