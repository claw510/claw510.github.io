import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, postUrl } from '../lib/posts';
import { SITE } from '../site';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    // context.site 来自 astro.config.mjs 的 site —— 单一来源
    site: context.site ?? 'https://claw510.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
      categories: post.data.tags,
      customData: `<author>${SITE.author}</author>`,
    })),
    customData: `<language>zh-cn</language>`,
  });
}

// 构建时生成静态 /rss.xml
export const prerender = true;
