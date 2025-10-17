/**
 * API 动态组件使用示例
 * 展示如何通过 API 配置动态创建和更新组件
 */

import { NHAIDynamicComponents } from '../components/DynamicComponents'

// 1. API 配置示例
export const APIConfigExamples = {
  
  // 基础组件配置
  basicButton: {
    type: 'button',
    props: {
      className: 'api-button',
      style: { padding: '8px 16px', backgroundColor: '#007bff', color: 'white' },
      onClick: () => alert('API 按钮被点击')
    },
    children: ['API 按钮']
  },
  
  // 复杂表单配置
  complexForm: {
    type: 'form',
    props: { className: 'api-form' },
    children: [
      {
        type: 'div',
        props: { className: 'form-group' },
        children: [
          {
            type: 'label',
            props: { htmlFor: 'username' },
            children: ['用户名']
          },
          {
            type: 'input',
            props: {
              type: 'text',
              id: 'username',
              name: 'username',
              placeholder: '请输入用户名'
            }
          }
        ]
      },
      {
        type: 'div',
        props: { className: 'form-group' },
        children: [
          {
            type: 'label',
            props: { htmlFor: 'email' },
            children: ['邮箱']
          },
          {
            type: 'input',
            props: {
              type: 'email',
              id: 'email',
              name: 'email',
              placeholder: '请输入邮箱'
            }
          }
        ]
      },
      {
        type: 'button',
        props: {
          type: 'submit',
          style: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white' }
        },
        children: ['提交']
      }
    ]
  },
  
  // 卡片列表配置
  cardList: {
    type: 'div',
    props: { className: 'card-list' },
    children: [
      {
        type: 'div',
        props: { className: 'card', style: { border: '1px solid #ddd', padding: '15px', margin: '10px' } },
        children: [
          {
            type: 'h3',
            children: ['卡片标题 1']
          },
          {
            type: 'p',
            children: ['这是第一个卡片的内容']
          },
          {
            type: 'button',
            props: { onClick: () => alert('卡片 1 被点击') },
            children: ['查看详情']
          }
        ]
      },
      {
        type: 'div',
        props: { className: 'card', style: { border: '1px solid #ddd', padding: '15px', margin: '10px' } },
        children: [
          {
            type: 'h3',
            children: ['卡片标题 2']
          },
          {
            type: 'p',
            children: ['这是第二个卡片的内容']
          },
          {
            type: 'button',
            props: { onClick: () => alert('卡片 2 被点击') },
            children: ['查看详情']
          }
        ]
      }
    ]
  }
}

// 2. 动态组件管理器
export class APIDynamicComponentManager {
  private container: any
  
  constructor() {
    this.container = new NHAIDynamicComponents.Container()
  }
  
  // 从 API 加载组件配置
  async loadFromAPI(apiUrl: string): Promise<void> {
    try {
      const response = await fetch(apiUrl)
      const config = await response.json()
      
      // 清空现有组件
      this.container.clearDynamicComponents()
      
      // 根据配置创建组件
      if (Array.isArray(config)) {
        config.forEach((item, index) => {
          this.container.addDynamicComponent(
            item.type,
            item.props,
            item.key || `api-component-${index}`
          )
        })
      } else {
        this.container.addDynamicComponent(
          config.type,
          config.props,
          config.key || 'api-component'
        )
      }
    } catch (error) {
      console.error('Failed to load components from API:', error)
    }
  }
  
  // 动态更新组件
  updateComponent(key: string, newProps: any): void {
    this.container.updateDynamicComponent(key, newProps)
  }
  
  // 添加新组件
  addComponent(type: string, props: any, key?: string): void {
    this.container.addDynamicComponent(type, props, key)
  }
  
  // 移除组件
  removeComponent(key: string): void {
    this.container.removeDynamicComponent(key)
  }
  
  // 获取容器
  getContainer(): any {
    return this.container
  }
  
  // 渲染所有组件
  render(): any {
    return this.container.render()
  }
}

// 3. 实时数据绑定示例
export class RealTimeDataBinding {
  private manager: APIDynamicComponentManager
  private data: any = {}
  
  constructor() {
    this.manager = new APIDynamicComponentManager()
    this.setupDataBinding()
  }
  
  // 设置数据绑定
  private setupDataBinding(): void {
    // 模拟实时数据更新
    setInterval(() => {
      this.updateData()
    }, 2000)
  }
  
