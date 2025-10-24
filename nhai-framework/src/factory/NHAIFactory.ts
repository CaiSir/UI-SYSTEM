/**
 * NHAI框架无关的对象工厂
 */

import { NHAIObject } from '../core/NHAICore'
import { 
  NHAIButton, NHAITextButton, NHAILabel, NHAIInput, NHAICard, NHAIContainer, NHAIWindow 
} from '../components/NHAIComponents'
import { 
  NHAIVBoxLayout, NHAIHBoxLayout, NHAIGridLayout 
} from '../components/cusComponents/NHAILayouts/NHAILayouts'
import {
  MaterialButton, MaterialInput, MaterialSelect, MaterialCheckbox, MaterialRadio,
  MaterialSwitch, MaterialSlider, MaterialRate, MaterialTable, MaterialList,
  MaterialCard as MaterialCardComponent, MaterialTag, MaterialBadge, MaterialAvatar,
  MaterialContainer as MaterialContainerComponent, MaterialGrid, MaterialSplitPanel,
  MaterialCollapse, MaterialMenu, MaterialTabs, MaterialBreadcrumb, MaterialMessage,
  MaterialDialog, MaterialLoading, MaterialTooltip, MaterialColorPicker,
  MaterialToolbar,
  MaterialMenuBar, // Added MaterialMenuBar
  ButtonType, InputType,
  SelectType
} from '../components/materialComponents'

// React 版本的 Material UI 组件暂时移除
// 需要安装 React 和 @mui/material 依赖后才能使用

export class NHAIObjectFactory {
  // 创建按钮
  static createButton(text: string = '', parent?: NHAIObject): NHAIButton {
    return new NHAIButton(text, parent)
  }

  // 创建文本按钮
  static createTextButton(text: string = '', parent?: NHAIObject): NHAITextButton {
    return new NHAITextButton(text, parent)
  }

  // 创建标签
  static createLabel(text: string = '', parent?: NHAIObject): NHAILabel {
    return new NHAILabel(text, parent)
  }

  // 创建输入框
  static createInput(parent?: NHAIObject): NHAIInput {
    return new NHAIInput(parent)
  }

  // 创建卡片
  static createCard(parent?: NHAIObject): NHAICard {
    return new NHAICard(parent)
  }

  // 创建容器
  static createContainer(parent?: NHAIObject): NHAIContainer {
    return new NHAIContainer(parent)
  }

  // 创建窗口
  static createWindow(title: string = '', parent?: NHAIObject): NHAIWindow {
    return new NHAIWindow(title, parent)
  }

  // 创建垂直布局
  static createVBoxLayout(parent?: NHAIObject): NHAIVBoxLayout {
    return new NHAIVBoxLayout(parent)
  }

  // 创建水平布局
  static createHBoxLayout(parent?: NHAIObject): NHAIHBoxLayout {
    return new NHAIHBoxLayout(parent)
  }

  // 创建网格布局
  static createGridLayout(parent?: NHAIObject): NHAIGridLayout {
    return new NHAIGridLayout(parent)
  }

  // ========== Material UI 组件工厂方法 ==========

  // 基础交互组件
  static createMaterialButton(text: string = '', parent?: NHAIObject): MaterialButton {
    return new MaterialButton(text, parent)
  }

  static createMaterialInput(parent?: NHAIObject): MaterialInput {
    return new MaterialInput(parent)
  }

  static createMaterialSelect(parent?: NHAIObject): MaterialSelect {
    return new MaterialSelect(parent)
  }

  // ========== 按钮组件细分类型 ==========
  
  // 创建图标按钮
  static createMaterialIconButton(icon: string, parent?: NHAIObject): MaterialButton {
    const button = new MaterialButton('', parent)
    button.setType(ButtonType.ICON_ONLY)
    button.setIcon(icon)
    return button
  }

