<?xml version="1.0" encoding="UTF-8"?>
<!--
  /rss.xml 的浏览器样式表。
  只影响「人用浏览器直接打开 feed」时的呈现；RSS 阅读器会忽略这条指令。
  配色沿用站点 global.css 的变量值（CSS 文件无法引入，故此处写字面量）。
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="rss/channel/title" /> · RSS 订阅源</title>
        <style><![CDATA[
          :root {
            --bg: #fcfcf9;
            --bg-subtle: #f4f5f1;
            --bg-elevated: #ffffff;
            --text: #1f2421;
            --text-muted: #616a65;
            --text-faint: #8c948f;
            --border: #e3e5df;
            --accent: #2f7d4f;
            --accent-soft: #eef5f0;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #14181a;
              --bg-subtle: #1b2023;
              --bg-elevated: #1f2528;
              --text: #e5e8e5;
              --text-muted: #a2aaa5;
              --text-faint: #7c847f;
              --border: #2b3236;
              --accent: #74c795;
              --accent-soft: #1c2b23;
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 3rem 1.25rem 5rem;
            background: var(--bg);
            color: var(--text);
            font-family: system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB",
                         "Microsoft YaHei", sans-serif;
            font-size: 17px;
            line-height: 1.8;
            -webkit-text-size-adjust: 100%;
          }
          .wrap { max-width: 44rem; margin: 0 auto; }
          .badge {
            display: inline-block;
            margin: 0 0 1rem;
            padding: 0.15rem 0.6rem;
            border-radius: 999px;
            background: var(--accent-soft);
            color: var(--accent);
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.03em;
          }
          h1 { margin: 0 0 0.4rem; font-size: 1.85rem; line-height: 1.3; }
          h1 a { color: var(--text); text-decoration: none; }
          h1 a:hover { color: var(--accent); }
          .desc { margin: 0 0 1.25rem; color: var(--text-muted); }
          .hint {
            margin: 0 0 2.5rem;
            padding: 0.9rem 1.1rem;
            border: 1px solid var(--border);
            border-radius: 10px;
            background: var(--bg-subtle);
            color: var(--text-muted);
            font-size: 0.92rem;
            line-height: 1.7;
          }
          .hint code {
            padding: 0.1em 0.4em;
            border-radius: 5px;
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            font-size: 0.88em;
            word-break: break-all;
          }
          .items { list-style: none; margin: 0; padding: 0; }
          .item {
            padding: 1.6rem 0;
            border-top: 1px solid var(--border);
          }
          .item h2 { margin: 0 0 0.45rem; font-size: 1.22rem; line-height: 1.45; }
          .item h2 a { color: var(--text); text-decoration: none; }
          .item h2 a:hover { color: var(--accent); text-decoration: underline; }
          .meta {
            margin: 0 0 0.55rem;
            color: var(--text-faint);
            font-size: 0.85rem;
          }
          .tag {
            margin-left: 0.5rem;
            padding: 0.1rem 0.5rem;
            border: 1px solid var(--border);
            border-radius: 999px;
            font-size: 0.78rem;
          }
          .summary { margin: 0; color: var(--text-muted); }
          footer {
            margin-top: 2.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
            color: var(--text-faint);
            font-size: 0.88rem;
          }
          footer a { color: var(--accent); }
        ]]></style>
      </head>
      <body>
        <main class="wrap">
          <p class="badge">RSS 订阅源</p>

          <h1>
            <a href="{rss/channel/link}"><xsl:value-of select="rss/channel/title" /></a>
          </h1>
          <p class="desc"><xsl:value-of select="rss/channel/description" /></p>

          <p class="hint">
            这是给阅读器用的订阅源，不是网页。把下面的地址粘进任意 RSS 阅读器即可订阅：<br />
            <code><xsl:value-of select="concat(rss/channel/link, 'rss.xml')" /></code><br />
            推荐 Feedly、Inoreader、NetNewsWire、Reeder、Follow。
          </p>

          <ul class="items">
            <xsl:for-each select="rss/channel/item">
              <li class="item">
                <h2>
                  <a href="{link}"><xsl:value-of select="title" /></a>
                </h2>
                <p class="meta">
                  <xsl:value-of select="pubDate" />
                  <xsl:for-each select="category">
                    <span class="tag"><xsl:value-of select="." /></span>
                  </xsl:for-each>
                </p>
                <p class="summary"><xsl:value-of select="description" /></p>
              </li>
            </xsl:for-each>
          </ul>

          <footer>
            共 <xsl:value-of select="count(rss/channel/item)" /> 篇 ·
            <a href="{rss/channel/link}">返回站点</a>
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