  // 更新数据
  private updateData(): void {
    this.data = {
      timestamp: new Date().toLocaleTimeString(),
      counter: (this.data.counter || 0) + 1,
      randomValue: Math.floor(Math.random() * 100)
    }
    
    // 更新显示数据的组件
    this.updateDataDisplayComponents()
  }
  
  // 更新数据显示组件
  private updateDataDisplayComponents(): void {
    // 更新时间戳
    this.manager.updateComponent('timestamp', {
      children: `当前时间: ${this.data.timestamp}`
    })
    
    // 更新计数器
    this.manager.updateComponent('counter', {
      children: `计数: ${this.data.counter}`
    })
    
    // 更新随机值
    this.manager.updateComponent('random-value', {
      children: `随机值: ${this.data.randomValue}`
    })
  }
  
  // 初始化实时数据组件
  initializeRealTimeComponents(): void {
    // 添加时间戳组件
    this.manager.addComponent('div', {
      style: { padding: '10px', backgroundColor: '#f8f9fa', margin: '5px' },
      children: `当前时间: ${this.data.timestamp || '加载中...'}`
    }, 'timestamp')
    
    // 添加计数器组件
    this.manager.addComponent('div', {
      style: { padding: '10px', backgroundColor: '#e9ecef', margin: '5px' },
      children: `计数: ${this.data.counter || 0}`
    }, 'counter')
    
    // 添加随机值组件
    this.manager.addComponent('div', {
      style: { padding: '10px', backgroundColor: '#dee2e6', margin: '5px' },
      children: `随机值: ${this.data.randomValue || 0}`
    }, 'random-value')
  }
  
  // 获取管理器
  getManager(): APIDynamicComponentManager {
    return this.manager
  }
}

// 4. 条件渲染示例
export class ConditionalRenderingExample {
  private manager: APIDynamicComponentManager
  private userRole: string = 'guest'
  
  constructor() {
    this.manager = new APIDynamicComponentManager()
    this.setupConditionalComponents()
  }
  
  // 设置条件组件
  private setupConditionalComponents(): void {
    // 根据用户角色显示不同组件
    this.updateComponentsByRole()
  }
  
  // 根据角色更新组件
  private updateComponentsByRole(): void {
    // 清空现有组件
    this.manager.getContainer().clearDynamicComponents()
    
    // 基础组件（所有用户都可见）
    this.manager.addComponent('div', {
      style: { padding: '10px', backgroundColor: '#f8f9fa' },
      children: '欢迎使用系统'
    }, 'welcome')
    
    // 根据角色添加特定组件
    if (this.userRole === 'admin') {
      this.addAdminComponents()
    } else if (this.userRole === 'user') {
      this.addUserComponents()
    } else {
      this.addGuestComponents()
    }
  }
  
  // 添加管理员组件
  private addAdminComponents(): void {
    this.manager.addComponent('div', {
      style: { padding: '10px', backgroundColor: '#d4edda' },
      children: '管理员面板'
    }, 'admin-panel')
    
    this.manager.addComponent('button', {
      style: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white' },
      onClick: () => alert('删除用户'),
      children: '删除用户'
    }, 'delete-user')
  }
  
  // 添加用户组件
  private addUserComponents(): void {
    this.manager.addComponent('div', {
      style: { padding: '10px', backgroundColor: '#d1ecf1' },
      children: '用户面板'
    }, 'user-panel')
    
    this.manager.addComponent('button', {
      style: { padding: '8px 16px', backgroundColor: '#007bff', color: 'white' },
      onClick: () => alert('编辑资料'),
      children: '编辑资料'
    }, 'edit-profile')
  }
  
  // 添加访客组件
  private addGuestComponents(): void {
    this.manager.addComponent('div', {
      style: { padding: '10px', backgroundColor: '#fff3cd' },
      children: '访客模式'
    }, 'guest-panel')
    
    this.manager.addComponent('button', {
      style: { padding: '8px 16px', backgroundColor: '#28a745', color: 'white' },
      onClick: () => alert('登录'),
      children: '登录'
    }, 'login')
  }
  
  // 切换用户角色
  switchRole(newRole: string): void {
    this.userRole = newRole
    this.updateComponentsByRole()
  }
  
  // 获取管理器
  getManager(): APIDynamicComponentManager {
    return this.manager
  }
}

// 5. 组件模板示例
export class ComponentTemplateExamples {
  private template: any
  
  constructor() {
    this.template = new NHAIDynamicComponents.Template()
    this.registerTemplates()
  }
  
