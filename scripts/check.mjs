import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
const {basePath}=JSON.parse(fs.readFileSync(path.join(dist,'build-info.json'),'utf8'));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const pages=walk(dist).filter(f=>f.endsWith('.html'));
let links=0;
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`Expected one title: ${file}`);
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
assert.equal(pages.length,15,'Expected homepage, 12 essays, references and 404');
const all=fs.readFileSync(path.join(root,'content','Aesthetic-Engineering-全12篇合集.md'),'utf8');
assert.equal((all.match(/<a id="article-\d{2}"><\/a>/g)||[]).length,12);
console.log(`Checked 12 articles, ${pages.length} pages and ${links} local links at ${basePath}`);
