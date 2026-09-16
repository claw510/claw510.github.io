# 聆风的笔记

个人文章站（中文优先）。**Astro + TypeScript**，纯静态输出，可部署到 GitHub Pages。

自写精简布局，没有套用任何第三方主题模板 —— 代码量小、结构直白，方便随时改。

---

## 一、快速开始（本地预览）

```bash
cd ~/Documents/personal-site

# 首次：安装依赖
npm install

# 启动开发服务器（http://localhost:4321）
npm run dev
```

打开 <http://localhost:4321> 即可。

> 端口固定为 **4321**，已写在 `package.json` 的 `dev` 脚本里（`astro dev --port 4321`）。

### 其他常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 开发服务器，热更新，端口 4321 |
| `npm run build` | 构建静态站点到 `dist/` |
| `npm run preview` | 用构建产物起本地服务器（端口 4321），验证生产形态 |
| `npm run sync` | 只重新生成内容集合的类型（改 frontmatter 后可跑） |

**建议流程**：写完文章先 `npm run build` 看有没有报错，再 `npm run preview` 确认生产形态没问题，最后才推上去。

---

## 二、新建一篇文章

### 1. 创建文件

在 `src/content/posts/` 下新建一个 `.md` 文件。**文件名就是 URL**：

```
src/content/posts/my-first-post.md   →   https://你的域名/posts/my-first-post/
```

文件名建议用小写英文 + 连字符（中文文件名虽然能用，但 URL 会变成一长串百分号编码，不好看）。

### 2. 写 frontmatter

文件**开头必须是**下面这个头部（`---` 之间）：

```markdown
---
title: 文章标题
description: 一句话摘要，会出现在列表页、搜索结果和 RSS 里。
date: 2026-09-16
tags: [随笔, 写作]
draft: false
---

正文从这里开始，正常的 Markdown 写法即可。
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `title` | string | ✅ | 文章标题 |
| `description` | string | ✅ | 摘要，同时用作 `meta description` 和 RSS 简介 |
| `date` | 日期 | ✅ | 如 `2026-09-16`。列表按此日期倒序排列 |
| `tags` | 数组 | ❌ | 缺省为 `[]`。自动生成标签页 |
| `draft` | 布尔 | ❌ | 缺省 `false`。设为 `true` 则**不会**出现在列表 / RSS / 标签页，相当于草稿 |

> 字段定义在 `src/content.config.ts`，用 zod 校验。**写错字段名或类型，`npm run build` 会直接报错** —— 这是有意的，能在发布前拦住问题。

### 3. 支持的 Markdown 语法

- 标准 Markdown：标题、列表、引用、表格、链接、图片
- **代码块带语法高亮**（由 Shiki 提供，浅色/深色各一套配色）：

  ````markdown
  ```bash
  echo "hello"
  ```
  ````

- 行内代码：`` `code` ``
- 引用块：`> 引用内容`

### 4. 改站名 / 简介 / URL

- **站名、简介、作者**：改 `src/site.ts` 里的 `SITE` 对象。
- **站点 URL**：改 `astro.config.mjs` 里的 `site` 字段。

  ⚠️ URL **只在这一处定义**。页面 canonical、RSS 链接、sitemap 都从它推导，**不要**在别的地方写死域名。

---

## 三、项目结构

```text
personal-site/
├── astro.config.mjs          # ★ site URL / sitemap / 代码高亮配置
├── package.json              # ★ 脚本（dev / build / preview）
├── tsconfig.json
├── public/
│   └── favicon.svg           # 原样拷进 dist/ 的静态资源
├── src/
│   ├── site.ts               # ★ 站名 / 简介 / 作者
│   ├── content.config.ts     # ★ 文章集合的 frontmatter 校验规则（zod）
│   ├── content/posts/        # ★ 文章 Markdown 都放这里
│   ├── lib/posts.ts          # 取文章、排序、日期格式化、标签工具
│   ├── styles/global.css     # ★ 全部样式（设计变量 + 深色模式 + 中文排版）
│   ├── layouts/
│   │   └── BaseLayout.astro  # 全站 HTML 骨架、meta、主题初始化脚本
│   ├── components/
│   │   ├── Header.astro      # 页头 + 导航
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro # 深色模式按钮
│   │   └── PostCard.astro    # 列表里的单篇文章卡片
│   └── pages/
│       ├── index.astro       # 首页：简介 + 文章列表（日期倒序）
│       ├── about.astro       # 关于页
│       ├── 404.astro         # 404
│       ├── rss.xml.ts        # RSS 输出
│       ├── posts/[...slug].astro   # 文章详情页
│       └── tags/
│           ├── index.astro   # 全部标签
│           └── [tag].astro   # 单个标签下的文章
└── dist/                     # 构建产物（已被 .gitignore 忽略）
```

---

## 四、已实现的功能

- ✅ 首页文章列表，**按日期倒序**
- ✅ 文章详情页（Markdown 渲染 + 语法高亮）
- ✅ 关于页、404 页
- ✅ 标签页：`/tags/` 汇总 + `/tags/<标签>/` 单标签列表
- ✅ **RSS**：`/rss.xml`
- ✅ **Sitemap**：`/sitemap-index.xml`（构建时生成）
- ✅ **深色模式**：跟随系统 + 手动切换 + `localStorage` 记忆
- ✅ 中文排版：正文 17px / 行高 1.8 / `system-ui → PingFang SC → 微软雅黑` 字体栈
- ✅ 移动端自适应

### 深色模式的实现细节

首屏渲染前，`BaseLayout.astro` 里有一段**内联**脚本先读 `localStorage`，没有记录就跟随系统偏好，并把结果写到 `<html data-theme="…">`。这样不会出现深色模式下的白屏闪烁。

所有颜色都定义在 `global.css` 顶部的 CSS 变量里（`--bg`、`--text`、`--accent` 等），深色模式只是换一组变量值。**改配色只需要改那两段变量。**

代码块的高亮配色也跟随主题：Shiki 用双主题模式把两套颜色分别写进 `--shiki-light` / `--shiki-dark`，CSS 按 `data-theme` 取值。

---

## 五、部署到 GitHub Pages

> ⚠️ **以下步骤尚未执行**。确认无误后由你自己操作。

### 前置：确认 `site` 配置

打开 `astro.config.mjs`，确认这一行是你的真实地址：

```js
site: 'https://claw510.github.io',
```

- 用 **`<用户名>.github.io` 仓库** → 站点在根路径，保持 `https://claw510.github.io` 即可。
- 用**普通仓库**（如 `blog`）→ 站点在子路径，必须改成 `https://claw510.github.io/blog`。

  子路径情况下还需要在 `astro.config.mjs` 里加一行 `base: '/blog'`。**这一步很容易忘，忘了会导致 CSS/JS 全部 404。**

