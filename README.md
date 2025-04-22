# ./The_Exploit_Log Blog

A simple, terminal-themed blog focused on cybersecurity topics, built with vanilla JavaScript, Vite, and Markdown.

## Development

To run the development server:

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

This will generate the static site files in the `dist/` directory.

## Adding Content

New blog posts are added as Markdown files (`.md`) within the `/blogs` directory. Ensure each post includes the necessary front matter (title, date, author, tags, etc.).

## Technologies

-   **Frontend:** Vanilla JavaScript
-   **Build Tool:** Vite
-   **Content:** Markdown (`.md`) with YAML front matter
-   **Markdown Parsing:** `marked`
-   **YAML Parsing:** `js-yaml`
