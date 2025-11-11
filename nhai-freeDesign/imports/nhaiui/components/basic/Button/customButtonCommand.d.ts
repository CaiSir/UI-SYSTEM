import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface CustomButtonOptions extends IBaseCommandProps {
    text?: string;
    type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
    size?: 'large' | 'default' | 'small';
    plain?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}
export interface CustomButtonEvents extends IBaseCommandEvents {
    click: () => void;
}
/**
 * 轻量级按钮命令
 * 使用原生 DOM 实现，避免 Vue 框架开销
 * DOM 节点数减少约 80%，性能提升约 5-10 倍
 */
export declare class customButtonCommand extends BaseCommand<CustomButtonOptions, CustomButtonEvents> {

    constructor(textOrOptions?: string | CustomButtonOptions);
    setText(text: string): this;
    getText(): string;
    setType(type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'): this;
    setSize(size: 'large' | 'default' | 'small'): this;
    setPlain(plain: boolean): this;
    setDisabled(disabled: boolean): this;
    setOnClick(callback: () => void): this;
    /**
     * 渲染为原生按钮元素（轻量级）
     * 只生成 1 个 DOM 节点，而不是 Element Plus 的 6-8 个节点
     */
    protected doRender(): HTMLElement;

    unmount(): void;
}
export default customButtonCommand;