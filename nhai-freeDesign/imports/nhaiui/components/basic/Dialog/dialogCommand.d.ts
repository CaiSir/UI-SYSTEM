import { BaseCommand, IBaseCommandProps, IBaseCommandEvents } from '../../../lib/BaseCommand';
export interface DialogOptions extends IBaseCommandProps {
    modelValue?: boolean;
    title?: string;
    width?: string | number;
    fullscreen?: boolean;
    top?: string;
    modal?: boolean;
    modalClass?: string;
    modalStyle?: Record<string, any>;
    modalBackdrop?: boolean;
    modalFade?: boolean;
    appendToBody?: boolean;
    lockScroll?: boolean;
    openDelay?: number;
    closeDelay?: number;
    closeOnClickModal?: boolean;
    closeOnPressEscape?: boolean;
    showClose?: boolean;
    draggable?: boolean;
    center?: boolean;
    alignCenter?: boolean;
    destroyOnClose?: boolean;
    closeIcon?: string;
    zIndex?: number;
    headerAriaLevel?: string;
    header?: string;
    content?: string;
    showFooter?: boolean;
    confirmText?: string;
    cancelText?: string;
    dialogClass?: string;
}
export interface DialogEvents extends IBaseCommandEvents {
    'update:modelValue': (value: boolean) => void;
    open: () => void;
    opened: () => void;
    close: () => void;
    closed: () => void;
    confirm: () => void;
    cancel: () => void;
}
export declare class NhaiDialogCommand extends BaseCommand<DialogOptions, DialogEvents> {

