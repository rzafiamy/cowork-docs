# Cowork Documentation Project

Development guide for maintaining and expanding the Cowork documentation suite.

## Architecture

The project is built with **Vite** and uses a custom **HTML Partial System** to ensure maintainability.

### Core Structure

- `/docs`: Individual documentation pages (HTML).
- `/src/partials`: Reusable HTML components (sidebar, navbar, topbar).
- `/src/docs.js`: Documentation engine (ToC generation, link highlighting, mobile menu).
- `/public/search-data.json`: Search index for the documentation.

## How to Add a New Page

1.  **Create the HTML file** in `/docs/` (e.g., `/docs/my-new-page.html`).
2.  **Use the Partial Pattern**:
    - Wrap the content in the standard layout:
    ```html
    <body class="bg-zinc-950 text-zinc-200">
        <!-- @partial:topbar -->
        <div class="flex min-h-screen">
            <!-- @partial:sidebar -->
            <main class="flex-1 lg:ml-64 relative">
                <!-- Your Content Here -->
            </main>
        </div>
        <!-- Scripts -->
        <script type="module" src="/src/docs.js"></script>
        <script type="module" src="/src/search.js"></script>
    </body>
    ```
3.  **Update Navigation**: Add the new link to `src/partials/sidebar.html`.
4.  **Register for Search**: Add an entry to `public/search-data.json`.
5.  **Update Build Config**: Add the new page to the `input` object in `vite.config.js`.

## Coding Rules & Conventions

### 1. HTML & Styling
- Use **Semantic HTML5** for structure.
- Styling is handled via **TailwindCSS** (utility-first).
- Use `glass-card` class for container elements to maintain consistent aesthetics.
- Titles and branding should use the `logo-font` class.

### 2. Partial System
- Avoid hardcoding navigation or shared UI elements.
- Use `<!-- @partial:name -->` syntax. The partial must exist in `src/partials/name.html`.

### 3. Documentation Engine (`docs.js`)
- Do not manually add `active` or `font-medium` classes to sidebar links. The engine handles this dynamically based on the current URL.
- Table of Contents (ToC) is automatically generated from `<h2>` tags within the `#content` div.

### 4. Search Keywords
- When adding to `search-data.json`, include keywords that developers are likely to use (e.g., `cli`, `config`, `uuid`).

### 5. Build Verification
- **CRITICAL**: Always run `npm run build` at the end of each task or after significant changes to ensure there are no HTML parsing errors or broken partial injections.
- If the build fails (e.g., `invalid-first-character-of-tag-name`), identify and solve the issue before committing.

## Deployment
Documentation is automatically built when running `npm run build`. Verify the `/dist` output to ensure all partials are correctly injected. Always verify the build locally before pushing changes.
