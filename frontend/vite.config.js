import { defineConfig } from 'vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
    esbuild: {
    jsx: 'automatic',
  },
    server: {
        host: '127.0.0.1', // важно для Windows
        port: 5173,
  },
    build: {
      outDir: path.resolve(__dirname, "../backend/static/react"),
      emptyOutDir: true,
      rollupOptions: {
          input: "src/main.jsx",
          output: {
              entryFileNames : "main.js",
          },
      },
  },

})