  // 创建文字按钮
  static createMaterialTextButton(text: string, parent?: NHAIObject): MaterialButton {
    const button = new MaterialButton(text, parent)
    button.setType(ButtonType.TEXT_ONLY)
    return button
  }

  // 创建图标+文字按钮
  static createMaterialIconTextButton(text: string, icon: string, parent?: NHAIObject): MaterialButton {
    const button = new MaterialButton(text, parent)
    button.setType(ButtonType.ICON_TEXT)
    button.setIcon(icon)
    return button
  }

  // 创建浮动按钮
  static createMaterialFloatingButton(icon: string, parent?: NHAIObject): MaterialButton {
    const button = new MaterialButton('', parent)
    button.setType(ButtonType.FLOATING)
    button.setIcon(icon)
    return button
  }

  // 创建下拉按钮
  static createMaterialDropdownButton(text: string, items: Array<{ text: string; value: any; onClick?: () => void }>, parent?: NHAIObject): MaterialButton {
    const button = new MaterialButton(text, parent)
    button.setType(ButtonType.DROPDOWN)
    button.setDropdownItems(items)
    return button
  }

  // 创建切换按钮
  static createMaterialToggleButton(text: string, parent?: NHAIObject): MaterialButton {
    const button = new MaterialButton(text, parent)
    button.setType(ButtonType.TOGGLE)
    return button
  }

  // ========== 输入框组件细分类型 ==========

