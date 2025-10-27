/**
 * Vue Components 预加载器
 * 避免每个组件重复加载 Element Plus
 */

let cachedButton: any = null
let loadPromise: Promise<void> | null = null

/**
 * 预加载 Element Plus Button 组件
 */
export async function loadElementPlusButton(): Promise<any> {
  // 如果已经加载，直接返回
  if (cachedButton) {
    return cachedButton
  }
  
  // 如果正在加载，等待加载完成
  if (loadPromise) {
    await loadPromise
    return cachedButton
  }
  
  // 开始加载
  loadPromise = import('element-plus/es/components/button/index.mjs')
    .then((module) => {
      cachedButton = module.default || module.ElButton
      if (!cachedButton) {
        throw new Error('Failed to load Element Plus Button')
      }
    })
    .catch((error) => {
      loadPromise = null // 失败后清除状态，允许重试
      throw error
    })
  
  await loadPromise
  return cachedButton
}

/**
 * 清除缓存（用于测试或重新加载）
 */
export function clearElementPlusCache(): void {
  cachedButton = null
  loadPromise = null
}

