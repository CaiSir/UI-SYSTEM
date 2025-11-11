import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface LayoutItem {
    id: string;
    element: HTMLElement;
    data?: any;
}
export interface AbsoluteItem extends LayoutItem {
    position: {
        x: number;
        y: number;
    };
    size?: {
        width: number;
        height: number;
    };
}
export interface AbsolutePanelOptions extends IBaseCommandProps {
    width?: string;
    height?: string;
    backgroundColor?: string;
}
export interface AbsolutePanelEvents extends IBaseCommandEvents {
}
/**
 * 绝对定位面板命令式组件
 * 支持自由定位子元素
 */
export declare class AbsolutePanelCommand extends BaseCommand<AbsolutePanelOptions, AbsolutePanelEvents> {

    constructor(widthOrOptions?: string | AbsolutePanelOptions, height?: string);
    setWidth(width: string): this;
    setHeight(height: string): this;
    setBackgroundColor(color: string): this;
    /**
     * 添加组件到绝对位置
     */
    addWidgetAt(id: string, widget: BaseCommand<any, any>, position: {
        x: number;
        y: number;
    }, size?: {
        width: number;
        height: number;
    }): this;
    /**
     * 更新组件位置
     */
    setPosition(id: string, x: number, y: number): this;
    /**
     * 获取组件位置
     */
    getPosition(id: string): {
        x: number;
        y: number;
    } | undefined;
    /**
     * 更新组件大小
     */
    setSize(id: string, width: number, height: number): this;
    /**
     * 获取组件大小
     */
    getSize(id: string): {
        width: number;
        height: number;
    } | undefined;
    protected doRender(): HTMLElement;
    unmount(): void;
}