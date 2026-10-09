import {additionalDiagram} from './reading-diagrams.mjs';
// Presentation overrides for the three bespoke diagrams in essay 03.
// The Markdown source and its downloadable copy remain the original manuscript.
const flowSteps = [
  ['生成', 'Generate', '产出候选'], ['比较', 'Compare', '看清差异'],
  ['取舍', 'Select / Reject', '留下或放弃'], ['修改', 'Edit', '调整具体问题'],
  ['再生成', 'Regenerate', '检验修改方向'], ['最终选择', 'Final Choice', '确认这一版'],
];
const stackLayers = [
  ['06', '审美记忆', 'Taste Memory', '记录选择，更新理解', '09'],
  ['05', '审美评审', 'Aesthetic Critic', '比较作品，解释与建议', '08'],
  ['04', '生成执行', 'Generation', '产生候选，处理执行问题', '07'],
  ['03', '艺术指导', 'Art Direction', '确定方向与创作策略', '06'],
  ['02', '参考系统', 'Reference System', '组织参考与 Moodboard', '05'],
  ['01', '审美语言', 'Taste Language', '表达与讨论审美偏好', '04'],
];
const figure = (id, number, title, body, note) => `<figure class="ae-diagram" id="${id}" aria-labelledby="${id}-title"><figcaption class="diagram-heading" id="${id}-title"><span class="mono">${{'01':'流程','02':'分层','03':'循环'}[number]}</span><strong>${title}</strong></figcaption>${body}<p class="diagram-note">${note}</p></figure>`;
const choiceFlow = figure('choice-flow', '01', '选择，发生在创作的每一步',
  `<ol class="choice-steps">${flowSteps.map(([zh, en, detail], i) => `<li><span class="step-number mono">0${i+1}</span><strong>${zh}</strong><span class="step-en">${en}</span><span class="step-detail">${detail}</span></li>`).join('')}</ol>`,
  '把候选、动作与理由一起留下，下一轮才有经验可以检验。');
const aestheticStack = figure('aesthetic-stack', '02', '六层能力，共同支持一次判断',
  `<div class="stack-figure-labels"><span>AESTHETIC STACK / v0.1</span><span>点击各层，阅读详解 ↗</span></div><ol class="capability-stack">${stackLayers.map(([n, zh, en, detail, id]) => `<li><a href="/articles/${id}/"><span class="stack-no mono">${n}</span><span class="stack-name"><strong>${zh}</strong><span>${en}</span></span><span class="stack-purpose">${detail}</span><span class="stack-open" aria-hidden="true">↗</span></a></li>`).join('')}</ol>`,
  '从底层的语言与参考，到上层的评审与记忆；六层是职责划分，可以由同一套流程承担。');

const node = (x, y, w, zh, en, n, memory = false) => `<g class="loop-node${memory?' loop-memory':''}"><rect x="${x}" y="${y}" width="${w}" height="68" rx="3"/><text x="${x+15}" y="${y+23}" class="loop-index">${n}</text><text x="${x+40}" y="${y+29}" class="loop-zh">${zh}</text><text x="${x+40}" y="${y+49}" class="loop-en">${en}</text></g>`;
const loopSteps = [['创作意图','Intent'],['创作方向','Direction'],['生成候选','Generate'],['评审','Critic'],['选择','Select'],['修改','Edit'],['偏好线索','Preference'],['审美记忆','Taste Memory']];
const creativeLoop = figure('creative-loop', '03', '让这一次的选择，进入下一次创作',
  `<div class="diagram-legend"><span><i></i>本轮创作与记录</span><span><i class="feedback-key"></i>经验反馈</span></div>
  <svg class="loop-desktop" viewBox="0 0 720 422" role="img" aria-labelledby="loop-svg-title loop-svg-desc"><title id="loop-svg-title">创作与记忆的反馈循环</title><desc id="loop-svg-desc">创作意图到方向、生成、评审、选择和修改。实际选择与修改提供偏好线索，进入审美记忆；相关记忆回到创作方向与评审。</desc><defs><marker id="loop-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 7 4 1 7" fill="none" stroke="#61736d" stroke-width="1.3"/></marker><marker id="feedback-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 7 4 1 7" fill="none" stroke="#c64b31" stroke-width="1.3"/></marker></defs>
  <g class="loop-forward" marker-end="url(#loop-arrow)"><path d="M202 112H260"/><path d="M442 112H500"/><path d="M592 146V216"/><path d="M502 250H444"/><path d="M262 250H204"/><path d="M112 284V336"/><path d="M262 372H348"/></g>
  <g class="loop-feedback" marker-end="url(#feedback-arrow)"><path d="M682 372H704V32H352V76"/><path d="M592 338V286"/></g><text x="470" y="20" class="feedback-label">经验回到创作方向</text><text x="606" y="317" class="feedback-label">用于评审</text>
  ${node(22,78,180,'创作意图','Intent','01')}${node(262,78,180,'创作方向','Direction','02')}${node(502,78,180,'生成候选','Generate','03')}${node(502,216,180,'评审','Critic','04')}${node(262,216,180,'选择','Select','05')}${node(22,216,180,'修改','Edit','06')}${node(22,338,240,'偏好线索','Preference','07')}${node(350,338,332,'审美记忆','Taste Memory','08',true)}</svg>
  <div class="loop-mobile"><ol>${loopSteps.map(([zh,en],i)=>`<li${i===7?' class="memory-step"':''}><span class="mono">0${i+1}</span><strong>${zh}</strong><span>${en}</span></li>`).join('')}</ol><div class="mobile-feedback"><span aria-hidden="true">↶</span><span>记忆回到<strong>创作方向</strong>与<strong>评审</strong></span></div></div>`,
  '偏好线索需要结合任务解释，记忆也可以被修正。循环是否让创作变好，仍要通过实际作品检验。');

export function articleDiagram(articleId, code) {
  if (articleId !== '03') return additionalDiagram(articleId, code);
  const text = code.text.trim();
  if (text === 'Generate\n↓\nCompare\n↓\nSelect / Reject\n↓\nEdit\n↓\nRegenerate\n↓\nFinal Choice') return choiceFlow;
  if (text.startsWith('┌') && text.includes('Renderer Layer') && text.includes('Taste Language')) return aestheticStack;
  if (text.startsWith('Taste Memory') && text.includes('Intent → Direction → Generate') && text.includes('└────→ Memory')) return creativeLoop;
  return additionalDiagram(articleId, code);
}
