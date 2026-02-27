import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                docs: resolve(__dirname, 'docs/index.html'),
                cli: resolve(__dirname, 'docs/cli.html'),
                architecture: resolve(__dirname, 'docs/architecture.html'),
                algorithms: resolve(__dirname, 'docs/algorithms.html'),
                memory: resolve(__dirname, 'docs/memory.html'),
                skills: resolve(__dirname, 'docs/skills.html'),
                config: resolve(__dirname, 'docs/config.html'),
                security: resolve(__dirname, 'docs/security.html'),
            },
        },
    },
});
