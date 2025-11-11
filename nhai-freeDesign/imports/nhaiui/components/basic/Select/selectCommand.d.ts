import { SelectOption } from './types';
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface SelectOptions extends IBaseCommandProps {
    value?: string | number | Array<string | number>;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    multiple?: boolean;
    size?: 'large' | 'default' | 'small';
    options?: SelectOption[];
    onChange?: (value: any) => void;
}
export interface SelectEvents extends IBaseCommandEvents {
    change: (value: any) => void;
}
/**
 * 下拉选择框组件命令式 API
 * 支持单选、多选、可清除、可搜索等功能
 */
export declare class NhaiSelectCommand extends BaseCommand<SelectOptions, SelectEvents> {

    constructor(placeholderOrOptions?: string | SelectOptions);
    setValue(value: string | number | Array<string | number>): this;
    getValue(): any;
    setPlaceholder(placeholder: string): this;
    setDisabled(disabled: boolean): this;
    setClearable(clearable: boolean): this;
    setMultiple(multiple: boolean): this;
    setSize(size: 'large' | 'default' | 'small'): this;
    setOptions(options: SelectOption[]): this;
    addOption(option: SelectOption): this;
    setOnChange(callback: (value: any) => void): this;
    protected doRender(): HTMLElement;
    unmount(): void;
    renderFallback(): HTMLElement;
}
export default NhaiSelectCommand;