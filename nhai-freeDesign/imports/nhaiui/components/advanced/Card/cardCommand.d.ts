import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface CardOptions extends IBaseCommandProps {
    header?: string;
    shadow?: 'always' | 'hover' | 'never';
    bodyStyle?: Record<string, any>;
    content?: string;
    cardClass?: string;
}
export interface CardEvents extends IBaseCommandEvents {
}
export declare class NhaiCardCommand extends BaseCommand<CardOptions, CardEvents> {

    constructor(headerOrOptions?: string | CardOptions, content?: string);
    setHeader(header: string): this;
    setShadow(shadow: 'always' | 'hover' | 'never'): this;
    setBodyStyle(style: Record<string, any>): this;
    setContent(content: string): this;
    setClass(className: string): this;
    protected doRender(): HTMLElement;
    unmount(): void;
}
export default NhaiCardCommand;