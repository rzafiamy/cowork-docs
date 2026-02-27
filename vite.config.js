import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

function htmlPartialPlugin() {
    return {
        name: 'html-partial-plugin',
        transformIndexHtml(html) {
            const partialRegex = /<!-- @partial:(.+?) -->/g;
            return html.replace(partialRegex, (match, partialName) => {
                const partialPath = resolve(__dirname, `src/partials/${partialName}.html`);
                if (fs.existsSync(partialPath)) {
                    return fs.readFileSync(partialPath, 'utf-8');
                }
                return `<!-- Partial ${partialName} not found at ${partialPath} -->`;
            });
        }
    };
}

export default defineConfig({
    plugins: [htmlPartialPlugin()],
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
                fileSystem: resolve(__dirname, 'docs/file-system.html'),
            },
        },
    },
});
