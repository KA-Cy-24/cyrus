# Kourosh Live v2.0

A scientific editorial portfolio and Markdown-first personal knowledge website, built with Astro, Markdown/MDX, and GitHub Pages.

## Quick start

Requirements: Node.js 22.12+ (Node 24 recommended) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Astro (normally `http://localhost:4321`).

## Build and validate

```bash
npm run check:content
npm run check
npm run build
npm run preview
```

`npm run build` validates Markdown frontmatter and interactive modules, runs Astro type/content checks, generates the static site, and creates the Pagefind search index.

## Content-first editing

- Projects: `src/content/projects/`
- Tools: `src/content/tools/` (intentionally empty initially)
- Notebook: `src/content/notebook/`
- Custom pages: `src/content/pages/`
- CV entries: `src/content/cv/`

Create a Markdown or MDX file with the required frontmatter. Set `draft: false` to publish it. No HTML route or JavaScript registration edits are required for new records. Read [docs/CONTENT_AUTHORING.md](docs/CONTENT_AUTHORING.md).

## Interactive modules

Add `src/interactive/<module-id>/manifest.json` and `client.ts`, then embed it in MDX with `<Interactive id="module-id" />`. There is no central module registry to edit. See [docs/INTERACTIVE_MODULES.md](docs/INTERACTIVE_MODULES.md).

## GitHub Pages

The GitHub Actions workflow builds and deploys the static site. In repository Settings → Pages, choose **GitHub Actions** as the source.

The Astro config infers the owner, site URL, and project-repository base path from `GITHUB_REPOSITORY` in Actions. For a local production build, you can override these values:

```bash
SITE_URL=https://YOUR-USERNAME.github.io PUBLIC_BASE_PATH=/YOUR-REPOSITORY npm run build
```

For a user/organization site repository named `USERNAME.github.io`, leave `PUBLIC_BASE_PATH` empty. For a project site, it should be `/repository-name`. For a custom domain, add `SITE_URL` and `PUBLIC_BASE_PATH: ''` to the build step environment in `.github/workflows/deploy.yml`, and add a `public/CNAME` file containing the domain. Configure DNS with your domain provider.

## Design system

The visual system uses graphite, near-white, and grey foundations with section-specific accents: navy for Home, gold for Projects, dark red for Tools, electric blue for Notebook, and teal for CV.live. The heading/body/technical font preferences are Garamond, Century, and Consolas, with system fallbacks. The homepage protein illustration is an original SVG wire-trace drawing, not a ribbon representation.

## Notes

- The initial Projects and Tools collections are empty by design.
- The CV collection is empty until verified information is supplied.
- The About page is a clean placeholder.
- The site is static; it has no backend or runtime database.
- `pagefind` is generated during production build. Search may not be available in the development server until a production build has been created.
- Do not publish confidential research, unpublished data, or private credentials in the public repository.

## Static visual preview

Open `preview/index.html` directly in a browser to inspect a visual-only snapshot of the homepage layout without installing dependencies. The preview is not the production application; use Astro's development server for the content-driven website.

### Areas of exploration

Edit `src/data/exploration.json` to change the eyebrow, title, description, and ordered list of links. Each item takes a `title` and an `href` (a site-root path such as `/tools/` or an absolute HTTPS URL). Site-root links automatically get the GitHub Pages base path. Use an empty `items` array to hide the section. The homepage uses `public/illustrations/protein-folding.svg` unchanged.
