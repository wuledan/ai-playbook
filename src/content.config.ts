import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().default('AIPlaybook Editorial Team'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.string().default('/images/placeholder-cover.svg'),
    meta_description: z.string().default(''),
    rating: z.number().min(0).max(10),
    dimensions: z.object({
      'ease-of-use': z.number().min(0).max(10),
      features: z.number().min(0).max(10),
      value: z.number().min(0).max(10),
      performance: z.number().min(0).max(10),
      ecosystem: z.number().min(0).max(10),
    }),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    'best-for': z.string().default(''),
    price: z.string().default(''),
  }),
});

const tutorials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tutorials' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().default('AIPlaybook Editorial Team'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.string().default('/images/placeholder-cover.svg'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    meta_description: z.string().default(''),
  }),
});

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comparisons' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().default('AIPlaybook Editorial Team'),
    tools: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    cover: z.string().default('/images/placeholder-cover.svg'),
    meta_description: z.string().default(''),
  }),
});

const workflows = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/workflows' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().default('AIPlaybook Editorial Team'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.string().default('/images/placeholder-cover.svg'),
    meta_description: z.string().default(''),
  }),
});

export const collections = { reviews, tutorials, comparisons, workflows };
