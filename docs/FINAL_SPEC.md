# Kourosh Live v2.0 — implementation baseline

## Identity and visual design

- Scientific editorial identity; intellectually curious and professional, not a conventional academic CV.
- Graphite/black/white/grey foundation.
- Section accents: Home navy blue; Projects signal yellow/gold; Tools dark red; Notebook electric blue; CV.live teal.
- Very light grey/white default background; optional dark graphite theme.
- Garamond headings, Century body, Consolas project/tool names and technical metadata, with compatible fallbacks.
- Minimal horizontal navigation.
- Homepage split hero with original protein tertiary-structure ink-line illustration: alpha-helix-like coils, loops, beta-sheet-like zigzags; no ribbon/cartoon representation.
- Minimal interface; meaningful scientific illustrations over decorative animations.

## Primary routes

- `/` Home
- `/projects/` Projects archive and project case studies
- `/tools/` Tools directory (initially empty)
- `/notebook/` Notebook index and nested Markdown/MDX entries
- `/cv/` Structured CV and print-to-PDF
- `/about/` Personal introduction placeholder
- Additional pages generated from Markdown frontmatter.

## Architecture

- Astro static output.
- Astro content collections using `glob()` loaders and Zod schemas.
- Markdown and MDX content.
- Reusable MDX components: `Interactive`, `Figure`, `Callout`.
- Interactive modules auto-discovered through `import.meta.glob()`; each module has `manifest.json` and `client.ts` exporting `mount(container, props)`.
- Mermaid client-side rendering, KaTeX math, Shiki syntax highlighting, Pagefind search.
- Static build and GitHub Actions deployment to GitHub Pages.
- No backend.

## Registration

- Project/tool/notebook/CV records require unique frontmatter IDs.
- Pages require ID and slug.
- Draft records are excluded from the published site.
- Featured projects use `featured: true` and `featuredOrder`; no hardcoded featured-ID list.
- Custom pages with `showInNavigation: true` are appended to navigation by `navigationOrder`.
- Add a new interactive module by creating its folder and manifest; no central registry edits.

## Initial content state

- Projects: empty.
- Tools: empty.
- Notebook: empty.
- CV: empty until accurate user-provided details are added.
- About: placeholder only.

## Deployment

- `npm install`, `npm run dev`, `npm run build`, `npm run preview`.
- GitHub Actions uses the repository metadata to infer the project-site base path.
- GitHub Pages source set to GitHub Actions.
