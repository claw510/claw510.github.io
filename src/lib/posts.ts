import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 取所有已发布文章，按日期倒序（最新在前）。draft: true 的不会出现。 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 中文可读日期，例如 2026年9月16日 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).format(date);
}

/** ISO 日期，用于 <time datetime="…"> 与 RSS */
export function toISO(date: Date): string {
  return date.toISOString();
}

/** 汇总标签及计数，按名称排序 */
export function collectTags(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag, 'zh-Hans-CN'));
}

/** 标签页 URL。标签可能是中文，统一做编码，保证链接可用。 */
export function tagUrl(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}/`;
}

/** 文章页 URL */
export function postUrl(post: Post): string {
  return `/posts/${post.id}/`;
}
