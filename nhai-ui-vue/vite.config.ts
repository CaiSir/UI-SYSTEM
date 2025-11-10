import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import type { PluginOptions } from 'vite-plugin-dts'
import type { Plugin } from 'vite'

// UMD 构建后处理插件：让 window.NHAIUIVue 直接指向命名空间对象
function umdNamespacePlugin(): Plugin {
  return {
    name: 'umd-namespace',
    generateBundle(options, bundle) {
      // 只处理 UMD 格式
      if (options.format === 'umd') {
        const umdFile = Object.keys(bundle).find(key => key.endsWith('.umd.js'))
        if (umdFile && bundle[umdFile].type === 'chunk') {
          const chunk = bundle[umdFile] as { code: string }
          // 在文件末尾添加代码，让 window.NHAIUIVue 直接指向命名空间对象
          // 由于命名空间对象已经包含了所有平铺导出的组件，所以直接合并即可
          chunk.code += `
            // 统一导出：让 window.NHAIUIVue 直接指向命名空间对象
            // 由于命名空间对象已经包含了所有组件（包括平铺导出的），所以直接使用命名空间对象
            if (typeof window !== 'undefined' && window.NHAIUIVue) {
              // 如果存在默认导出（命名空间对象），则将其属性合并到 window.NHAIUIVue
              if (window.NHAIUIVue.default) {
                const namespace = window.NHAIUIVue.default
                // 将命名空间对象的所有属性合并到 window.NHAIUIVue（覆盖现有属性）
                Object.assign(window.NHAIUIVue, namespace)
                // 确保 window.NHAIUIVue 本身也是命名空间对象（用于命名空间访问方式）
                // 这样 window.NHAIUIVue.Components.Button 和 window.NHAIUIVue.NhaiButtonCommand 都可以使用
              } else if (window.NHAIUIVue.NHAIUIVue) {
                // 如果存在命名导出 NHAIUIVue，则合并它
                const namespace = window.NHAIUIVue.NHAIUIVue
                Object.assign(window.NHAIUIVue, namespace)
              }
            }`
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    umdNamespacePlugin(),
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      outputDir: 'dist',
      rollupTypes: true,
      skipDiagnostics: true, // 跳过类型诊断，避免 TS4023 错误（Vue 组件类型无法在声明文件中命名）
      compilerOptions: {
        skipLibCheck: true,
      },
      beforeWriteFile: (filePath: string, content: string) => {
        let filteredContent = content
        
        // 移除所有 .vue 文件的导入语句
        filteredContent = filteredContent.replace(/import\s+.*from\s+['"]\.\/.*\.vue['"];?\s*/g, '')
        
        // 移除所有来自 'vue' 的导入（包括类型导入）
        filteredContent = filteredContent.replace(/^import\s+.*from\s+['"]vue['"];?\s*$/gm, '')
        
        // 先收集所有被声明的 Vue 组件名称（在移除声明之前）
        const vueComponentNames = new Set<string>()
        const declareMatches = Array.from(filteredContent.matchAll(/^declare\s+const\s+(\w+):\s*import\('vue'\)\.DefineComponent<[^>]*>;?\s*$/gm))
        for (const match of declareMatches) {
          vueComponentNames.add(match[1])
        }
        
        // 移除所有包含 import('vue').DefineComponent 的 declare const 声明（不依赖组件名称）
        filteredContent = filteredContent.replace(/^declare\s+const\s+\w+:\s*import\('vue'\)\.DefineComponent<[^>]*>;?\s*$/gm, '')
        
        // 移除包含 Vue 组件名称的 export 语句（单个导出）
        if (vueComponentNames.size > 0) {
          const vueNamesArray = Array.from(vueComponentNames)
          // 转义特殊字符，防止正则表达式错误
          const escapedNames = vueNamesArray.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          // 匹配 export { VueXXX } 或 export { Widget } 这样的单行导出
          const exportPattern = new RegExp(`^export\\s+\\{\\s*(${escapedNames.join('|')})\\s*\\}\\s*$`, 'gm')
          filteredContent = filteredContent.replace(exportPattern, '')
        }
        
        // 移除 NHAIUIVue 对象中的 Vue 属性（通过匹配对象字面量中的 Vue 属性）
        filteredContent = filteredContent.replace(/Vue:\s*\{[^}]*\},?\s*/g, '')
        
        // 移除所有私有方法和私有成员变量
        // 匹配 private 成员（包括 static、readonly 等修饰符）
        // 格式：private [static] [readonly] propertyName[?]: type;
        // 或：private [static] methodName(...): returnType;
        filteredContent = filteredContent.replace(/^\s+private\s+(?:static\s+)?(?:readonly\s+)?\w+(?:\?)?(?::\s*[^;=]+)?;?\s*$/gm, '')
        // 匹配 private 方法（包括 static）
        filteredContent = filteredContent.replace(/^\s+private\s+(?:static\s+)?\w+\([^)]*\)(?::\s*[^;]+)?;?\s*$/gm, '')
        
        // 清理多余的空行（3个或更多连续空行替换为2个）
        filteredContent = filteredContent.replace(/\n{3,}/g, '\n\n')
        
        return {
          filePath,
          content: filteredContent.trim()
        }
      }
    } as PluginOptions)
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NHAIUIVue',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.es.js'
        if (format === 'cjs') return 'index.cjs.js'
        if (format === 'umd') return 'index.umd.js'
        return `index.${format}.js`
      }
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'index.css'
          }
          return assetInfo.name || 'asset'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})

