import { MenuItem } from './types';
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface MenuBarOptions extends IBaseCommandProps {
    items?: MenuItem[];
    mode?: 'horizontal' | 'vertical';
    defaultActive?: string;
    collapse?: boolean;
    uniqueOpened?: boolean;
    router?: boolean;
    collapseTransition?: boolean;
    onSelect?: (index: string, indexPath: string[]) => void;
}
export interface MenuBarEvents extends IBaseCommandEvents {
    select: (index: string, indexPath: string[]) => void;
}
export declare class NhaiMenuBarCommand extends BaseCommand<MenuBarOptions, MenuBarEvents> {

    constructor(itemsOrOptions?: MenuItem[] | MenuBarOptions);
    setItems(items: MenuItem[]): this;
    getItems(): MenuItem[];
    addItem(item: MenuItem): this;
    removeItem(id: string | number): this;
    setMode(mode: 'horizontal' | 'vertical'): this;
    setDefaultActive(active: string): this;
    setCollapse(collapse: boolean): this;
    setUniqueOpened(unique: boolean): this;
    setRouter(router: boolean): this;
    setCollapseTransition(transition: boolean): this;
    setOnSelect(callback: (index: string, indexPath: string[]) => void): this;
    protected doRender(): HTMLElement;
    unmount(): void;
}
export default NhaiMenuBarCommand;
export type { MenuItem };