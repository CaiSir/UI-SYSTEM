import { TabItem } from './types';
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface TabsOptions extends IBaseCommandProps {
    value?: string;
    items?: TabItem[];
    type?: 'card' | 'border-card' | '';
    tabPosition?: 'top' | 'right' | 'bottom' | 'left';
    stretch?: boolean;
    addable?: boolean;
    editable?: boolean;
    onTabClick?: (tab: TabItem) => void;
    onTabRemove?: (name: string) => void;
    onTabAdd?: (name: string) => void;
    onEdit?: (name: string, action: 'add' | 'remove') => void;
}
export interface TabsEvents extends IBaseCommandEvents {
    tabClick: (tab: TabItem) => void;
    tabRemove: (name: string) => void;
    tabAdd: (name: string) => void;
    edit: (name: string, action: 'add' | 'remove') => void;
}
/**
 * 标签页组件命令式 API
 * 支持多种样式、可编辑、可添加/删除标签等功能
 */
export declare class NhaiTabsCommand extends BaseCommand<TabsOptions, TabsEvents> {

    /**
     * 创建标签页组件
     * @param itemsOrOptions - 标签项数组或选项对象
     */
    constructor(itemsOrOptions?: TabItem[] | TabsOptions);
    /**
     * 设置当前激活的标签页
     * @param value - 标签页的名称（name）
     */
    setValue(value: string): this;
    /**
     * 获取当前激活的标签页
     * @returns 当前标签页名称
     */
    getValue(): string;
    /**
     * 设置标签页列表
     * @param items - 标签项数组
     */
    setItems(items: TabItem[]): this;
    /**
     * 获取标签页列表
     * @returns 当前标签项数组
     */
    getItems(): TabItem[];
    /**
     * 添加标签页
     * @param item - 要添加的标签项
     */
    addItem(item: TabItem): this;
    /**
     * 移除标签页
     * @param name - 要移除的标签页名称
     */
    removeItem(name: string): this;
    /**
     * 设置标签页类型
     * @param type - 类型：card（卡片）、border-card（带边框的卡片）、''（普通）
     */
    setType(type: 'card' | 'border-card' | ''): this;
    /**
     * 设置标签页位置
     * @param position - 位置：top（顶部）、right（右侧）、bottom（底部）、left（左侧）
     */
    setTabPosition(position: 'top' | 'right' | 'bottom' | 'left'): this;
    /**
     * 设置标签是否拉伸
     * @param stretch - true 为拉伸填充，false 为自适应宽度
     */
    setStretch(stretch: boolean): this;
    /**
     * 设置是否可添加标签
     * @param addable - true 显示添加按钮，false 隐藏
     */
    setAddable(addable: boolean): this;
    /**
     * 设置是否可编辑标签
     * @param editable - true 可编辑，false 不可编辑
     */
    setEditable(editable: boolean): this;
    /**
     * 设置标签点击事件
     * @param callback - 点击时的回调函数，参数为点击的标签项
     */
    setOnTabClick(callback: (tab: TabItem) => void): this;
    /**
     * 设置标签移除事件
     * @param callback - 移除时的回调函数，参数为标签名称
     */
    setOnTabRemove(callback: (name: string) => void): this;
    /**
     * 设置标签添加事件
     * @param callback - 添加时的回调函数，参数为标签名称
     */
    setOnTabAdd(callback: (name: string) => void): this;
    /**
     * 设置编辑事件
     * @param callback - 编辑时的回调函数，参数为标签名称和操作类型（add/remove）
     */
    setOnEdit(callback: (name: string, action: 'add' | 'remove') => void): this;
    protected doRender(): HTMLElement;
    unmount(): void;
}
export default NhaiTabsCommand;
export type { TabItem };