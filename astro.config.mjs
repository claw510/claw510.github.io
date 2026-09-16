// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // ★ 全站唯一 URL 来源。以后换自定义域名，只改这一行。
  //   页面 meta / canonical / RSS / sitemap 都从 Astro.site 读取，不写死。
  site: 'https://claw510.github.io',

  integrations: [sitemap()],

  markdown: {
    shikiConfig: {
      // 双主题：代码块 spans 上只输出 CSS 变量（--shiki-light / --shiki-dark），
      // 实际颜色交由 global.css 按 <html data-theme> 切换。
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: true,
    },
  },
});
