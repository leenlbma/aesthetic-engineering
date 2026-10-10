import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
const {basePath}=JSON.parse(fs.readFileSync(path.join(dist,'build-info.json'),'utf8'));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const pages=walk(dist).filter(f=>f.endsWith('.html'));
let links=0;
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`Expected one title: ${file}`);
 assert.equal([...html.matchAll(/<script defer src="https:\/\/cloud\.umami\.is\/script\.js" data-website-id="([^"]+)"><\/script>/g)].map(m=>m[1]).join(),'8ba58f50-24d2-4d61-a09c-1aa3558a4ade',`Umami script missing or wrong id: ${file}`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,`Duplicate section ids: ${file}`);
 for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const url=m[1];
  if(url.startsWith('#')){assert.ok(ids.includes(url.slice(1)),`Missing anchor ${url} in ${file}`);continue;}
  if(!url.startsWith('/')||url.startsWith('//'))continue;
  assert.ok(url.startsWith(basePath),`Path does not include ${basePath}: ${url}`);
  const rel=decodeURIComponent(url.slice(basePath.length).split(/[?#]/)[0]);
  let target=path.join(dist,rel);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),`Missing local asset: ${url}`);links++;
 }
 // Diagrams must render as figures; future runnable code blocks remain allowed.
 assert.ok(!/<pre><code class="language-text">[\s\S]*?(?:↓|←──|┌──)[\s\S]*?<\/code><\/pre>/.test(html),`Unrendered character diagram: ${file}`);
}
for(let n=1;n<=12;n++){
 const id=String(n).padStart(2,'0');
 const files=fs.readdirSync(path.join(root,'content')).filter(f=>f.startsWith(id+'-'));
 assert.equal(files.length,1,`Missing or duplicate article ${id}`);
 assert.ok(fs.existsSync(path.join(dist,'articles',id,'index.html')));
 assert.deepEqual(fs.readFileSync(path.join(root,'content',files[0])),fs.readFileSync(path.join(dist,'markdown',id+'.md')));
}
assert.equal(pages.length,18,'Expected homepage, 12 essays, references, 3 AI guides and 404');
const all=fs.readFileSync(path.join(root,'content','Aesthetic-Engineering-全12篇合集.md'),'utf8');
assert.equal((all.match(/<a id="article-\d{2}"><\/a>/g)||[]).length,12);
const digest=value=>createHash('sha256').update(value).digest('hex');
const index=JSON.parse(fs.readFileSync(path.join(root,'ai/index.json'),'utf8'));
const full=fs.readFileSync(path.join(root,'llms-full.txt'),'utf8');
assert.equal(index.articles.length,12);
assert.equal(index.guides.length,3);
assert.deepEqual(index.articles.map(a=>a.id),Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')));
assert.equal(index.source_digest,digest(JSON.stringify(index.sources)));
for(const source of index.sources){
 assert.equal(source.sha256,digest(fs.readFileSync(path.join(root,source.path))),`Stale AI source: ${source.path}`);
 assert.ok(full.includes(source.url),`Full text bundle missing source: ${source.path}`);
}
for(const article of index.articles){
 const source=fs.readFileSync(path.join(root,article.source_path),'utf8');
 assert.equal(article.sha256,digest(source));
 assert.equal(article.bytes,Buffer.byteLength(source));
 assert.ok(article.sections.length>0);
 assert.ok(full.includes(source.trim()),`Full text bundle missing article body: ${article.id}`);
}
for(const ids of Object.values(index.reading_routes))for(const id of ids)assert.ok(index.articles.some(a=>a.id===id));
for(const file of ['llms.txt','llms-full.txt','ai/index.json']){
 assert.deepEqual(fs.readFileSync(path.join(root,file)),fs.readFileSync(path.join(dist,file)),`Published AI copy is stale: ${file}`);
}
// Check authored relative links and every first-party Raw URL without relying on deployment.
const rawPrefix='https://raw.githubusercontent.com/leenlbma/aesthetic-engineering/main/';
for(const file of ['README.md','CONTRIBUTING.md','NOTICE.md','ai/README.md','ai/concepts.md','ai/tasks.md','llms.txt','llms-full.txt']){
 const text=fs.readFileSync(path.join(root,file),'utf8');
 for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
  const url=match[1];
  if(url.startsWith(rawPrefix)){
   const target=decodeURIComponent(url.slice(rawPrefix.length).split('#')[0]);
   assert.ok(fs.existsSync(path.join(root,target)),`Missing Raw target: ${url}`);
  }else if(!/^(?:[a-z]+:|#|\/\/)/i.test(url)){
   assert.ok(fs.existsSync(path.resolve(root,path.dirname(file),url.split('#')[0])),`Missing document link: ${file} → ${url}`);
  }
 }
}
console.log(`Checked 12 articles, ${pages.length} pages, ${links} local links and AI reading sources at ${basePath}`);
