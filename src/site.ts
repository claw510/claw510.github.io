/**
 * 站点文案常量（不含 URL —— URL 只在 astro.config.mjs 里定义一次）。
 * 改站名 / 简介 / 作者，改这里。
 */
export const SITE = {
  /** 站名（占位，之后可改） */
  title: '聆风的笔记',
  /** 一句话简介：用于首页、meta description、RSS */
  description: '记录思考、工具与日常的个人笔记。',
  /** 作者 */
  author: '聆风',
  /** 页面语言 */
  lang: 'zh-CN',
} as const;
