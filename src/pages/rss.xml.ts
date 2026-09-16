import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, postUrl } from '../lib/posts';
import { SITE } from '../site';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  const response = await rss({
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

  // 在 XML 声明后插入样式表指令：浏览器直接打开 /rss.xml 时会渲染成正常网页，
  // 而 RSS 阅读器会忽略这条指令，订阅行为不受影响。
  // 路径用相对写法，将来换域名或挪到子路径也不用改。
  const xml = await response.text();
  const withStylesheet = xml.replace(
    /^(\s*<\?xml[^>]*\?>)/,
    '$1<?xml-stylesheet href="rss.xsl" type="text/xsl"?>',
  );

  return new Response(withStylesheet, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

// 构建时生成静态 /rss.xml
export const prerender = true;
