import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {marked} from 'marked';
import {writeCollection} from './scripts/collection.mjs';
import {articles,layers} from './catalog.mjs';
import {articleDiagram} from './article-diagrams.mjs';
import {prepareReadingDiagrams,diagramAudit} from './reading-diagrams.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
const content=path.join(root,'content'),out=path.join(root,'dist');
const suppliedBase=process.env.BASE_PATH||'/';
if(/[?#\s<>"\\]/.test(suppliedBase)||suppliedBase.split('/').includes('..'))throw new Error('BASE_PATH must be a URL path, such as /aesthetic-engineering/');
const basePath='/'+suppliedBase.split('/').filter(Boolean).join('/')+(suppliedBase.split('/').filter(Boolean).length?'/':'');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for(const asset of ['style.css','diagrams.css','app.js'])fs.copyFileSync(path.join(root,'assets',asset),path.join(out,asset));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(out,'build-info.json'),JSON.stringify({basePath,articles:12})+'\n');
function writePage(relative,html){
 const file=path.join(out,relative);fs.mkdirSync(path.dirname(file),{recursive:true});
 const prepared=html.replace('<html lang="zh-CN">','<html lang="zh-CN" data-base-path="'+basePath+'">').replace(/\b(href|src)="\/(?!\/)/g,(_,attribute)=>attribute+'="'+basePath);
 fs.writeFileSync(file,prepared);
}

const esc=s=>s.replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const icon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#142427"/><path d="M9 29 20 9l11 20M14 22h12" fill="none" stroke="#fff" stroke-width="3"/><circle cx="31" cy="9" r="4" fill="#e74628"/></svg>`;
const head=(title,desc,diagrams=false)=>`<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#142427"><title>${esc(title)} · 审美工程</title><meta name="description" content="${esc(desc)}"><meta name="author" content="LeenMa"><link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(icon)}"><link rel="stylesheet" href="/style.css">${diagrams?'<link rel="stylesheet" href="/diagrams.css">':''}<script defer src="/app.js"></script></head><body>`;
const header=()=>`<a class="skip" href="#main">跳到正文</a><header class="site-header"><a class="brand" href="/" aria-label="审美工程首页"><span class="brand-mark" aria-hidden="true">A<span>E</span><i></i></span><span class="brand-name">审美工程<small>AESTHETIC ENGINEERING</small></span></a><nav aria-label="主导航"><a href="/#atlas">方法地图</a><a href="/#essays">十二篇随笔</a><a href="/references/">参考资料</a><a href="https://github.com/leenlbma/aesthetic-engineering">GitHub ↗</a></nav><span class="edition mono">VOL. 01 / 12 ESSAYS</span></header>`;
const footer=()=>`<footer class="footer"><span>审美工程 <small>Aesthetic Engineering</small></span><span>© 2026 LeenMa · <a href="https://creativecommons.org/licenses/by/4.0/">文章 CC BY 4.0</a></span><a href="/markdown/Aesthetic-Engineering-全12篇合集.md" download>下载全文合集</a><a href="https://github.com/leenlbma/aesthetic-engineering">开源仓库 ↗</a></footer>`;
for(const a of articles){a.file=fs.readdirSync(content).find(x=>x.startsWith(a.id+'-'));a.markdown=fs.readFileSync(path.join(content,a.file),'utf8');a.original=a.markdown.split('\n')[0].slice(2);a.minutes=Math.ceil(a.markdown.replace(/```[\s\S]*?```/g,'').length/420);}
const row=a=>`<a class="essay-row" href="/articles/${a.id}/" data-group="${a.group}"><span class="essay-no mono">${a.id}</span><div class="essay-copy"><span class="eyebrow">${a.term}</span><h3>${a.title}</h3><p>${a.summary}</p></div><span class="essay-meta"><span>${a.group}</span><span>约 ${a.minutes} 分钟</span></span><span class="read-word">阅读</span></a>`;
const home=head('生成之后，如何选择','12 篇创作方法随笔。从审美语言到团队判断，探索 AI 创作的六层结构。')+header()+`<main id="main"><section class="intro" id="atlas"><div class="intro-copy"><p class="eyebrow"><span class="tiny-square"></span> NOTES ON CREATION & JUDGMENT</p><h1>生成之后，<br>我们如何<span class="ink-em">选择</span>？</h1><p class="lead">从一张图的“感觉不对”，到一套能够讨论、实践与修正的判断方法。</p><div class="intro-bottom"><span class="big-number">12<span>篇随笔</span></span><p>写给 AIGC 创作者<br>与产品团队</p><a class="text-link" href="#essays">阅读全系列</a></div></div><div class="atlas"><div class="atlas-top"><span class="eyebrow">THE AESTHETIC STACK</span><span class="mono">01—06</span></div><div class="stack" role="group" aria-label="探索六层审美工程结构">${layers.map((l,i)=>`<button class="layer${i===0?' active':''}" data-layer="${i}" aria-pressed="${i===0}"><span class="layer-index mono">0${i+1}</span><span class="layer-label">${l.label}<small>${l.en}</small></span><span class="layer-verb">${l.verb}</span><span class="layer-dot" aria-hidden="true"></span></button>`).join('')}</div><div class="loop-label"><svg viewBox="0 0 32 20" aria-hidden="true"><path d="M5 5h18a6 6 0 0 1 0 12H9M5 5l5-4M5 5l5 4"/></svg>经验回到方向，判断持续更新</div><div class="layer-detail" aria-live="polite"><div class="detail-top"><span id="layer-chapter" class="eyebrow">CHAPTER 04</span><span class="detail-count mono" id="layer-position">01 / 06</span></div><h2 id="layer-question">${layers[0].question}</h2><p id="layer-description">${layers[0].detail}</p><div class="detail-bottom"><span id="layer-result">${layers[0].result}</span><a id="layer-link" href="/articles/04/">阅读本篇</a></div></div></div></section><section class="library" id="essays"><div class="section-heading"><div><p class="eyebrow">THE COLLECTION</p><h2>从问题，走向方法。</h2></div><p>可以按顺序读，也可以从<br>眼前遇到的问题开始。</p></div><div class="filters" role="group" aria-label="按主题浏览文章">${[['全部','12'],['问题与方法','03'],['六层能力','06'],['品牌与协作','02'],['边界与未来','01']].map(([x,n],i)=>`<button data-filter="${x}" aria-pressed="${i===0}" class="${i===0?'active':''}">${x}<small>${n}</small></button>`).join('')}<span class="filter-note" aria-live="polite" id="filter-count">12 篇文章</span></div><div class="essay-list">${articles.map(row).join('')}</div></section><aside class="closing"><p class="eyebrow">AN OPEN QUESTION</p><p>当系统越来越懂我们，<br>也要让判断有机会<span>继续生长。</span></p><a href="/articles/12/">阅读完结篇</a></aside></main>`+footer()+`<script type="application/json" id="layer-data">${JSON.stringify(layers)}</script></body></html>`;
fs.mkdirSync(out,{recursive:true});writePage('index.html',home);
{
 for(const a of articles){
  const dir=path.join(out,'articles',a.id);fs.mkdirSync(dir,{recursive:true});
  const raw=prepareReadingDiagrams(a.id,a.markdown.replace(/^# .+\n\n/,'').replace(/^> Aesthetic Engineering 系列[^\n]+\n\n/,'').replace(/^> 作者：[^\n]+\n\n/,''));
  let count=0,toc=[];
  const renderer=new marked.Renderer();renderer.heading=function({tokens,depth}){const txt=this.parser.parseInline(tokens);const id='section-'+(++count);if(depth===2)toc.push({id,text:txt.replace(/<[^>]*>/g,'')});return `<h${depth} id="${id}">${txt}</h${depth}>\n`;};
  const renderCode=renderer.code;
  renderer.code=function(code){return articleDiagram(a.id,code)||renderCode.call(this,code);};
  const html=marked.parse(raw,{renderer,gfm:true});
  const i=Number(a.id)-1,prev=articles[i-1],next=articles[i+1];
  const side=`<aside class="toc"><a class="back-link" href="/#essays">全系列 · 12 篇</a><span class="eyebrow">本篇目录</span><nav aria-label="文章章节">${toc.map(t=>`<a href="#${t.id}">${esc(t.text)}</a>`).join('')}</nav><div class="toc-bottom"><span>阅读进度</span><span id="progress-label">0%</span></div><div class="progress-track"><span id="progress-line"></span></div></aside>`;
  const page=head(a.original,a.summary,Number(a.id)<=6)+header()+`<main id="main" class="reading-layout">${side}<div class="article-wrap"><header class="article-header"><div class="article-eyebrow"><span class="eyebrow">${a.term}</span><span class="mono">${a.id} / 12</span></div><h1>${esc(a.original)}</h1><div class="article-info"><span>作者：LeenMa</span><span>${a.group}</span><span>约 ${a.minutes} 分钟阅读</span><a href="/markdown/${a.id}.md" download="${esc(a.file)}">下载 Markdown</a></div></header><details class="mobile-toc"><summary>本篇目录</summary><nav>${toc.map(t=>`<a href="#${t.id}">${esc(t.text)}</a>`).join('')}</nav></details><article class="prose">${html}</article><nav class="article-pagination" aria-label="文章翻页">${prev?`<a href="/articles/${prev.id}/"><span>上一篇 · ${prev.id}</span><strong>${prev.title}</strong></a>`:`<a href="/#essays"><span>全系列</span><strong>从这里开始</strong></a>`}${next?`<a href="/articles/${next.id}/"><span>下一篇 · ${next.id}</span><strong>${next.title}</strong></a>`:`<a href="/#atlas"><span>回到方法地图</span><strong>让下一次创作更清楚</strong></a>`}</nav></div></main>`+footer()+'</body></html>';
  writePage('articles/'+a.id+'/index.html',page);fs.mkdirSync(path.join(out,'markdown'),{recursive:true});fs.writeFileSync(path.join(out,'markdown',a.id+'.md'),a.markdown);
 }
 const ref=fs.readFileSync(path.join(content,'参考资料.md'),'utf8');
 fs.mkdirSync(path.join(out,'references'),{recursive:true});writePage('references/index.html',head('参考资料与术语','系列引用与术语用法')+header()+`<main id="main" class="references"><a class="back-link" href="/">审美工程 · 首页</a><article class="prose">${marked.parse(ref)}</article></main>`+footer()+'</body></html>');
}
writePage('404.html',head('页面未找到','返回审美工程阅读首页')+header()+'<main id="main" class="references"><h1>这页还没有内容</h1><p>可以回到目录，继续阅读十二篇随笔。</p><a class="text-link" href="/">返回首页</a></main>'+footer()+'</body></html>');
writeCollection(content,articles);
fs.copyFileSync(path.join(content,'Aesthetic-Engineering-全12篇合集.md'),path.join(out,'markdown','Aesthetic-Engineering-全12篇合集.md'));
console.log('Generated home, 12 complete essays, references and Markdown collection');
console.log('Reading transformations: '+JSON.stringify(diagramAudit.reduce((counts,item)=>(counts[item.type]=(counts[item.type]||0)+1,counts),{})));
