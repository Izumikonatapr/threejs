import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  // 别名 在引用资源时，可以用‘@/资源路径’直接访问
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      '@views': path.resolve('src/views'),
      '@components': path.resolve('src/components'),
      '@style': path.resolve('src/style'),
      '@store': path.resolve('src/store'),
      '@router': path.resolve('src/router'),
      '@hooks': path.resolve('src/hooks'),
      '@utils': path.resolve('src/utils'),
      '@api': path.resolve('src/api'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    // 写拓展名会报错 那就配置可以省略拓展名
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@style/style.scss';`,
      },
    },
  },
  build: {
    //打包 代码块大小警告阈值
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        //将依赖从index.js中分离打包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  plugins: [
    vue(),
    viteCompression()
  ],
  server: {
    host: '0.0.0.0',
    port: 8081,
    https: false,
  },

  define: {
    'process.env': {}
  }
}
)

