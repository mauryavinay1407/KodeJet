import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
 server:{
   proxy: {
    '/api' : {
      target:'https://kodejet-jpo6.onrender.com/',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/api/, '/api')
     }
    },
  },
  plugins: [react()],
})
