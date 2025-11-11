import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface ContainerOptions extends IBaseCommandProps {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fixed?: boolean;
    disableGutters?: boolean;
    content?: string;
    layoutLeftMargin?: number | string;
    topMargin?: number | string;
    rightMargin?: number | string;
    bottomMargin?: number | string;
    layoutSpacing?: number;
    layoutStretch?: boolean;
}
export interface ContainerEvents extends IBaseCommandEvents {
}
export declare class NhaiContainerCommand extends BaseCommand<ContainerOptions, ContainerEvents> {

    constructor(contentOrOptions?: string | ContainerOptions);
    setMaxWidth(maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false): this;
    setFixed(fixed: boolean): this;
    setDisableGutters(disableGutters: boolean): this;
    setContent(content: string): this;
    setLayoutLeftMargin(margin: number | string): this;
    setTopMargin(margin: number | string): this;
    setRightMargin(margin: number | string): this;
    setBottomMargin(margin: number | string): this;
    setLayoutSpacing(spacing: number): this;
    setLayoutStretch(stretch: boolean): this;
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
     * 重写 update 方法，确保样式变化时正确应用
     */
    protected update(): void;
    unmount(): void;
}
export default NhaiContainerCommand;