  // 创建文本输入框
  static createMaterialTextInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.TEXT)
    return input
  }

  // 创建多行输入框
  static createMaterialMultilineInput(rows: number = 3, parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.MULTILINE)
    input.setRows(rows)
    return input
  }

  // 创建密码输入框
  static createMaterialPasswordInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.PASSWORD)
    return input
  }

  // 创建数字输入框
  static createMaterialNumberInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.NUMBER)
    return input
  }

  // 创建搜索输入框
  static createMaterialSearchInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.SEARCH)
    input.setClearable(true)
    return input
  }

  // 创建文件输入框
  static createMaterialFileInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.FILE)
    return input
  }

  // 创建日期输入框
  static createMaterialDateInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.DATE)
    return input
  }

  // 创建邮箱输入框
  static createMaterialEmailInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.EMAIL)
    return input
  }

  // 创建URL输入框
  static createMaterialUrlInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.URL)
    return input
  }

  // 创建电话输入框
  static createMaterialTelInput(parent?: NHAIObject): MaterialInput {
    const input = new MaterialInput(parent)
    input.setType(InputType.TEL)
    return input
  }

  // ========== 选择框组件细分类型 ==========

  // 创建单选选择框
  static createMaterialSingleSelect(parent?: NHAIObject): MaterialSelect {
    const select = new MaterialSelect(parent)
    select.setType(SelectType.BASIC)
    select.setMultiple(false)
    return select
  }

  // 创建多选选择框
  static createMaterialMultipleSelect(parent?: NHAIObject): MaterialSelect {
    const select = new MaterialSelect(parent)
    select.setType(SelectType.MULTIPLE)
    select.setMultiple(true)
    return select
  }

  // 创建搜索选择框
  static createMaterialSearchSelect(parent?: NHAIObject): MaterialSelect {
    const select = new MaterialSelect(parent)
    select.setType(SelectType.SEARCH)
    select.setSearchable(true)
    return select
  }

  // 创建级联选择框
  static createMaterialCascadeSelect(parent?: NHAIObject): MaterialSelect {
    const select = new MaterialSelect(parent)
    select.setType(SelectType.CASCADE)
    return select
  }

  // 创建标签选择框
  static createMaterialTagsSelect(parent?: NHAIObject): MaterialSelect {
    const select = new MaterialSelect(parent)
    select.setType(SelectType.TAGS)
    select.setMultiple(true)
    select.setAllowCreate(true)
    return select
  }

  // 创建树形选择框
  static createMaterialTreeSelect(parent?: NHAIObject): MaterialSelect {
    const select = new MaterialSelect(parent)
    select.setType(SelectType.TREE)
    return select
  }

  // ========== 工具栏组件 ==========

  // 创建 Material 工具栏
  static createMaterialToolbar(parent?: NHAIObject): MaterialToolbar {
    return new MaterialToolbar(parent)
  }

  // ========== 菜单栏组件 ==========

  // 创建 Material 菜单栏
  static createMaterialMenuBar(parent?: NHAIObject): MaterialMenuBar {
    return new MaterialMenuBar(parent)
  }

  static createMaterialCheckbox(parent?: NHAIObject): MaterialCheckbox {
    return new MaterialCheckbox(parent)
  }

  static createMaterialRadio(parent?: NHAIObject): MaterialRadio {
    return new MaterialRadio(parent)
  }

  static createMaterialSwitch(parent?: NHAIObject): MaterialSwitch {
    return new MaterialSwitch(parent)
  }

  static createMaterialSlider(parent?: NHAIObject): MaterialSlider {
    return new MaterialSlider(parent)
  }

  static createMaterialRate(parent?: NHAIObject): MaterialRate {
    return new MaterialRate(parent)
  }

  // 数据展示组件
  static createMaterialTable(parent?: NHAIObject): MaterialTable {
    return new MaterialTable(parent)
  }

  static createMaterialList(parent?: NHAIObject): MaterialList {
    return new MaterialList(parent)
  }

  static createMaterialCard(parent?: NHAIObject): MaterialCardComponent {
    return new MaterialCardComponent(parent)
  }

  static createMaterialTag(text: string = '', parent?: NHAIObject): MaterialTag {
    return new MaterialTag(text, parent)
  }

  static createMaterialBadge(parent?: NHAIObject): MaterialBadge {
    return new MaterialBadge(parent)
  }

  static createMaterialAvatar(parent?: NHAIObject): MaterialAvatar {
    return new MaterialAvatar(parent)
  }

  // 布局容器组件
  static createMaterialContainer(parent?: NHAIObject): MaterialContainerComponent {
    return new MaterialContainerComponent(parent)
  }

  static createMaterialGrid(parent?: NHAIObject): MaterialGrid {
    return new MaterialGrid(parent)
  }

  static createMaterialSplitPanel(parent?: NHAIObject): MaterialSplitPanel {
    return new MaterialSplitPanel(parent)
  }

  static createMaterialCollapse(parent?: NHAIObject): MaterialCollapse {
    return new MaterialCollapse(parent)
  }

  // 导航组件
  static createMaterialMenu(parent?: NHAIObject): MaterialMenu {
    return new MaterialMenu(parent)
  }

  static createMaterialTabs(parent?: NHAIObject): MaterialTabs {
    return new MaterialTabs(parent)
  }

  static createMaterialBreadcrumb(parent?: NHAIObject): MaterialBreadcrumb {
    return new MaterialBreadcrumb(parent)
  }

  // 反馈组件
  static createMaterialMessage(parent?: NHAIObject): MaterialMessage {
    return new MaterialMessage(parent)
  }

  static createMaterialDialog(parent?: NHAIObject): MaterialDialog {
    return new MaterialDialog(parent)
  }

  static createMaterialLoading(parent?: NHAIObject): MaterialLoading {
    return new MaterialLoading(parent)
  }

  // 工具组件
  static createMaterialTooltip(parent?: NHAIObject): MaterialTooltip {
    return new MaterialTooltip(parent)
  }

  static createMaterialColorPicker(parent?: NHAIObject): MaterialColorPicker {
    return new MaterialColorPicker(parent)
  }

  // ========== React 版本的 Material UI 组件工厂方法 ==========
  // 注意：React 版本的组件需要安装 React 和 @mui/material 依赖
  // 目前暂时移除，等待依赖安装完成后重新实现
}

// 导出工厂实例
export const nhaiFactory = NHAIObjectFactory
