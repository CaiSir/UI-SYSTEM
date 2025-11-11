/**
 * UI 辅助工具类
 * 提供创建常见 UI 元素的便捷方法
 */
/**
 * 创建文本元素
 */
export declare function createText(content: string): HTMLElement;
/**
 * 创建带样式的文本元素
 */
export declare function createStyledText(content: string, styles: Record<string, string>): HTMLElement;
/**
 * 创建分隔符
 */
export declare function createSeparator(orientation?: 'horizontal' | 'vertical'): HTMLElement;
/**
 * 创建标题
 */
export declare function createHeading(text: string, level?: 1 | 2 | 3 | 4 | 5 | 6): HTMLElement;
/**
 * 创建段落
 */
export declare function createParagraph(text: string): HTMLElement;
/**
 * 创建占位符
 */
export declare function createSpacer(size?: string): HTMLElement;
/**
 * 创建空白行
 */
export declare function createBlankLine(): HTMLElement;
/**
 * 创建行内元素
 */
export declare function createSpan(text: string, styles?: Record<string, string>): HTMLElement;
/**
 * 创建链接
 */
export declare function createLink(text: string, href: string, target?: '_blank' | '_self'): HTMLElement;
/**
 * UI 辅助工具类（静态方法版本，向后兼容）
 */
export declare class UIHelpers {
    static createText: typeof createText;
    static createStyledText: typeof createStyledText;
    static createSeparator: typeof createSeparator;
    static createHeading: typeof createHeading;
    static createParagraph: typeof createParagraph;
    static createSpacer: typeof createSpacer;
    static createBlankLine: typeof createBlankLine;
    static createSpan: typeof createSpan;
    static createLink: typeof createLink;
}