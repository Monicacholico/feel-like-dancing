import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/stories',
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'es']),
    storyId: z.string(),
    slug: z.string(),
    publishedDate: z.string(),
    modifiedDate: z.string().optional(),
    readingTime: z.number().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { stories };
