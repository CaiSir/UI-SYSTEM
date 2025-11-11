import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import type { Plugin } from 'vite'
import { readFileSync, existsSync } from 'fs'
import { extname } from 'path'

// 插件：将 build/dev/NhaiUi 目录映射到 /nhaiui
function nhaiUiPlugin(): Plugin {
  return {
    name: 'nhai-ui-static',
    configureServer(server) {
      server.middlewares.use('/nhaiui', (req, res, next) => {
        // 移除 /nhaiui 前缀，获取实际文件名
        let fileName = req.url!.replace(/^\/nhaiui/, '').replace(/^\//, '')
        if (!fileName) {
          fileName = 'index.umd.js'
        }
        const filePath = resolve(__dirname, '../build/dev/NhaiUi', fileName)
        
        if (existsSync(filePath)) {
          try {
            const content = readFileSync(filePath)
            const ext = extname(filePath)
            const contentType = ext === '.js' ? 'application/javascript' : 
                               ext === '.css' ? 'text/css' : 'application/octet-stream'
            res.setHeader('Content-Type', contentType)
            res.setHeader('Cache-Control', 'no-cache')
            res.end(content)
            return // 重要：不要调用 next()
          } catch (error) {
            res.statusCode = 500
            res.end('Internal Server Error')
            return
          }
        } else {
          res.statusCode = 404
          res.end('File not found')
          return
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), nhaiUiPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'nhai-framework': resolve(__dirname, '../nhai-framework/src')
    }
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['..'] // 允许访问父目录
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
