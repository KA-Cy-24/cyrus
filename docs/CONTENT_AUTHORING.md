# Content authoring guide

Kourosh Live is content-first. Add or edit Markdown/MDX files under `src/content/`; Astro discovers them, validates frontmatter, and generates their pages.

## Projects

Create `src/content/projects/<descriptive-filename>.md`:

```yaml
---
id: project-unique-id
title: Project title
description: One-sentence summary.
category: Computational Biology
type: Research
status: Ongoing
year: 2026
featured: false
featuredOrder: 100
tags: [Bioinformatics, Python]
cover: /images/projects/project-cover.png
coverAlt: Short description of the image.
links:
  github: https://github.com/OWNER/REPOSITORY
  publication: https://doi.org/...
  demo: https://example.org/
draft: true
---

## Overview

Write the project case study in Markdown.
```

Set `draft: false` to publish. Set `featured: true` and `featuredOrder` to show it on the homepage. The lower order appears first. Project URLs use `slug` if provided, otherwise the filename-derived collection ID.

## Tools

Create `src/content/tools/<tool-filename>.md`:

```yaml
---
id: tool-unique-id
title: Tool name
description: What the tool does.
category: Scientific software
status: Active
version: 1.0.0
tags: [Visualization, Bioinformatics]
cover: /images/tools/tool-preview.png
links:
  launch: https://example.org/
  github: https://github.com/OWNER/REPOSITORY
  documentation: https://example.org/docs/
draft: true
---

Describe the tool, its intended users, inputs, outputs, and limitations.
```

The initial Tools collection is intentionally empty. A tool is not published until `draft: false`.

## Notebook

Create Markdown or MDX under `src/content/notebook/`. Nested folders are supported and help organize the notebook. Example:

```yaml
---
id: note-unique-id
title: A research note
description: Short summary.
category: Computational biology
tags: [Methods, Protein science]
publishedAt: 2026-11-16
updatedAt: 2026-11-16
relatedProjects: []
relatedNotes: []
toc: true
draft: true
---

# Your note

Write freely using Markdown.
```

## Custom pages

Create `src/content/pages/<filename>.md`:

```yaml
---
id: page-unique-id
slug: page-url-slug
title: Page title
description: Short page description.
layout: editorial
showInNavigation: true
navigationOrder: 50
draft: true
---

Page content.
```

Pages with `showInNavigation: true` are appended to the primary navigation in `navigationOrder`. Core navigation destinations are configured in `src/data/site.json`.

## CV entries

Create one Markdown record per education, experience, research, publication, award, certification, or skill item under `src/content/cv/`:

```yaml
---
id: cv-entry-unique-id
section: education
title: Degree or qualification
organization: Institution
period: 2024–2026
location: City, Country
description: Short factual description.
url: https://example.org/
order: 10
draft: true
---
```

Valid `section` values: `education`, `experience`, `research`, `publication`, `award`, `certification`, `skill`.

## Images and files

Put public assets under `public/`. Reference them with root-relative paths, for example `/images/project-001/workflow.png`. Astro applies the configured GitHub Pages base path to root-relative Markdown image and link URLs during rendering. Prefer the `Figure` MDX component for figures and captions.

## Validation

Run `npm run check:content` before building. Duplicate IDs, duplicate explicit slugs, malformed frontmatter, missing required fields, and incomplete interactive modules will be reported before deployment.
