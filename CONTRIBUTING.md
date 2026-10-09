# 参与审美工程

欢迎纠错、补充反例、提供实践反馈，或改善阅读体验。涉及不同审美判断时，请说明任务、依据与适用范围。

## 反馈可以从一件作品开始

说明当时要完成什么、比较了哪些候选、为什么暂选这一版，以及修改后发生了什么。没有效果或仍有分歧的尝试同样有价值。请只提交你有权公开的材料。

## 修改文章

1. 编辑 `content/` 中对应的独立文章；它们是正文的唯一编辑入口。
2. 保留事实、观点、方法示意和待验证假设之间的区别。新增研究结论时，请附原始来源，并更新 `content/参考资料.md`。
3. 运行 `npm ci`、`npm run build` 和 `npm run check`。构建会同步文章目录与全文合集，提交这些更新。
4. 如果改动了流程或字符图，请同步调整 `article-diagrams.mjs` 或 `reading-diagrams.mjs` 中的网页展示。

AI 阅读资料在 `ai/README.md`、`ai/concepts.md` 和 `ai/tasks.md` 中维护，概念与示例应注明对应篇目。`llms.txt`、`llms-full.txt`、`ai/index.json` 由构建同步生成，请与文章目录、合集一起提交，避免 AI 入口与正文形成不同版本。

文字保留随笔感，面向 AIGC 创作者与产品团队。优先说明具体问题、选择和下一步，避免把概念公式写成已经验证的定量规律。

## 修改网站

样式与交互在 `assets/`，页面生成在 `generate.mjs`。`dist/` 是构建产物，不直接编辑或提交。提交前同时检查默认根路径和项目路径：

```sh
npm run build
npm run check
BASE_PATH=/aesthetic-engineering/ npm run build
npm run check
npm run preview
```

第二种构建完成后，预览地址为 `http://localhost:8765/aesthetic-engineering/`。请检查手机阅读、图示、目录和篇目跳转。

提交贡献即表示你有权提供该内容，并同意贡献按 [项目对应许可](NOTICE.md) 发布。原作者署名与贡献者署名应当保留。
