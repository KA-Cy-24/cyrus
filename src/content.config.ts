import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const linksSchema = z.object({
  github: z.string().optional(),
  publication: z.string().optional(),
  demo: z.string().optional(),
  documentation: z.string().optional(),
  launch: z.string().optional()
}).optional();

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    id: z.string().min(1),
    slug: z.string().optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().default('Uncategorised'),
    type: z.string().default('Research'),
    status: z.string().default('Ongoing'),
    year: z.number().int().optional(),
    featured: z.boolean().default(false),
    featuredOrder: z.number().int().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    links: linksSchema,
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false)
  })
});

const tools = defineCollection({
  loader: glob({ base: './src/content/tools', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    id: z.string().min(1),
    slug: z.string().optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().default('Uncategorised'),
    status: z.string().default('Active'),
    version: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    links: linksSchema,
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false)
  })
});

const notebook = defineCollection({
  loader: glob({ base: './src/content/notebook', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    id: z.string().min(1),
    slug: z.string().optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().default('Notes'),
    tags: z.array(z.string()).default([]),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    relatedProjects: z.array(z.string()).default([]),
    relatedNotes: z.array(z.string()).default([]),
    toc: z.boolean().default(true),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().default(''),
    layout: z.enum(['editorial', 'article']).default('editorial'),
    showInNavigation: z.boolean().default(false),
    navigationOrder: z.number().int().default(100),
    draft: z.boolean().default(false)
  })
});

const cv = defineCollection({
  loader: glob({ base: './src/content/cv', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    id: z.string().min(1),
    section: z.enum(['education', 'experience', 'research', 'publication', 'award', 'certification', 'skill', 'leadership']),
    title: z.string().min(1),
    organization: z.string().optional(),
    period: z.string().optional(),
    periodNote: z.string().optional(),
    languages: z.array(z.object({
      name: z.string().min(1),
      level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
      approximate: z.boolean().default(false),
      exams: z.array(z.object({
        name: z.string().min(1),
        score: z.string().min(1),
        date: z.string().optional()
      })).default([])
    })).optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    order: z.number().int().default(100),
    draft: z.boolean().default(false)
  })
});

export const collections = { projects, tools, notebook, pages, cv };
