import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface MenuItem {
    label: string;
    active?: boolean;
    onClick?: () => void;
}
export interface WidgetOptions extends IBaseCommandProps {
    title?: string;
    width?: string | number;
    height?: string | number;
    fullscreen?: boolean;
    menuBarVisible?: boolean;
    menuItems?: MenuItem[];
    canMinimize?: boolean;
    canMaximize?: boolean;
    canClose?: boolean;
    minimized?: boolean;
    maximized?: boolean;
    position?: {
        x: number;
        y: number;
    };
    zIndex?: number;
}
export interface WidgetEvents extends IBaseCommandEvents {
    minimize: () => void;
    maximize: () => void;
    restore: () => void;
    close: () => void;
    menuClick: (item: MenuItem, index: number) => void;
    focus: () => void;
}
export declare class NhaiWidgetCommand extends BaseCommand<WidgetOptions, WidgetEvents> {

    protected childElements: Map<BaseCommand<any, any>, HTMLElement>;
    protected contentContainer?: HTMLElement;
    constructor(titleOrOptions?: string | WidgetOptions);
    setTitle(title: string): this;
    getTitle(): string;
    setWidth(width: string | number): this;
    getWidth(): string | number;
    setHeight(height: string | number): this;
    getHeight(): string | number;
    setFullscreen(fullscreen: boolean): this;
    setMenuBarVisible(visible: boolean): this;
    setMenuItems(items: MenuItem[]): this;
    setPosition(x: number, y: number): this;
    getPosition(): {
        x: number;
        y: number;
    } | undefined;
    setZIndex(zIndex: number): this;
    protected update(): void;
    minimize(): this;
    maximize(): this;
    restore(): this;
    close(): this;
    isMinimized(): boolean;
    isMaximized(): boolean;
    isFullscreen(): boolean;
    addChild<C extends BaseCommand<any, any>>(child: C): this;
    removeChild<C extends BaseCommand<any, any>>(child: C): this;

    protected doRender(): HTMLElement;
    unmount(): void;
}
export default NhaiWidgetCommand;