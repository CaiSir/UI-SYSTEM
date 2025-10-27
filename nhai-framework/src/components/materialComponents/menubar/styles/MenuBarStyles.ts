/**
 * MaterialMenuBar 样式管理模块
 * 统一管理所有菜单栏相关样式
 */

export class MenuBarStyles {
  private static instance: MenuBarStyles
  private stylesLoaded = false

  static getInstance(): MenuBarStyles {
    if (!MenuBarStyles.instance) {
      MenuBarStyles.instance = new MenuBarStyles()
    }
    return MenuBarStyles.instance
  }

  /**
   * 加载菜单栏样式
   */
  loadStyles(): void {
    if (this.stylesLoaded) {
      return
    }

    const styleId = 'nhai-menubar-styles'
    if (document.getElementById(styleId)) {
      this.stylesLoaded = true
      return
    }

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = this.getMenuBarCSS()
    document.head.appendChild(style)
    
    this.stylesLoaded = true
  }

  /**
   * 获取菜单栏CSS样式
   */
  getMenuBarCSS(): string {
    return `
      /* NHAI Material MenuBar Styles */

      /* 子菜单项基础样式 */
      .nhai-submenu-item {
        border-radius: 4px;
        margin: 1px 2px;
        padding: 6px 8px;
        border-bottom: none;
        font-size: 13px;
        font-weight: 400;
        min-height: 28px;
        height: auto;
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        color: #1a1a1a;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      /* 子菜单项悬停效果 */
      .nhai-submenu-item:hover {
        background-color: rgba(0, 161, 214, 0.08);
        color: #00a1d6;
        transform: translateX(4px);
      }

      /* 子菜单父容器样式 */
      .nhai-submenu {
        position: relative;
        display: inline-block;
      }

      /* 子菜单容器样式 */
      .nhai-submenu-container {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 12px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1);
        min-width: 140px;
        width: auto;
        z-index: 9999;
        display: block;
        padding: 4px 0;
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.98);
        margin-top: 8px;
        visibility: hidden;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* 子菜单容器显示状态 */
      .nhai-submenu-container.nhai-submenu-visible {
        visibility: visible !important;
        opacity: 1 !important;
        transform: translateY(0) !important;
      }

      /* 分隔符样式 */
      .nhai-menu-separator {
        height: 1px;
        background-color: rgba(0, 0, 0, 0.08);
        margin: 4px 12px;
        width: calc(100% - 24px);
        border-radius: 1px;
        flex-shrink: 0;
        border: none;
        outline: none;
        padding: 0;
        min-height: 1px;
        max-height: 1px;
        overflow: hidden;
        display: block;
      }

      /* 主菜单项悬停效果 */
      .nhai-main-menu-item:hover {
        background-color: rgba(0, 161, 214, 0.08);
        color: #00a1d6;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 161, 214, 0.15);
      }

      /* 菜单栏基础样式 */
    .nhai-menu-bar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background-color: #ffffff;
        border: none;
        border-radius: 0;
        width: 100%;
        height: 50px;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        padding: 0 !important;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        box-shadow: none !important;
        min-height: 50px;
        user-select: none;
        position: relative;
        z-index: 1000;
        overflow: visible;
        max-width: 100vw;
        backdrop-filter: blur(10px);
        border: none !important;
        margin: 0 !important;
        outline: none !important;
    }

      /* 菜单项基础样式 */
      .nhai-menu-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        border-radius: 6px;
        margin: 0 1px;
        position: relative;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: 0.01em;
        background: transparent;
        border: none;
        white-space: nowrap;
        min-height: 36px;
        text-align: center;
        color: #1a1a1a;
        height: 36px;
        flex: 0 0 auto;
        min-width: 60px;
        max-width: 120px;
        overflow: visible;
      }

      /* 菜单项禁用状态 */
      .nhai-menu-item:disabled {
        cursor: default;
        opacity: 0.5;
      }

      /* 嵌入控件的菜单项样式 */
      .menu-item-widget {
        max-width: none !important;
        min-width: auto !important;
        padding: 4px 8px !important;
        justify-content: flex-start !important;
        align-items: center !important;
        height: 36px !important;
      }

      /* 菜单栏中嵌入控件的容器样式优化 */
      .menu-item-widget > * {
        width: 100%;
        height: 100%;
        display: flex !important;
        align-items: center !important;
      }

      .menu-item-widget .mui-switch-container,
      .menu-item-widget .mui-checkbox-container,
      .menu-item-widget .mui-radio-container,
      .menu-item-widget .mui-slider-container,
      .menu-item-widget .mui-button-container {
        margin: 0;
        padding: 0;
        height: 100% !important;
        min-height: 36px !important;
        display: flex !important;
        align-items: center !important;
        gap: 4px;
      }

      /* Switch 组件在菜单栏中的样式优化 */
      .menu-item-widget .mui-switch {
        margin: 0 !important;
        flex-shrink: 0;
        position: relative !important;
        overflow: visible !important;
      }

      /* Switch thumb（切换按钮）的样式 */
      .menu-item-widget .mui-switch-thumb {
        position: absolute !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        z-index: 10 !important;
      }
      
      /* Switch 容器确保有足够空间 */
      .menu-item-widget .mui-switch-container {
        overflow: visible !important;
      }

      /* Switch 标签在菜单栏中的样式 */
      .menu-item-widget .mui-switch-label {
        font-size: 13px !important;
        margin-left: 6px !important;
        margin-right: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* 优化其他控件标签 */
      .menu-item-widget .mui-checkbox-label,
      .menu-item-widget .mui-radio-label,
      .menu-item-widget .mui-slider-label {
        font-size: 13px !important;
        margin: 0 6px 0 0 !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* 菜单项标签样式 */
      .nhai-menu-item-label {
        display: inline-block;
        white-space: nowrap;
        font-size: 15px;
        font-weight: 500;
        color: inherit;
        line-height: 1.4;
      }

      /* 菜单项快捷键样式 */
      .nhai-menu-item-shortcut {
        margin-left: auto;
        font-size: 12px;
        opacity: 0.7;
      }

      /* 菜单项图标样式 */
      .nhai-menu-item-icon {
        margin-right: 8px;
        font-size: 16px;
      }

      /* 下拉箭头样式 */
      .menu-submenu-arrow {
        margin-left: 8px !important;
        font-size: 12px !important;
        color: inherit !important;
        transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        opacity: 0.7;
        font-family: monospace;
        display: inline-block;
        line-height: 1;
      }

      /* 子菜单展开时箭头旋转 */
      .nhai-submenu.nhai-submenu-visible .menu-submenu-arrow {
        transform: rotate(90deg) !important;
        opacity: 1 !important;
      }

      /* 悬停时箭头效果 */
      .nhai-main-menu-item:hover .menu-submenu-arrow {
        opacity: 1;
        transform: scale(1.1);
      }

      /* 响应式设计 */
      @media (max-width: 768px) {
        .nhai-menu-bar {
          padding: 0 16px;
          height: 50px;
          min-height: 50px;
        }
        
        .nhai-menu-item {
          padding: 0 12px;
          font-size: 14px;
          min-width: 60px;
          max-width: 120px;
        }

        .menu-item-widget {
          min-width: 60px !important;
          max-width: 200px !important;
        }
        
        .nhai-submenu-container {
          min-width: 180px;
        }
      }

      /* 暗色主题支持 */
      @media (prefers-color-scheme: dark) {
        .nhai-menu-bar {
          background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nhai-menu-item {
          color: #ffffff;
        }
        
        .nhai-submenu-container {
          background-color: #2d2d2d;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(45, 45, 45, 0.98);
        }
        
        .nhai-submenu-item {
          color: #ffffff;
        }
        
        .nhai-menu-separator {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    `
  }

  /**
   * 卸载样式
   */
  unloadStyles(): void {
    const styleElement = document.getElementById('nhai-menubar-styles')
    if (styleElement) {
      styleElement.remove()
      this.stylesLoaded = false
    }
  }

  /**
   * 更新主题
   */
  updateTheme(theme: 'light' | 'dark'): void {
    // 可以动态更新主题相关的CSS变量
    const root = document.documentElement
    if (theme === 'dark') {
      root.style.setProperty('--nhai-primary-color', '#00b0ff')
      root.style.setProperty('--nhai-bg-color', '#2d2d2d')
      root.style.setProperty('--nhai-text-color', '#ffffff')
    } else {
      root.style.setProperty('--nhai-primary-color', '#00a1d6')
      root.style.setProperty('--nhai-bg-color', '#ffffff')
      root.style.setProperty('--nhai-text-color', '#1a1a1a')
    }
  }
}
