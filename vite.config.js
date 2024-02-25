import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macrosPlugin from "vite-plugin-babel-macros"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), macrosPlugin()],
  resolve: {
    mainFields: [],
    
  }, build: {
    outDir: 'my-custom-output-directory'
  },rollupOptions: {
    output: {
      sourcemapExcludeSources: true,
      globals: {
        react: 'React',
        'react-phone-number-input': 'PhoneNumberInput',
      }
  }
},
  
})
