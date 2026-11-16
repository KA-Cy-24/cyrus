import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeBasePath from './src/plugins-rehype-base-path.mjs';

const repository = process.env.GITHUB_REPOSITORY?.split('/') ?? [];
const owner = repository[0];
const repo = repository[1];
const isUserOrOrgSite = Boolean(owner && repo === `${owner}.github.io`);
const inferredBase = repo && !isUserOrOrgSite ? `/${repo}` : '';

export default defineConfig({
  site: process.env.SITE_URL || (owner ? `https://${owner}.github.io` : 'https://example.github.io'),
  base: process.env.PUBLIC_BASE_PATH ?? inferredBase,
  output: 'static',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, [rehypeBasePath, { base: process.env.PUBLIC_BASE_PATH ?? inferredBase }]],
    shikiConfig: {
      theme: 'github-light',
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true
    }
  }
});