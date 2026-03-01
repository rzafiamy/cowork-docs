import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

function htmlPartialPlugin() {
    return {
        name: 'html-partial-plugin',
        transformIndexHtml(html) {
            const partialRegex = /<!-- @partial:(.+?) -->/g;
            let currentHtml = html;
            let hasPartials = true;

            // Simple loop to handle nested partials (limit to 5 levels to avoid infinite loops)
            let depth = 0;
            while (hasPartials && depth < 5) {
                const newHtml = currentHtml.replace(partialRegex, (match, partialName) => {
                    const partialPath = resolve(__dirname, `src/partials/${partialName}.html`);
                    if (fs.existsSync(partialPath)) {
                        return fs.readFileSync(partialPath, 'utf-8');
                    }
                    return `<!-- Partial ${partialName} not found at ${partialPath} -->`;
                });

                if (newHtml === currentHtml) {
                    hasPartials = false;
                }
                currentHtml = newHtml;
                depth++;
            }
            return currentHtml;
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
                acl: resolve(__dirname, 'docs/acl.html'),
                llm: resolve(__dirname, 'docs/llm.html'),
                cron: resolve(__dirname, 'docs/cron.html'),
                jobs: resolve(__dirname, 'docs/jobs.html'),
                issues: resolve(__dirname, 'docs/issues.html'),
                trace: resolve(__dirname, 'docs/trace.html'),
                tools: resolve(__dirname, 'docs/tools.html'),
            },
        },
    },
});