  // 注册模板
  private registerTemplates(): void {
    // 用户卡片模板
    this.template.registerTemplate('userCard', {
      type: 'div',
      props: { 
        className: 'user-card',
        style: { 
          border: '1px solid #ddd', 
          padding: '15px', 
          margin: '10px',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }
      },
      children: [
        {
          type: 'div',
          props: { style: { display: 'flex', alignItems: 'center' } },
          children: [
            {
              type: 'img',
              props: { 
                src: '{{avatar}}',
                style: { width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }
              }
            },
            {
              type: 'div',
              children: [
                {
                  type: 'h3',
                  props: { style: { margin: '0 0 5px 0' } },
                  children: ['{{name}}']
                },
                {
                  type: 'p',
                  props: { style: { margin: '0', color: '#666' } },
                  children: ['{{email}}']
                }
              ]
            }
          ]
        },
        {
          type: 'div',
          props: { style: { marginTop: '15px' } },
          children: [
            {
              type: 'button',
              props: { 
                style: { 
                  padding: '8px 16px', 
                  backgroundColor: '#007bff', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px'
                },
                onClick: '{{onEdit}}'
              },
              children: ['编辑']
            },
            {
              type: 'button',
              props: { 
                style: { 
                  padding: '8px 16px', 
                  backgroundColor: '#dc3545', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                },
                onClick: '{{onDelete}}'
              },
              children: ['删除']
            }
          ]
        }
      ]
    })
    
    // 产品卡片模板
    this.template.registerTemplate('productCard', {
      type: 'div',
      props: { 
        className: 'product-card',
        style: { 
          border: '1px solid #ddd', 
          padding: '15px', 
          margin: '10px',
          borderRadius: '8px',
          backgroundColor: '#fff',
          textAlign: 'center'
        }
      },
      children: [
        {
          type: 'img',
          props: { 
            src: '{{image}}',
            style: { width: '100%', height: '200px', objectFit: 'cover', marginBottom: '15px' }
          }
        },
        {
          type: 'h3',
          props: { style: { margin: '0 0 10px 0' } },
          children: ['{{title}}']
        },
        {
          type: 'p',
          props: { style: { margin: '0 0 15px 0', color: '#666' } },
          children: ['{{description}}']
        },
        {
          type: 'div',
          props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          children: [
            {
              type: 'span',
              props: { style: { fontSize: '18px', fontWeight: 'bold', color: '#28a745' } },
              children: ['¥{{price}}']
            },
            {
              type: 'button',
              props: { 
                style: { 
                  padding: '8px 16px', 
                  backgroundColor: '#28a745', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                },
                onClick: '{{onAddToCart}}'
              },
              children: ['加入购物车']
            }
          ]
        }
      ]
    })
  }
  
  // 创建用户卡片
  createUserCard(userData: any): any {
    return this.template.createFromTemplate('userCard', {
      ...userData,
      onEdit: () => alert(`编辑用户: ${userData.name}`),
      onDelete: () => alert(`删除用户: ${userData.name}`)
    })
  }
  
  // 创建产品卡片
  createProductCard(productData: any): any {
    return this.template.createFromTemplate('productCard', {
      ...productData,
      onAddToCart: () => alert(`添加 ${productData.title} 到购物车`)
    })
  }
}

// 6. 使用示例
export const DynamicComponentUsageExamples = {
  
  // 示例 1: 基础 API 组件
  basicAPIExample: () => {
    const manager = new APIDynamicComponentManager()
    
    // 添加基础组件
    manager.addComponent('div', {
      style: { padding: '20px', backgroundColor: '#f8f9fa' },
      children: '这是一个通过 API 创建的组件'
    }, 'api-component')
    
    return manager.render()
  },
  
  // 示例 2: 实时数据更新
  realTimeDataExample: () => {
    const realTime = new RealTimeDataBinding()
    realTime.initializeRealTimeComponents()
    return realTime.getManager().render()
  },
  
  // 示例 3: 条件渲染
  conditionalRenderingExample: () => {
    const conditional = new ConditionalRenderingExample()
    return conditional.getManager().render()
  },
  
  // 示例 4: 模板系统
  templateExample: () => {
    const templates = new ComponentTemplateExamples()
    
    // 创建用户卡片
    const userCard = templates.createUserCard({
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://via.placeholder.com/50'
    })
    
    // 创建产品卡片
    const productCard = templates.createProductCard({
      title: 'iPhone 15',
      description: '最新款 iPhone',
      price: '5999',
      image: 'https://via.placeholder.com/300x200'
    })
    
    return { userCard, productCard }
  }
}
