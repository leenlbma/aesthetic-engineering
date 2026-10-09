import fs from 'node:fs';
import path from 'node:path';

function sectionMarkdown(markdown) {
  let fence=false;
  return markdown.split('\n').map(line=>{
    if(line.startsWith('```')){fence=!fence;return line;}
    return !fence&&/^#{1,5} /.test(line)?'#'+line:line;
  }).join('\n');
}

export function writeCollection(content,articles) {
  const intro='# Aesthetic Engineering｜审美工程全12篇合集\n\n作者：**LeenMa** · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)\n\n[可视化阅读](https://leenlbma.github.io/aesthetic-engineering/) · [逐篇目录](00-目录.md) · [参考资料](参考资料.md)\n\n';
  const toc='## 目录\n\n'+articles.map(a=>`${a.id}. [${a.original}](#article-${a.id})`).join('\n')+'\n';
  const body=articles.map(a=>`\n---\n\n<a id="article-${a.id}"></a>\n\n${sectionMarkdown(a.markdown.trim())}\n`).join('');
  fs.writeFileSync(path.join(content,'Aesthetic-Engineering-全12篇合集.md'),intro+toc+body);
  const index='# Aesthetic Engineering｜十二篇目录\n\n作者：**LeenMa** · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)\n\n[可视化阅读](https://leenlbma.github.io/aesthetic-engineering/) · [全文合集](Aesthetic-Engineering-全12篇合集.md) · [阅读导览](README.md) · [参考资料](参考资料.md)\n\n'+articles.map(a=>`## ${a.id} · ${a.group}\n\n[${a.original}](${a.file})\n\n${a.summary}\n`).join('\n');
  fs.writeFileSync(path.join(content,'00-目录.md'),index);
}
