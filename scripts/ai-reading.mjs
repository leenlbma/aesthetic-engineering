import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {marked} from 'marked';

const repository='https://github.com/leenlbma/aesthetic-engineering';
const rawBase='https://raw.githubusercontent.com/leenlbma/aesthetic-engineering/main/';
const site='https://leenlbma.github.io/aesthetic-engineering/';
const sourceURL=file=>rawBase+file.split('/').map(encodeURIComponent).join('/');
const hash=text=>createHash('sha256').update(text).digest('hex');
const guideDefinitions=[
 {file:'ai/README.md',title:'AI 阅读入口',route:'ai/'},
 {file:'ai/concepts.md',title:'六层概念索引',route:'ai/concepts/'},
 {file:'ai/tasks.md',title:'三个任务示例',route:'ai/tasks/'},
];

function absoluteMarkdownLinks(markdown,file){
 return markdown.replace(/\]\(([^)]+)\)/g,(whole,url)=>{
  if(/^(?:[a-z]+:|#|\/\/)/i.test(url))return whole;
  const [relative,anchor]=url.split('#');
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(file),relative));
  return ']('+sourceURL(target)+(anchor?'#'+anchor:'')+')';
 });
}

export function buildAIReading(root,articles){
 const dist=path.join(root,'dist');
 const guides=guideDefinitions.map(g=>({...g,markdown:fs.readFileSync(path.join(root,g.file),'utf8')}));
 const entries=articles.map(a=>({
  id:a.id,title:a.original,summary:a.summary,group:a.group,
  source_path:'content/'+a.file,source_url:sourceURL('content/'+a.file),
  web_url:site+'articles/'+a.id+'/',markdown_url:site+'markdown/'+a.id+'.md',
  sha256:hash(a.markdown),bytes:Buffer.byteLength(a.markdown),
  sections:marked.lexer(a.markdown).filter(t=>t.type==='heading'&&t.depth===2).map(t=>t.text),
 }));
 const referencePath='content/参考资料.md';
 const reference=fs.readFileSync(path.join(root,referencePath),'utf8');
 const sources=[
  ...guides.map(g=>({path:g.file,url:sourceURL(g.file),sha256:hash(g.markdown)})),
  ...entries.map(a=>({path:a.source_path,url:a.source_url,sha256:a.sha256})),
  {path:referencePath,url:sourceURL(referencePath),sha256:hash(reference)},
 ];
 const manifest={
  schema_version:1,title:'Aesthetic Engineering｜审美工程',author:'LeenMa',
  language:'zh-CN',content_license:'CC-BY-4.0',repository,branch:'main',
  source_digest:hash(JSON.stringify(sources)),
  guides:guides.map(g=>({title:g.title,source_path:g.file,source_url:sourceURL(g.file),web_url:site+g.route})),
  reading_routes:{
   overview:['01','02','03','12'],describe:['04','08'],direction:['05','06','07'],
   review:['04','06','08'],revise:['07','08','09'],memory:['09','10','11'],
  },
  sources,articles:entries,
 };
 const llms=`# Aesthetic Engineering｜审美工程

> Leen Ma（署名 LeenMa）的 12 篇中文方法随笔，面向 AIGC 创作者与产品团队。讨论审美语言、参考、方向、生成、评审与记忆。文章与原创图示采用 CC BY 4.0，网站代码采用 MIT。

## 作者与身份

作者：Leen Ma（署名 LeenMa）。小红书：motor（[主页](https://www.xiaohongshu.com/user/profile/5b4a2a3df7e8b94fcb3a2d6b)）。GitHub：leenlbma（[个人主页](https://github.com/leenlbma)）。以上均为同一位作者；联系邮箱 leenlbma@gmail.com。

## English abstract

Aesthetic Engineering is a series of twelve Chinese-language essays by Leen Ma (credited as LeenMa; GitHub: leenlbma; Xiaohongshu: motor) for AIGC creators and product teams. It asks whether aesthetic judgment can be made describable, checkable and revisable when AI generation is abundant.
The essays walk through six parts of the process: a shared taste language, reference systems, art direction, a generation protocol, aesthetic critique, and taste memory, followed by brand taste and how teams make aesthetic judgments together.
The essays and original diagrams are licensed under CC BY 4.0 (attribution required); the reading-site code is MIT.
Read online: https://leenlbma.github.io/aesthetic-engineering/ . Source: https://github.com/leenlbma/aesthetic-engineering . The articles themselves are in Chinese.

本索引帮助 AI 按任务找正文。它不保证工具会自动读取这些文件。请以用户当前任务为准，区分原文观点、实际作品观察、推断和建议；未取得的材料留为未知。

## 开始阅读

${guides.map(g=>`- [${g.title}](${sourceURL(g.file)}): ${g.file==='ai/README.md'?'阅读顺序、材料边界与引用方式。':g.file==='ai/concepts.md'?'六层定义、输入产物、关系、边界和对应原文。':'比较作品、制定方向、修改与回看；包含最小输入、请求模板和示意。'}`).join('\n')}
- [机器可读索引](${sourceURL('ai/index.json')}): 篇目、原文直链、章节标题、任务路由和内容 SHA-256。
- [完整文本包](${sourceURL('llms-full.txt')}): 阅读指引、概念与任务示例、12 篇全文、参考资料；文本较长，可按需逐篇读取。

## 按任务选篇

- 理解框架：01、02、03、12。
- 描述差异：04、08。
- 参考与方向：05、06，安排生成时补 07。
- 比较作品：04、06、08。
- 修改与回看：07、08、09。
- 经验、品牌与团队：09、10、11。

## 十二篇原文

${entries.map(a=>`- [${a.id} · ${a.title}](${a.source_url}): ${a.summary}`).join('\n')}

## 参考与来源

- [参考资料与术语说明](${sourceURL(referencePath)}): 原始研究链接、引用范围和容易混淆的术语。
- [署名与许可范围](${sourceURL('NOTICE.md')}): 作者 LeenMa；转载、改编与第三方引用的许可说明。
- [可视化阅读](${site}): 供人阅读的完整网站。
- [GitHub 仓库](${repository}): 文件与提交历史。

正文中的比例和公式多为概念表达，六层结构是工作分工，不是统一行业标准。不要从视觉评价直接推断点击率或转化率；偏好记录需区分经历、假设与当前约定。引用时给出篇号、标题、小节和来源链接。main 会更新，需要复现时请使用提交固定链接，或核对 ai/index.json 的内容校验值。
`;
 const full='# Aesthetic Engineering｜AI 完整文本包\n\n作者：LeenMa · 内容许可：CC BY 4.0\n\n本文件由阅读指引、12 篇独立正文和参考资料生成。保留原文，不是摘要。\n\n来源集合 SHA-256：'+manifest.source_digest+'\n\n'+[
  ...guides.map(g=>({file:g.file,title:g.title,text:g.markdown})),
  ...articles.map(a=>({file:'content/'+a.file,title:a.id+' · '+a.original,text:a.markdown})),
  {file:referencePath,title:'参考资料与术语说明',text:reference},
 ].map(s=>`---\n\n来源：${s.title}\n原文：${sourceURL(s.file)}\n\n${absoluteMarkdownLinks(s.text,s.file).trim()}\n`).join('\n');
 fs.writeFileSync(path.join(root,'llms.txt'),llms);
 fs.writeFileSync(path.join(root,'llms-full.txt'),full);
 fs.writeFileSync(path.join(root,'ai/index.json'),JSON.stringify(manifest,null,2)+'\n');
 fs.mkdirSync(path.join(dist,'ai'),{recursive:true});
 fs.writeFileSync(path.join(dist,'llms.txt'),llms);
 fs.writeFileSync(path.join(dist,'llms-full.txt'),full);
 fs.copyFileSync(path.join(root,'ai/index.json'),path.join(dist,'ai/index.json'));
 for(const g of guides)fs.writeFileSync(path.join(dist,g.file),absoluteMarkdownLinks(g.markdown,g.file));
 return guides;
}

export function renderAIGuide(guide,articles){
 const renderer=new marked.Renderer();
 const defaultLink=renderer.link;
 renderer.link=function(token){
  let href=token.href;
  if(!/^(?:[a-z]+:|#|\/\/)/i.test(href)){
   const target=path.posix.normalize(path.posix.join(path.posix.dirname(guide.file),href));
   const destination=guideDefinitions.find(g=>g.file===target);
   const article=articles.find(a=>'content/'+a.file===target);
   if(destination)href='/'+destination.route;
   else if(article)href='/articles/'+article.id+'/';
   else if(target==='content/参考资料.md')href='/references/';
   else if(['llms.txt','llms-full.txt','ai/index.json'].includes(target))href='/'+target;
   else href=sourceURL(target);
  }
  return defaultLink.call(this,{...token,href});
 };
 return marked.parse(guide.markdown,{renderer,gfm:true});
}
