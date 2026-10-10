# Aesthetic Engineering｜审美工程

[![文章：CC BY 4.0](https://img.shields.io/badge/Articles-CC_BY_4.0-2f6f61.svg)](LICENSE-CONTENT)
[![代码：MIT](https://img.shields.io/badge/Code-MIT-526876.svg)](LICENSE)

**文章及原创配图：[CC BY 4.0](LICENSE-CONTENT) · 网站代码：[MIT](LICENSE) · 作者：LeenMa**

**生成之后，我们如何选择？**

12 篇写给 AIGC 创作者与产品团队的方法随笔。由 **LeenMa** 创作，从“AI 味”出发，讨论审美判断怎样被表达、落实、检查，并进入下一次创作。

[在线阅读](https://leenlbma.github.io/aesthetic-engineering/) · [全文合集](content/Aesthetic-Engineering-全12篇合集.md) · [文章配图库](docs/images/README.md) · [参考资料](content/参考资料.md) · [参与贡献](CONTRIBUTING.md)

这些文章也发布在我的小红书：[LeenMa 的小红书主页](https://www.xiaohongshu.com/user/profile/5b4a2a3df7e8b94fcb3a2d6b)。欢迎在那里阅读、交流创作中的判断与选择。

## 给 AI 阅读

从 **[AI 阅读入口](ai/README.md)** 开始，按任务选择正文；可直接把下面的地址交给能够访问网页的 AI：

**https://leenlbma.github.io/aesthetic-engineering/llms.txt**

[六层概念索引](ai/concepts.md) · [三个任务示例](ai/tasks.md) · [机器可读索引](ai/index.json) · [完整文本包](llms-full.txt)

`llms.txt` 提供阅读顺序和原文直链，`llms-full.txt` 包含指引、12 篇全文与参考资料。部分 AI 不会自动读取索引，需要明确提供地址；上下文有限时建议逐篇读取。输入材料、引用方式与方法边界见阅读入口。

## 从这里开始

网站包含六层交互地图、完整文章、主题筛选、章节目录、阅读进度和 Markdown 下载。流程、结构与关系表达以图示呈现，支持手机阅读。

| 篇目 | 讨论的问题 |
| --- | --- |
| [01 · 为什么 AI 做出来的东西总有一股 AI 味](content/01-为什么AI做出来的东西总有一股AI味.md) | 完成度之外，哪些选择缺席了？ |
| [02 · 当生成不再稀缺，审美会成为 AIGC 最大的壁垒](content/02-当生成不再稀缺审美会成为AIGC最大的壁垒.md) | 生成、创作与判断有何不同？ |
| [03 · 我们能把审美工程化吗](content/03-Aesthetic-Engineering-我们能把审美工程化吗.md) | 六层能力怎样连接成工作过程？ |
| [04 · 审美语言](content/04-审美语言.md) | 怎样把“感觉不对”说清楚？ |
| [05 · 参考系统](content/05-参考系统.md) | 参考究竟借什么、不借什么？ |
| [06 · 艺术指导](content/06-艺术指导.md) | 生成之前，哪些选择最重要？ |
| [07 · 生成协议](content/07-生成协议.md) | 怎样让每一轮生成带来信息？ |
| [08 · 审美评审](content/08-审美评审.md) | 评语怎样成为可靠的修改建议？ |
| [09 · 审美记忆](content/09-审美记忆.md) | 哪些经验值得带到下一次？ |
| [10 · 品牌审美](content/10-品牌审美.md) | 品牌原则怎样进入具体判断？ |
| [11 · 团队协作](content/11-团队协作.md) | 多人怎样共同判断与交接？ |
| [12 · 边界与未来](content/12-边界与未来.md) | 系统越懂我们，怎样继续生长？ |

## 怎样使用

从一个项目、一次比较开始：保留实际候选，说明本轮目标，记录为什么暂选这一版、准备改哪里、哪些优点需要保护。修改后回看判断是否成立。

文中的概念公式、流程与模板用于讨论和试用；研究结论、方法示意与个人判断在文中分别说明。它们能否改善创作，需要在实际任务里检验。

## 文章配图

已收录系列总览与第四篇「审美语言」封面，原图、来源与对应篇目见 [配图库](docs/images/README.md)。

**下面是早期系列总览，部分篇目和编号与现行目录不同；阅读顺序以本 README 上方的目录为准。**

![审美工程早期系列总览，非现行十二篇目录](docs/images/series-overview-early.jpg)

## 引用本系列

仓库提供 [CITATION.cff](CITATION.cff)，可通过 GitHub 的 **Cite this repository** 入口复制引用。推荐署名：

> LeenMa. (2026). Aesthetic Engineering｜审美工程. https://leenlbma.github.io/aesthetic-engineering/

引用具体观点时，请补充篇号、文章标题、小节和链接。需要固定引用版本时，使用对应提交的文件链接；转载与改编还应附上 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可链接，并注明修改。

## 本地运行

需要 Node.js 20 或更新版本。

```sh
npm ci
npm run build
npm run check
npm run preview
```

打开 `http://localhost:8765/`。测试 GitHub Pages 的项目子路径：

```sh
BASE_PATH=/aesthetic-engineering/ npm run build
npm run check
npm run preview
```

这时打开 `http://localhost:8765/aesthetic-engineering/`。

## 内容与维护

- `content/`：独立文章与参考资料；构建会同步目录和全文合集。
- `docs/images/`：文章配图原文件、来源与版本说明。
- `CITATION.cff`：系列的机器可读引用信息。
- `catalog.mjs`：篇目摘要与六层方法地图。
- `generate.mjs`：页面生成、子路径适配与下载文件。
- `article-diagrams.mjs`、`reading-diagrams.mjs`：文章图示与关系表达。
- `assets/`：样式与交互；`dist/` 是生成结果，不直接编辑。
- `ai/`：AI 阅读入口、概念索引、任务示例与机器可读索引。
- `scripts/ai-reading.mjs`：同步生成 `llms.txt`、`llms-full.txt`、`ai/index.json` 和网站上的 AI 阅读入口。
- `.github/workflows/pages.yml`：检查并发布 GitHub Pages。

修改文章或网站后提交到 `main`，GitHub Actions 会自动检查、构建和发布。Pull Request 只运行检查。若 Fork 此仓库，需要在 **Settings → Pages → Source** 中选择 **GitHub Actions**；当前发布流程按项目站点的 `/仓库名/` 路径构建。使用账号根站点或自定义域名时，将工作流的 `BASE_PATH` 改为 `/`，并更新 README 与页面中的项目链接。

站点使用 Umami Cloud 做不带 cookie 的访问统计（仅页面访问，无个人信息）。

修改独立正文或 AI 指引后，运行 `npm run build` 并提交同步生成的目录、合集、`llms.txt`、`llms-full.txt` 和 `ai/index.json`。这些文件不应分别手工维护；CI 会检查其是否与源文件一致。

## 开源许可

- **文章及原创图示：CC BY 4.0**，允许转载、改编和商用，须署名 **LeenMa**、附许可链接，并说明修改。
- **网站代码：MIT**。

许可文本见 [内容许可](LICENSE-CONTENT) 与 [代码许可](LICENSE)，适用范围和推荐署名见 [NOTICE](NOTICE.md)。第三方引用保留其原有权利与许可。
