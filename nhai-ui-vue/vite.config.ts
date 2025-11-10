import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import type { PluginOptions } from 'vite-plugin-dts'
import type { Plugin } from 'vite'
import { existsSync, rmSync, readdirSync, statSync, unlinkSync, readFileSync } from 'fs'
import { join } from 'path'

// 清理 dyexports 目录插件
function cleanDyexportsPlugin(): Plugin {
  return {
    name: 'clean-dyexports',
    buildStart() {
      const dyexportsDir = resolve(process.cwd(), 'dyexports/nhaiui')
      if (existsSync(dyexportsDir)) {
        rmSync(dyexportsDir, { recursive: true, force: true })
      }
    },
    writeBundle() {
      // 构建完成后删除所有 .map 文件和冗余的 index.d.ts 文件
      const dyexportsDir = resolve(process.cwd(), 'dyexports/nhaiui')
      if (existsSync(dyexportsDir)) {
        const deleteFiles = (dir: string, isRoot: boolean = false) => {
          const files = readdirSync(dir)
          for (const file of files) {
            const filePath = join(dir, file)
            const stat = statSync(filePath)
            if (stat.isDirectory()) {
              deleteFiles(filePath, false)
            } else {
              // 删除 .map 文件
              if (file.endsWith('.d.ts.map')) {
                unlinkSync(filePath)
              }
              // 删除中间层的 index.d.ts 文件（保留根目录的）
              if (file === 'index.d.ts' && !isRoot) {
                unlinkSync(filePath)
              }
            }
          }
        }
        deleteFiles(dyexportsDir, true)
      }
    }
  }
}

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
    cleanDyexportsPlugin(),
    vue(),
    vueJsx(),
    umdNamespacePlugin(),
    dts({
      include: [
        'src/lib/**/*.ts',
        'src/components/**/*Command.ts',
        'src/components/**/types.ts',
        'src/components/index.ts',
        'src/index.ts',
      ],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/designer/**',
        'src/showcase/**',
        'src/main.ts'
      ],
      outDir: resolve(process.cwd(), 'dyexports/nhaiui'),
      rollupTypes: false,
      copyDtsFiles: true,
      skipDiagnostics: true,
      compilerOptions: {
        skipLibCheck: true,
      },
      beforeWriteFile: (filePath: string, content: string) => {
        let filteredContent = content
        
        // 移除所有 .vue 文件的导入语句
        filteredContent = filteredContent.replace(/import\s+.*from\s+['"]\.\/.*\.vue['"];?\s*/g, '')
        
        // 移除所有来自 'vue' 的导入（包括类型导入）
        filteredContent = filteredContent.replace(/^import\s+.*from\s+['"]vue['"];?\s*$/gm, '')
        
        // 如果是主 index.d.ts，替换中间层导入为直接导入具体文件
        if (filePath.replace(/\\/g, '/').endsWith('/dyexports/nhaiui/index.d.ts')) {
          // 移除所有中间层导入
          filteredContent = filteredContent.replace(
            /import\s+\*\s+as\s+\w+\s+from\s+['"]\.\/components[^'"]*['"];?\s*/g,
            ''
          )
          filteredContent = filteredContent.replace(
            /import\s+\*\s+as\s+\w+\s+from\s+['"]\.\/lib['"];?\s*/g,
            ''
          )
          
          // 从源文件扫描并生成组件导入
          const srcDir = resolve(process.cwd(), 'src')
          const componentImports: string[] = []
          const libImports: string[] = []
          
          // 扫描组件源文件
          const scanComponents = (dir: string, basePath: string = '') => {
            if (!existsSync(dir)) return
            const files = readdirSync(dir)
            for (const file of files) {
              const filePath = join(dir, file)
              const stat = statSync(filePath)
              if (stat.isDirectory()) {
                scanComponents(filePath, join(basePath, file))
              } else if (file.endsWith('Command.ts')) {
                try {
                  const fileContent = readFileSync(filePath, 'utf-8')
                  const classMatch = fileContent.match(/export\s+class\s+(\w+)/)
                  if (classMatch) {
                    const className = classMatch[1]
                    const importPath = `./components/${basePath.replace(/\\/g, '/')}/${file.replace(/\.ts$/, '')}`
                    if (file.includes('customButton')) {
                      componentImports.push(`import type { customButtonCommand as LightweightButtonCommand } from '${importPath}';`)
                    } else {
                      componentImports.push(`import type { ${className} } from '${importPath}';`)
                    }
                  }
                } catch (e) {
                  // 忽略读取错误
                }
              }
            }
          }
          
          // 不导入 lib 文件（用户不需要 Core 内容）
          
          // 扫描 components 源目录
          const componentsDir = join(srcDir, 'components')
          if (existsSync(componentsDir)) {
            scanComponents(componentsDir, '')
          }
          
          // 生成导入语句
          const allImports = [
            '// 自动生成的组件和库导入',
            ...componentImports.sort(),
            ...libImports.sort(),
            ''
          ].join('\n')
          
          // 替换类型定义中的命名空间引用为直接引用
          filteredContent = filteredContent.replace(/typeof\s+\w+Components\.(\w+)/g, 'typeof $1')
          filteredContent = filteredContent.replace(/typeof\s+Components\.(\w+)/g, 'typeof $1')
          filteredContent = filteredContent.replace(/typeof\s+Lib\.(\w+)/g, 'typeof $1')
          
          // 在 export interface 之前插入导入
          filteredContent = filteredContent.replace(
            /(export\s+interface\s+NHAIUIVueNamespace)/,
            allImports + '$1'
          )
          
          // 移除命名空间结构（Basic, Advanced, Components, Layout, Navigation, Container, Core），只保留平铺导出
          filteredContent = filteredContent.replace(/\s+Basic:\s*\{[^}]*\};\s*/g, '')
          filteredContent = filteredContent.replace(/\s+Advanced:\s*\{[^}]*\};\s*/g, '')
          filteredContent = filteredContent.replace(/\s+Business:\s*\{\};?\s*/g, '')
          filteredContent = filteredContent.replace(/\s+Components:\s*\{[^}]*\};\s*/g, '')
          filteredContent = filteredContent.replace(/\s+Layout:\s*\{[^}]*\};\s*/g, '')
          filteredContent = filteredContent.replace(/\s+Navigation:\s*\{[^}]*\};\s*/g, '')
          filteredContent = filteredContent.replace(/\s+Container:\s*\{[^}]*\};\s*/g, '')
          filteredContent = filteredContent.replace(/\s+Core:\s*\{[^}]*\};\s*/g, '')
          
          // 移除 BaseCommand 和 ComponentRegistry 的平铺导出（不需要 Core 内容）
          filteredContent = filteredContent.replace(/\s+BaseCommand:\s*typeof\s+BaseCommand;\s*/g, '')
          filteredContent = filteredContent.replace(/\s+ComponentRegistry:\s*typeof\s+ComponentRegistry;\s*/g, '')
          
          // 移除 export * from './components' 和 export * from './lib'（因为中间层 index.d.ts 已被删除）
          filteredContent = filteredContent.replace(/export\s+\*\s+from\s+['"]\.\/components['"];?\s*/g, '')
          filteredContent = filteredContent.replace(/export\s+\*\s+from\s+['"]\.\/lib['"];?\s*/g, '')
        }
        
        // 移除所有私有方法和私有成员变量
        filteredContent = filteredContent.replace(/^\s+private\s+(?:static\s+)?(?:readonly\s+)?\w+(?:\?)?(?::\s*[^;=]+)?;?\s*$/gm, '')
        filteredContent = filteredContent.replace(/^\s+private\s+(?:static\s+)?\w+\([^)]*\)(?::\s*[^;]+)?;?\s*$/gm, '')
        
        // 移除 source map 注释
        filteredContent = filteredContent.replace(/\/\/# sourceMappingURL=.*\.d\.ts\.map\s*/g, '')
        
        // 清理多余的空行（3个或更多连续空行替换为2个）
        filteredContent = filteredContent.replace(/\n{3,}/g, '\n\n')
        
        // 在根目录的 index.d.ts 中添加全局类型声明
        const isRootIndex = filePath.replace(/\\/g, '/').endsWith('/dyexports/nhaiui/index.d.ts')
        if (isRootIndex && filteredContent.includes('export interface NHAIUIVueNamespace')) {
          filteredContent += `

declare global {
  interface Window {
    NHAIUIVue: NHAIUIVueNamespace
  }
}`
        }
        
        return {
          filePath,
          content: filteredContent.trim()
        }
      }
    } as PluginOptions)
  ],
  build: {
    outDir: resolve(__dirname, '../build/dev/NhaiUi'),
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

