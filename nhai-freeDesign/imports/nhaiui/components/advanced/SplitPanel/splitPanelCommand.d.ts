import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface SplitPanelOptions extends IBaseCommandProps {
    orientation?: 'horizontal' | 'vertical';
    splitPosition?: number;
    minSize?: number;
    maxSize?: number;
    resizable?: boolean;
    disabled?: boolean;
    leftContent?: string;
    rightContent?: string;
    onResize?: (position: number) => void;
}
export interface SplitPanelEvents extends IBaseCommandEvents {
    resize: (position: number) => void;
}
export declare class NhaiSplitPanelCommand extends BaseCommand<SplitPanelOptions, SplitPanelEvents> {

    constructor(leftContentOrOptions?: string | SplitPanelOptions, rightContent?: string, orientation?: 'horizontal' | 'vertical');
    setOrientation(orientation: 'horizontal' | 'vertical'): this;
    setSplitPosition(position: number): this;
    getSplitPosition(): number;
    setMinSize(minSize: number): this;
    setMaxSize(maxSize: number): this;
    setResizable(resizable: boolean): this;
    setDisabled(disabled: boolean): this;
    setLeftContent(content: string): this;
    setRightContent(content: string): this;
    setOnResize(callback: (position: number) => void): this;
    protected doRender(): HTMLElement;
    unmount(): void;
}
export default NhaiSplitPanelCommand;