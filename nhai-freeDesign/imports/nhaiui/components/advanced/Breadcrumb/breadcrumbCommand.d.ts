import { BreadcrumbItem } from './types';
import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface BreadcrumbOptions extends IBaseCommandProps {
    items?: BreadcrumbItem[];
    separator?: string;
    onItemClick?: (item: BreadcrumbItem, index: number) => void;
}
export interface BreadcrumbEvents extends IBaseCommandEvents {
    itemClick: (item: BreadcrumbItem, index: number) => void;
}
/**
 * 面包屑组件命令式 API
 * 用于显示当前页面路径，提供导航功能
 */
export declare class NhaiBreadcrumbCommand extends BaseCommand<BreadcrumbOptions, BreadcrumbEvents> {

    /**
     * 创建面包屑组件
     * @param itemsOrOptions - 面包屑项数组或选项对象
     */
    constructor(itemsOrOptions?: BreadcrumbItem[] | BreadcrumbOptions);
    /**
     * 设置面包屑项
     * @param items - 面包屑项数组
     */
    setItems(items: BreadcrumbItem[]): this;
    /**
     * 获取面包屑项
     * @returns 当前面包屑项数组
     */
    getItems(): BreadcrumbItem[];
    /**
     * 添加面包屑项
     * @param item - 要添加的面包屑项
     */
    addItem(item: BreadcrumbItem): this;
    /**
     * 移除面包屑项
     * @param index - 要移除的项索引
     */
    removeItem(index: number): this;
    /**
     * 设置分隔符
     * @param separator - 分隔符字符串，默认为 '/'
     */
    setSeparator(separator: string): this;
    /**
     * 设置面包屑项点击事件
     * @param callback - 点击时的回调函数，参数为点击的项和索引
     */
    setOnItemClick(callback: (item: BreadcrumbItem, index: number) => void): this;
    protected doRender(): HTMLElement;
    unmount(): void;
}
export default NhaiBreadcrumbCommand;
export type { BreadcrumbItem };