    protected childElements: Map<BaseCommand<any, any>, HTMLElement>;
    protected contentContainer?: HTMLElement;
    /**
     * 构造函数
     * @param titleOrOptions - 对话框标题或完整选项对象
     * @param content - 对话框内容（支持 HTML）（仅在第一个参数为字符串时使用）
     */
    constructor(titleOrOptions?: string | DialogOptions, content?: string);
    /**
     * 获取对话框显示状态
     */
    getModelValue(): boolean;
    /**
     * 获取对话框标题
     */
    getTitle(): string | undefined;
    /**
     * 获取对话框宽度
     */
    getWidth(): string | number | undefined;
    /**
     * 获取对话框内容
     */
    getContent(): string | undefined;
    /**
     * 设置对话框显示状态
     * @param value - true 显示，false 隐藏
     */
    setModelValue(value: boolean): this;
    /**
     * 设置对话框标题
     * @param title - 标题文本
     */
    setTitle(title: string): this;
    /**
     * 设置对话框宽度
     * @param width - 宽度值，支持字符串（如 '50%', '500px'）或数字
     */
    setWidth(width: string | number): this;
    /**
     * 设置是否全屏显示
     * @param fullscreen - true 全屏，false 非全屏
     */
    setFullscreen(fullscreen: boolean): this;
    /**
     * 设置对话框距离顶部的位置
     * @param top - 距离值，如 '15vh'
     */
    setTop(top: string): this;
    /**
     * 设置是否显示遮罩层
     * @param modal - true 显示遮罩，false 不显示
     */
    setModal(modal: boolean): this;
    /**
     * 设置遮罩层的自定义样式类名
     * @param modalClass - 样式类名
     */
    setModalClass(modalClass: string): this;
    /**
     * 设置遮罩层的自定义样式
     * @param modalStyle - 样式对象，如 { backgroundColor: 'rgba(0,0,0,0.8)' }
     */
    setModalStyle(modalStyle: Record<string, any>): this;
    /**
     * 设置是否显示遮罩层背景
     * @param modalBackdrop - true 显示背景，false 透明背景
     */
    setModalBackdrop(modalBackdrop: boolean): this;
    /**
     * 设置遮罩层淡入淡出动画
     * @param modalFade - true 启用动画，false 禁用动画
     */
    setModalFade(modalFade: boolean): this;
    /**
     * 设置是否将对话框挂载到 body
     * 建议设置为 true，避免样式和层级问题
     * @param appendToBody - true 挂载到 body，false 不挂载
     */
    setAppendToBody(appendToBody: boolean): this;
    /**
     * 设置是否锁定背景滚动
     * @param lockScroll - true 锁定，false 不锁定
     */
    setLockScroll(lockScroll: boolean): this;
    /**
     * 设置点击遮罩层是否关闭对话框
     * 模态对话框建议设置为 false，防止意外关闭
     * @param closeOnClickModal - true 点击关闭，false 不关闭（默认 false）
     */
    setCloseOnClickModal(closeOnClickModal: boolean): this;
    /**
     * 设置按 ESC 键是否关闭对话框
     * @param closeOnPressEscape - true 按 ESC 关闭，false 不关闭
     */
    setCloseOnPressEscape(closeOnPressEscape: boolean): this;
    /**
     * 设置是否显示关闭按钮
     * @param showClose - true 显示，false 不显示
     */
    setShowClose(showClose: boolean): this;
    /**
     * 设置对话框是否可拖动
     * @param draggable - true 可拖动，false 不可拖动
     */
    setDraggable(draggable: boolean): this;
    /**
     * 设置对话框是否居中显示
     * @param center - true 居中，false 不居中
     */
    setCenter(center: boolean): this;
    /**
     * 设置标题和内容是否居中
     * @param alignCenter - true 居中，false 不居中
     */
    setAlignCenter(alignCenter: boolean): this;
    /**
     * 设置关闭时是否销毁组件
     * @param destroyOnClose - true 销毁，false 不销毁
     */
    setDestroyOnClose(destroyOnClose: boolean): this;
    /**
     * 设置对话框层级（z-index）
     * @param zIndex - 层级值，默认 2000
     */
    setZIndex(zIndex: number): this;
    /**
     * 设置头部内容（覆盖标题）
     * @param header - 头部文本或 HTML
     */
    setHeader(header: string): this;
    /**
     * 设置对话框内容（支持 HTML）
     * @param content - 内容文本或 HTML
     */
    setContent(content: string): this;
    /**
     * 设置是否显示底部按钮（确认/取消）
     * @param showFooter - true 显示，false 不显示
     */
    setShowFooter(showFooter: boolean): this;
    /**
     * 设置确认按钮文本
     * @param confirmText - 按钮文本，默认 '确定'
     */
    setConfirmText(confirmText: string): this;
    /**
     * 设置取消按钮文本
     * @param cancelText - 按钮文本，默认 '取消'
     */
    setCancelText(cancelText: string): this;
    /**
     * 设置对话框的自定义样式类名
     * @param className - 样式类名
     */
    setClass(className: string): this;
    /**
     * 重写 addChild 方法以支持在对话框内容中添加控件
     * @param child - BaseCommand 子组件实例
     */
    addChild(child: BaseCommand<any, any>): this;
    /**
     * 重写 removeChild 方法
     * @param child - BaseCommand 子组件实例
     */
    removeChild(child: BaseCommand<any, any>): this;
    /**
     * 渲染子组件到内容容器
     * @param child - BaseCommand 子组件实例
     */

    /**
     * 渲染所有子组件
     */

    /**
     * 打开对话框
     * 等同于调用 setModelValue(true)
     */
    open(): void;
    /**
     * 关闭对话框
     * 等同于调用 setModelValue(false)
     */
    close(): void;
    /**
     * 切换对话框显示状态
     * 如果当前是打开状态则关闭，如果是关闭状态则打开
     */
    toggle(): void;
    /**
     * 渲染对话框为 DOM 元素
     * 创建 Vue 组件实例并挂载到容器中
     * @returns HTMLDivElement - 渲染后的容器元素
     */
    protected doRender(): HTMLElement;
    /**
     * 尝试附加内容容器到对话框内容区域
     * 在对话框打开时调用此方法
     */

    /**
     * 卸载对话框组件
     * 清理所有资源，包括从 DOM 中移除元素
     */
    unmount(): void;
}
export default NhaiDialogCommand;