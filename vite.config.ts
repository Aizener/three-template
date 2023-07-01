import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/rotate-person/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'skip-glb',
          load(id) {
            if (id.endsWith('.glb')) {
              return '';
            }
          },
        },
      ],
    },
  },
  plugins: [vue()],
})
