import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface CheckboxOptions extends IBaseCommandProps {
    value?: boolean;
    label?: string | number;
    text?: string;
    disabled?: boolean;
    size?: 'large' | 'default' | 'small';
    indeterminate?: boolean;
    onChange?: (value: boolean) => void;
}
export interface CheckboxEvents extends IBaseCommandEvents {
    change: (value: boolean) => void;
}
export declare class NhaiCheckboxCommand extends BaseCommand<CheckboxOptions, CheckboxEvents> {

    constructor(textOrOptions?: string | CheckboxOptions);
    setValue(value: boolean): this;
    getValue(): boolean;
    setLabel(label: string | number): this;
    setText(text: string): this;
    setDisabled(disabled: boolean): this;
    setSize(size: 'large' | 'default' | 'small'): this;
    setIndeterminate(indeterminate: boolean): this;
    setOnChange(callback: (value: boolean) => void): this;
    protected doRender(): HTMLElement;
    unmount(): void;
}
export default NhaiCheckboxCommand;