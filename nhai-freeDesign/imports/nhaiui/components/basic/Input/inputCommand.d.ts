import { BaseCommand, IBaseCommandEvents, IBaseCommandProps } from '../../../lib/BaseCommand';
export interface InputOptions extends IBaseCommandProps {
    value?: string;
    type?: 'text' | 'textarea' | 'password';
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    showPassword?: boolean;
    prefixIcon?: string;
    suffixIcon?: string;
    maxlength?: number;
    minlength?: number;
    size?: 'large' | 'default' | 'small';
}
export interface InputEvents extends IBaseCommandEvents {
    change: (value: string) => void;
    blur: (event: FocusEvent) => void;
    focus: (event: FocusEvent) => void;
    input: (value: string) => void;
}
/**
 *  Vue 输入框命令式封装
 */
export declare class NhaiInputCommand extends BaseCommand<InputOptions, InputEvents> {

    _appInstance: any;

    constructor(options?: InputOptions);
    configure(options: Partial<InputOptions>): this;
    setValue(value: string): this;
    getValue(): string;
    setType(type: 'text' | 'textarea' | 'password'): this;
    setPlaceholder(placeholder: string): this;
    setDisabled(disabled: boolean): this;
    setClearable(clearable: boolean): this;
    setShowPassword(showPassword: boolean): this;
    setSize(size: 'large' | 'default' | 'small'): this;
    setMaxlength(maxlength: number): this;
    setMinlength(minlength: number): this;
    focus(): this;
    blur(): this;
    clear(): this;
    protected doRender(): HTMLElement;

    unmount(): void;
    renderFallback(): HTMLElement;
}
export default NhaiInputCommand;