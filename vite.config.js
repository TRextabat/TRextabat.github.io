import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// package.json is type: module, so __dirname does not exist here.
const root = dirname(fileURLToPath(import.meta.url))

// Multi-page build: one HTML entry per locale. Each is prerendered separately
// so /  and /tr/ are genuinely static documents rather than one shell that
// swaps language client-side — a crawler must see the Turkish copy in the
// Turkish URL's HTML for hreflang to mean anything.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        tr: resolve(root, 'tr/index.html'),
      },
    },
  },
})
