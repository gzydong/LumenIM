import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import compressPlugin from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), 'VITE')

  return {
    base: env.VITE_BASE,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.js', '.json', 'jsx', '.vue', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己 增减
    },
    root: process.cwd(),
    assetsInclude: ['./src/assets'],
    plugins: [
      vue(),
      vueJsx({}),
      compressPlugin({
        threshold: 1024 * 1024 * 1
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'], // 你想要自动导入的库
        // 你可以在这里添加更多的配置选项
        dts: './auto-imports.d.ts'
      }),
      Components({
        dts: true, // 生成 components.d.ts 声明文件
        dirs: [], // 不扫描本地组件目录
        resolvers: [NaiveUiResolver()]
      })
    ],
    define: {
      __APP_ENV__: env.APP_ENV
    },
    build: {
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000
    }
  }
})
