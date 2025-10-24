/**
 * Material Components 细分类型使用示例
 * 展示如何使用各种细分类型的组件
 */

import { NHAIObjectFactory, ButtonType, ButtonColor, ButtonSize, InputType, SelectType } from '../../factory/NHAIFactory'

// ========== 按钮细分类型示例 ==========

export function createButtonVariantsExample() {
  console.log('=== 按钮细分类型示例 ===')

  // 1. 基础按钮
  const basicButton = NHAIObjectFactory.createMaterialButton('基础按钮')
  basicButton.setType(ButtonType.BASIC)
  basicButton.setColor(ButtonColor.BLUE)
  basicButton.setSize(ButtonSize.MEDIUM)

  // 2. 图标按钮
  const iconButton = NHAIObjectFactory.createMaterialIconButton('save')
  iconButton.setColor(ButtonColor.GREEN)
  iconButton.setSize(ButtonSize.SMALL)

  // 3. 文字按钮
  const textButton = NHAIObjectFactory.createMaterialTextButton('文字按钮')
  textButton.setVariant('flat')
  textButton.setColor(ButtonColor.RED)

  // 4. 图标+文字按钮
  const iconTextButton = NHAIObjectFactory.createMaterialIconTextButton('保存', 'save')
  iconTextButton.setColor(ButtonColor.BLUE)
  iconTextButton.setIconPosition('left')

  // 5. 浮动按钮
  const floatingButton = NHAIObjectFactory.createMaterialFloatingButton('add')
  floatingButton.setColor(ButtonColor.ORANGE)

  // 6. 下拉按钮
  const dropdownItems = [
    { text: '选项1', value: 'option1', onClick: () => console.log('选择选项1') },
    { text: '选项2', value: 'option2', onClick: () => console.log('选择选项2') },
    { text: '选项3', value: 'option3', onClick: () => console.log('选择选项3') }
  ]
  const dropdownButton = NHAIObjectFactory.createMaterialDropdownButton('下拉菜单', dropdownItems)

  // 7. 切换按钮
  const toggleButton = NHAIObjectFactory.createMaterialToggleButton('切换状态')
  toggleButton.setOnToggle((state) => console.log('切换状态:', state))

  return {
    basicButton,
    iconButton,
    textButton,
    iconTextButton,
    floatingButton,
    dropdownButton,
    toggleButton
  }
}

// ========== 输入框细分类型示例 ==========

export function createInputVariantsExample() {
  console.log('=== 输入框细分类型示例 ===')

  // 1. 文本输入框
  const textInput = NHAIObjectFactory.createMaterialTextInput()
  textInput.setLabel('用户名')
  textInput.setPlaceholder('请输入用户名')
  textInput.setRequired(true)

  // 2. 多行输入框
  const multilineInput = NHAIObjectFactory.createMaterialMultilineInput(4)
  multilineInput.setLabel('备注')
  multilineInput.setPlaceholder('请输入备注信息')

  // 3. 密码输入框
  const passwordInput = NHAIObjectFactory.createMaterialPasswordInput()
  passwordInput.setLabel('密码')
  passwordInput.setPlaceholder('请输入密码')
  passwordInput.setRequired(true)

  // 4. 数字输入框
  const numberInput = NHAIObjectFactory.createMaterialNumberInput()
  numberInput.setLabel('年龄')
  numberInput.setPlaceholder('请输入年龄')
  numberInput.setMaxLength(3)

  // 5. 搜索输入框
  const searchInput = NHAIObjectFactory.createMaterialSearchInput()
  searchInput.setLabel('搜索')
  searchInput.setPlaceholder('搜索内容...')
  searchInput.setClearable(true)

  // 6. 文件输入框
  const fileInput = NHAIObjectFactory.createMaterialFileInput()
  fileInput.setLabel('上传文件')
  fileInput.setOnFileSelect((files) => console.log('选择的文件:', files))

  // 7. 日期输入框
  const dateInput = NHAIObjectFactory.createMaterialDateInput()
  dateInput.setLabel('出生日期')
  dateInput.setPlaceholder('请选择日期')

  // 8. 邮箱输入框
  const emailInput = NHAIObjectFactory.createMaterialEmailInput()
  emailInput.setLabel('邮箱地址')
  emailInput.setPlaceholder('请输入邮箱地址')
  emailInput.setRequired(true)

  // 9. URL输入框
  const urlInput = NHAIObjectFactory.createMaterialUrlInput()
  urlInput.setLabel('网站地址')
  urlInput.setPlaceholder('请输入网站地址')

  // 10. 电话输入框
  const telInput = NHAIObjectFactory.createMaterialTelInput()
  telInput.setLabel('电话号码')
  telInput.setPlaceholder('请输入电话号码')

  return {
    textInput,
    multilineInput,
    passwordInput,
    numberInput,
    searchInput,
    fileInput,
    dateInput,
    emailInput,
    urlInput,
    telInput
  }
}

// ========== 选择框细分类型示例 ==========