### 步骤 1：在本地初始化 Git 并首次提交

```bash
cd ~/Documents/personal-site

# 本机 brew 不可用，用自带的 git
export PATH="$HOME/.local/bin:$PATH"

git init -b main
git add .
git commit -m "chore: 初始化个人站点"
```

> `dist/` 和 `node_modules/` 已在 `.gitignore` 里，不会被提交。**构建产物由 CI 生成，不要手动提交。**

### 步骤 2：在 GitHub 上创建仓库

在 <https://github.com/new> 创建仓库，例如 `blog`。

**不要**勾选 “Add a README file / .gitignore / license” —— 保持完全空仓库，避免首次推送冲突。

### 步骤 3：关联远程并推送

```bash
git remote add origin git@github.com:claw510/blog.git   # 换成你的仓库地址
git push -u origin main
```

（用 HTTPS 的话地址形如 `https://github.com/claw510/blog.git`。）

### 步骤 4：添加自动部署 Workflow

在项目里新建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

然后：

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: 添加 GitHub Pages 自动部署"
git push
```

### 步骤 5：在仓库设置里打开 Pages

打开仓库 → **Settings** → **Pages** → 把 **Source** 设为 **GitHub Actions**。

（**不要**选 “Deploy from a branch” —— 那是给手动提交构建产物的老方式，我们用 Actions 构建。）

### 步骤 6：等第一次部署完成

回到仓库 **Actions** 标签页，等 `Deploy to GitHub Pages` 跑完（通常 1–2 分钟）。之后访问：

```text
https://claw510.github.io/blog/
```

### 之后怎么更新

只要往 `main` 推提交，CI 会自动重新构建并发布：

```bash
git add .
git commit -m "post: 新增一篇文章"
git push
```

本地改完想先确认没问题，跑 `npm run build` —— 构建失败 CI 也会失败，别推坏的东西上去。

### 部署相关注意事项

1. **`npm ci` 需要 `package-lock.json`**。本仓库已有；如果你删了它，先在本地跑一次 `npm install` 重新生成再提交。
2. **`.nojekyll`**：Astro 的输出目录里以下划线开头的目录（`_astro/`）在默认 Jekyll 处理下会被忽略。用上面的 `actions/upload-pages-artifact` 方式部署时由 Actions 处理，一般不需要。**但如果发现 CSS/JS 404**，在 `public/` 下建一个空文件 `.nojekyll` 即可解决（它会被原样拷进 `dist/`）。
3. **自定义域名**：在仓库 Settings → Pages 里填域名，并在 `public/` 放一个 `CNAME` 文件，内容为你的域名（同样会被拷进 `dist/`）。同时把 `astro.config.mjs` 的 `site` 改成新域名。
4. **404 页面**：`dist/404.html` 会被 GitHub Pages 自动用作 404 页面，无需额外配置。

---

## 六、验证记录

构建与本地运行的验证结果见提交时的验证报告。关键命令：

```bash
npm run build                      # 期望：11 page(s) built，生成 dist/
npm run dev                        # 期望：http://localhost:4321/ 就绪
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:4321/
curl -sS http://localhost:4321/rss.xml | head
```
