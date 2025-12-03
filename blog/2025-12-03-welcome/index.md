---
slug: welcome
title: Welcome
authors: [surajmgr]
tags: [nexus, general, how-to]
---

Welcome to myself, I guess. This page just outlines some standard of writing blog posts in this nexus. Before that, this is built with Docusaurus.

<!-- truncate -->

To add a new blog post, simply add a new Markdown file to the `blog` directory or a folder in the `blog` directory with `index.md` file. The date of the blog post can be extracted from the filename, such as `2025-12-03-welcome.md` or `2025-12-03-welcome/index.md`.

To add a new author, simply add a new YAML configuration to the `authors.yml` file.

As for the images and styles, you can use the same as in Markdown files.

For configuing this blog post itself, you have to edit the metadata at the top of the file. The metadata is in YAML format and is denoted by `---` at the top and bottom of the file.
Here are some of the metadata fields:

- `slug`: The slug of the blog post. This is the URL of the blog post.
- `title`: The title of the blog post.
- `authors`: The authors of the blog post. This is an array of author slugs.
- `tags`: The tags of the blog post. This is an array of tag slugs.

**And if you don't want a blog**: just delete this directory, and use `blog: false` in Docusaurus config.
