/**
 * NHAI UI Vue 命名空间类型
 * 提供按功能分类的组件组织方式
 */
// 自动生成的组件和库导入
import type { AbsolutePanelCommand } from './components/basic/AbsolutePanel/absolutePanelCommand';
import type { NhaiBreadcrumbCommand } from './components/advanced/Breadcrumb/breadcrumbCommand';
import type { NhaiButtonCommand } from './components/basic/Button/buttonCommand';
import type { NhaiCardCommand } from './components/advanced/Card/cardCommand';
import type { NhaiCheckboxCommand } from './components/basic/Checkbox/checkboxCommand';
import type { NhaiColCommand } from './components/basic/Col/colCommand';
import type { NhaiContainerCommand } from './components/basic/Container/containerCommand';
import type { NhaiDialogCommand } from './components/basic/Dialog/dialogCommand';
import type { NhaiGridCommand } from './components/basic/Grid/gridCommand';
import type { NhaiInputCommand } from './components/basic/Input/inputCommand';
import type { NhaiLayoutBuilderCommand } from './components/basic/LayoutBuilder/layoutBuilderCommand';
import type { NhaiMenuBarCommand } from './components/advanced/MenuBar/menuBarCommand';
import type { NhaiRowCommand } from './components/basic/Row/rowCommand';
import type { NhaiSelectCommand } from './components/basic/Select/selectCommand';
import type { NhaiSplitPanelCommand } from './components/advanced/SplitPanel/splitPanelCommand';
import type { NhaiSwitchCommand } from './components/basic/Switch/switchCommand';
import type { NhaiTabsCommand } from './components/advanced/Tabs/tabsCommand';
import type { NhaiWidgetCommand } from './components/basic/Widget/widgetCommand';
import type { customButtonCommand as LightweightButtonCommand } from './components/basic/Button/customButtonCommand';
export interface NHAIUIVueNamespace {
    NhaiButtonCommand: typeof NhaiButtonCommand;
    NhaiInputCommand: typeof NhaiInputCommand;
    NhaiSelectCommand: typeof NhaiSelectCommand;
    NhaiSwitchCommand: typeof NhaiSwitchCommand;
    NhaiCheckboxCommand: typeof NhaiCheckboxCommand;
    NhaiCardCommand: typeof NhaiCardCommand;
    NhaiRowCommand: typeof NhaiRowCommand;
    NhaiColCommand: typeof NhaiColCommand;
    NhaiGridCommand: typeof NhaiGridCommand;
    NhaiContainerCommand: typeof NhaiContainerCommand;
    AbsolutePanelCommand: typeof AbsolutePanelCommand;
    NhaiLayoutBuilderCommand: typeof NhaiLayoutBuilderCommand;
    NhaiDialogCommand: typeof NhaiDialogCommand;
    NhaiWidgetCommand: typeof NhaiWidgetCommand;
    NhaiSplitPanelCommand: typeof NhaiSplitPanelCommand;
    NhaiBreadcrumbCommand: typeof NhaiBreadcrumbCommand;
    NhaiTabsCommand: typeof NhaiTabsCommand;
    NhaiMenuBarCommand: typeof NhaiMenuBarCommand;
}
/**
 * NHAI UI Vue 命名空间对象
 * 提供按功能分类的组件组织方式
 *
 * @example
 * ```typescript
 * import { NHAIUIVue } from 'nhai-ui-vue'
 *
 * const button = new NHAIUIVue.Components.Button('按钮')
 * const row = new NHAIUIVue.Layout.Row()
 * const col = new NHAIUIVue.Layout.Col({ span: 12 })
 * ```
 */
export declare const NHAIUIVue: NHAIUIVueNamespace;
export default NHAIUIVue;


declare global {
  interface Window {
    NHAIUIVue: NHAIUIVueNamespace
  }
}