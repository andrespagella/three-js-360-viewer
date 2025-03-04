import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // o "0.0.0.0"
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/192.168.0.189+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/192.168.0.189+1.pem'))
    }
  }
})
