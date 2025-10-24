/**
 * Materialize CSS 导入方案
 * 可选：使用 npm 导入替代自定义 CSS 文件
 */

// 方案 1: 直接导入（推荐用于纯 CSS 项目）
// import 'materialize-css/dist/css/materialize.min.css'

// 方案 2: 按需导入（推荐用于现代项目）
// import 'materialize-css/sass/materialize.scss'

// 方案 3: CDN 导入（推荐用于快速原型）
/*
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
*/

// 方案 4: 自定义构建（推荐用于生产环境）
// 使用 webpack/rollup 等工具按需打包

export const MATERIALIZE_CSS_OPTIONS = {
  // CDN 方案
  cdn: {
    css: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    js: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js'
  },
  
  // npm 方案
  npm: {
    package: 'materialize-css',
    css: 'materialize-css/dist/css/materialize.min.css',
    sass: 'materialize-css/sass/materialize.scss'
  },
  
  // 自定义方案（当前）
  custom: {
    css: './src/components/materialComponents/materialize.css'
  }
}

/**
 * 初始化 Materialize CSS
 * 根据环境选择不同的导入方式
 */
export function initMaterializeCSS(option: 'cdn' | 'npm' | 'custom' = 'custom') {
  switch (option) {
    case 'cdn':
      // 动态加载 CDN
      if (typeof document !== 'undefined') {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = MATERIALIZE_CSS_OPTIONS.cdn.css
        document.head.appendChild(link)
        
        const script = document.createElement('script')
        script.src = MATERIALIZE_CSS_OPTIONS.cdn.js
        document.head.appendChild(script)
      }
      break
      
    case 'npm':
      // 需要先安装: npm install materialize-css
      try {
        require('materialize-css/dist/css/materialize.min.css')
      } catch (error) {
        console.warn('Materialize CSS not installed. Please run: npm install materialize-css')
      }
      break
      
    case 'custom':
    default:
      // 使用我们的自定义 CSS 文件
      console.log('Using custom Materialize CSS implementation')
      break
  }
}
