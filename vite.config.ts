import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/third-person-naruto/',
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'skip-model',
          load(id) {
            if (id.endsWith('.glb') || id.endsWith('.gltf')) {
              return '';
            }
          },
        },
      ],
    },
  },
  plugins: [vue()],
})
