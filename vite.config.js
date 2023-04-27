import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import compressPlugin from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), 'VITE')

  return {
    base: env.VITE_BASE,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 路径别名
      },
      extensions: ['.js', '.json', 'jsx', 'vue'], // 使用路径别名时想要省略的后缀名，可以自己 增减
    },
    root: process.cwd(),
    assetsInclude: ['./src/assets'],
    plugins: [vue(), vueJsx({}), compressPlugin()],
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  }
})