export function createSelectVariantsExample() {
  console.log('=== 选择框细分类型示例 ===')

  // 1. 单选选择框
  const singleSelect = NHAIObjectFactory.createMaterialSingleSelect()
  singleSelect.setLabel('选择城市')
  singleSelect.setPlaceholder('请选择城市')
  singleSelect.setOptions([
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'guangzhou', label: '广州' },
    { value: 'shenzhen', label: '深圳' }
  ])

  // 2. 多选选择框
  const multipleSelect = NHAIObjectFactory.createMaterialMultipleSelect()
  multipleSelect.setLabel('选择技能')
  multipleSelect.setPlaceholder('请选择技能')
  multipleSelect.setOptions([
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' }
  ])

  // 3. 搜索选择框
  const searchSelect = NHAIObjectFactory.createMaterialSearchSelect()
  searchSelect.setLabel('搜索用户')
  searchSelect.setPlaceholder('搜索用户...')
  searchSelect.setSearchPlaceholder('输入用户名搜索')
  searchSelect.setOptions([
    { value: 'user1', label: '张三' },
    { value: 'user2', label: '李四' },
    { value: 'user3', label: '王五' },
    { value: 'user4', label: '赵六' }
  ])

  // 4. 级联选择框
  const cascadeSelect = NHAIObjectFactory.createMaterialCascadeSelect()
  cascadeSelect.setLabel('选择地区')
  cascadeSelect.setPlaceholder('请选择地区')
  // 这里需要设置级联数据

  // 5. 标签选择框
  const tagsSelect = NHAIObjectFactory.createMaterialTagsSelect()
  tagsSelect.setLabel('选择标签')
  tagsSelect.setPlaceholder('输入标签名称')
  tagsSelect.setMaxTags(5)
  tagsSelect.setAllowCreate(true)

  // 6. 树形选择框
  const treeSelect = NHAIObjectFactory.createMaterialTreeSelect()
  treeSelect.setLabel('选择部门')
  treeSelect.setPlaceholder('请选择部门')
  // 这里需要设置树形数据

  return {
    singleSelect,
    multipleSelect,
    searchSelect,
    cascadeSelect,
    tagsSelect,
    treeSelect
  }
}

// ========== 综合示例 ==========

export function createComprehensiveExample() {
  console.log('=== 综合示例 ===')

  // 创建一个表单，包含各种类型的组件
  const formComponents = {
    // 用户信息
    username: NHAIObjectFactory.createMaterialTextInput(),
    email: NHAIObjectFactory.createMaterialEmailInput(),
    phone: NHAIObjectFactory.createMaterialTelInput(),
    
    // 密码
    password: NHAIObjectFactory.createMaterialPasswordInput(),
    confirmPassword: NHAIObjectFactory.createMaterialPasswordInput(),
    
    // 个人信息
    age: NHAIObjectFactory.createMaterialNumberInput(),
    birthday: NHAIObjectFactory.createMaterialDateInput(),
    bio: NHAIObjectFactory.createMaterialMultilineInput(3),
    
    // 选择
    city: NHAIObjectFactory.createMaterialSingleSelect(),
    skills: NHAIObjectFactory.createMaterialMultipleSelect(),
    tags: NHAIObjectFactory.createMaterialTagsSelect(),
    
    // 文件
    avatar: NHAIObjectFactory.createMaterialFileInput(),
    
    // 按钮
    submitButton: NHAIObjectFactory.createMaterialIconTextButton('提交', 'send'),
    cancelButton: NHAIObjectFactory.createMaterialTextButton('取消'),
    resetButton: NHAIObjectFactory.createMaterialIconButton('refresh')
  }

  // 设置表单属性
  formComponents.username.setLabel('用户名').setRequired(true)
  formComponents.email.setLabel('邮箱').setRequired(true)
  formComponents.phone.setLabel('电话')
  formComponents.password.setLabel('密码').setRequired(true)
  formComponents.confirmPassword.setLabel('确认密码').setRequired(true)
  formComponents.age.setLabel('年龄').setMaxLength(3)
  formComponents.birthday.setLabel('生日')
  formComponents.bio.setLabel('个人简介')
  formComponents.city.setLabel('城市').setOptions([
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'guangzhou', label: '广州' }
  ])
  formComponents.skills.setLabel('技能').setOptions([
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'react', label: 'React' }
  ])
  formComponents.tags.setLabel('标签').setMaxTags(3)
  formComponents.avatar.setLabel('头像')

  // 设置按钮属性
  formComponents.submitButton.setColor(ButtonColor.GREEN).setSize(ButtonSize.LARGE)
  formComponents.cancelButton.setVariant('flat').setColor(ButtonColor.RED)
  formComponents.resetButton.setColor(ButtonColor.ORANGE)

  return formComponents
}

// ========== 使用示例 ==========

export function demonstrateUsage() {
  console.log('=== 组件细分类型使用演示 ===')

  // 演示按钮类型
  const buttonExamples = createButtonVariantsExample()
  console.log('按钮示例创建完成:', Object.keys(buttonExamples))

  // 演示输入框类型
  const inputExamples = createInputVariantsExample()
  console.log('输入框示例创建完成:', Object.keys(inputExamples))

  // 演示选择框类型
  const selectExamples = createSelectVariantsExample()
  console.log('选择框示例创建完成:', Object.keys(selectExamples))

  // 演示综合示例
  const formExample = createComprehensiveExample()
  console.log('表单示例创建完成:', Object.keys(formExample))

  return {
    buttons: buttonExamples,
    inputs: inputExamples,
    selects: selectExamples,
    form: formExample
  }
}
