import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./src"),
        }
    },
    build: {
        sourcemap: true
    },
    server: {
        port: 3000
    }
})
