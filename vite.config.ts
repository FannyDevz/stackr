import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/main.tsx'],
            refresh: true,
        }),
        react(),
    ],
    build: {
        // The Markdown editor chunk is large but lazy-loaded, so raise the
        // advisory limit past it to keep the build output clean.
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // Split large, cache-stable vendors into their own chunks.
                // (The Markdown editor is already its own chunk via lazy import.)
                manualChunks(id: string) {
                    if (!id.includes('node_modules')) return
                    if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id))
                        return 'react-vendor'
                    if (id.includes('@tanstack')) return 'query'
                    if (id.includes('@dnd-kit')) return 'dnd'
                },
            },
        },
    },
})
