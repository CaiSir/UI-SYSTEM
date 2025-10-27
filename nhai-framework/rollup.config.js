import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const config = [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ],
    external: ['vue', 'react', 'svelte', 'element-plus']
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ],
    external: ['vue', 'react', 'svelte', 'element-plus']
  },
  // UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'NHAI',
      sourcemap: true,
      globals: {
        vue: 'Vue',
        react: 'React',
        svelte: 'Svelte',
        'element-plus': 'ElementPlus'
      }
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ],
    external: ['vue', 'react', 'svelte', 'element-plus']
  },
  // TypeScript declarations
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm'
    },
    plugins: [dts()],
    external: ['vue', 'react', 'svelte', 'element-plus']
  }
]

export default config
