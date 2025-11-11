import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface SwitchOptions extends IBaseCommandProps {
    value?: boolean;
    disabled?: boolean;
    size?: 'large' | 'default' | 'small';
    activeText?: string;
    inactiveText?: string;
    activeColor?: string;
    inactiveColor?: string;
    onChange?: (value: boolean) => void;
}
export interface SwitchEvents extends IBaseCommandEvents {
    change: (value: boolean) => void;
}
export declare class NhaiSwitchCommand extends BaseCommand<SwitchOptions, SwitchEvents> {

    constructor(valueOrOptions?: boolean | SwitchOptions);
    setValue(value: boolean): this;
    getValue(): boolean;
    setDisabled(disabled: boolean): this;
    setSize(size: 'large' | 'default' | 'small'): this;
    setActiveText(text: string): this;
    setInactiveText(text: string): this;
    setActiveColor(color: string): this;
    setInactiveColor(color: string): this;
    setOnChange(callback: (value: boolean) => void): this;
    protected doRender(): HTMLElement;
    unmount(): void;
}
export default NhaiSwitchCommand;