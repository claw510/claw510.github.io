import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 文章集合。
 * 文件放在 src/content/posts/*.md，文件名即 URL slug
 * （例如 hello-world.md → /posts/hello-world/）。
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    /** 文章标题 */
    title: z.string(),
    /** 摘要，用于列表页、meta description 与 RSS */
    description: z.string(),
    /** 发布日期，如 2026-09-16 */
    date: z.coerce.date(),
    /** 标签数组，缺省为空 */
    tags: z.array(z.string()).default([]),
    /** true 时不会出现在列表 / RSS / 标签页里 */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
