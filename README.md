# Particlex

> [!NOTE]
> 🎉🎉 已支持 [mdx](https://www.mdxjs.cn/docs/using-mdx/) 🎉🎉
> 
> 同时支持在 mdx 中直接使用 [tailwindcss](https://www.tailwindcss.cn/)
>
> 无需任何配置更变，只需将你的博客文件后缀改为 `.mdx` 即可自动使用相关解析器。 Example: [markdown.test.mdx](https://github.com/nextjs-particlex-theme/particlex/blob/master/__tests__/api/markdown-parser/markdown.test.mdx?plain=1).



基于 Next.js SSG 构建模式的博客主题框架。能够为任意一套基于 Markdown 文件为基础的博客系统生成博客静态文件。

对整个博客文件系统几乎**无侵入**，无需修改现有任何文件来适配，支持从 Hexo 博客快速迁移。

- [项目前身](https://github.com/IceOfSummer/hexo-theme-particlex)
- [项目演示](https://nextjs-particlex-theme.github.io/)
- [快速开始](https://nextjs-particlex-theme.github.io/quick-start)
- [Github Pages 部署教程](https://nextjs-particlex-theme.github.io/github-pages)

由于 Markdown 拥有丰富的功能，可能部分标签没有进行充分测试，如果您发现了 BUG，欢迎反馈 Issue 以帮助我们修改。

## 部署教程

首先克隆本项目，创建 `.env.local` 文件，提供以下配置：

```env
BLOG_PATH=D:\Blog\nextjs-particlex-theme.github.io
BLOG_HOME_POST_DIRECTORY=source/_posts
BLOG_RESOURCE_DIRECTORY=source/images
BLOG_POST_DIRECTORY=source
```

`BLOG_PATH` 为你博客的根目录。另外三个参数可以参考：[从任意 Markdown 博客迁移](https://nextjs-particlex-theme.github.io/quick-start#%E4%BB%8E%E4%BB%BB%E6%84%8F-markdown-%E5%8D%9A%E5%AE%A2%E8%BF%81%E7%A7%BB)。

然后，在你的博客根目录创建一个 `_config.yaml`，然后提供下面的配置：

```yaml
title: 博客标题
subtitle: 子标题
description: 描述
```

配置完成后，使用下面的指令打包：

```bash
npm run install
npm run build
```

最终会在 `out` 目录生成所有的静态资源文件。

更多部署细节可以查阅：[快速开始](https://nextjs-particlex-theme.github.io/quick-start)。
