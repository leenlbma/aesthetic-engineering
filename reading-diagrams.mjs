const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names = {
  Prompt:'提示', Output:'输出结果', Intent:'创作意图', Planning:'创作规划',
  Generation:'生成执行', Generate:'生成候选', Editing:'编辑修改', Edit:'修改',
  Iteration:'反复迭代', Result:'最终成果', 'Taste Context':'审美语境',
  'Creative Direction':'创作方向', Critique:'评审', Critic:'评审', Ranking:'排序',
  Rank:'排序', Selection:'选择', Select:'选择', Reject:'舍弃', Memory:'记忆',
  'Creative Brief':'创作简报', 'Reference Retrieval':'检索参考',
  'Visual Strategy':'视觉策略', 'Art Direction':'艺术指导', Context:'任务语境',
  Taste:'审美判断', Reference:'参考', Direction:'创作方向',
  Quality:'作品质量', Identity:'表达身份', Culture:'文化语境', Preference:'偏好',
  'Aesthetic Gradient':'修改方向', Regenerate:'再次生成', Refine:'继续完善',
  Choices:'实际选择', 'New References':'新的参考', 'More Creation':'更多创作',
  Composition:'构图', Color:'色彩', Typography:'字体', Material:'材质',
  Density:'信息密度', Contrast:'对比度', Lighting:'光线', Rhythm:'节奏',
  Imperfection:'不完美程度', Emotion:'情绪', Boundary:'边界', Relationship:'元素关系',
  'Taste Language':'审美语言', 'Reference System':'参考系统',
  'Choice History':'选择历史', Judgment:'判断', 'Aesthetic Critic':'审美评审',
  'Taste Memory':'审美记忆', 'Reference Evidence':'参考证据',
  'Highly Polished':'高度修饰', 'Natural Texture':'自然质感', Symmetry:'对称',
  Asymmetry:'不对称', Digital:'数字感', Physical:'物质触感', Dense:'密集',
  Sparse:'疏朗', Perfect:'完美修饰', Imperfect:'保留不完美',
  Judge:'判断', Choose:'选择', Remember:'记录经验', 'Generate Better':'生成得更好',
  Revision:'修订', 'Direction Hypothesis':'方向假设', World:'作品世界',
  Anchor:'表达锚点', Constraints:'约束条件', 'Reference Stack':'参考组合',
  '正例':'正例', '近邻反例':'近邻反例', '选择理由':'选择理由', '使用语境':'使用语境',
  '职责与作用域':'职责与作用域', '来源与权限':'来源与权限', '使用反馈':'使用反馈',
};
const label = term => names[term] || term;
const termHTML = term => `<strong>${escape(label(term))}</strong>${names[term]&&names[term]!==term?`<small>${escape(term)}</small>`:''}`;
const norm = text => text.trim().replace(/\r/g,'');
const codeDiagrams = new Map();
const textDiagrams = new Map();
export const diagramAudit = [];
function frame(id, kind, title, body, note='') {
  return `<figure class="ae-diagram reading-diagram" id="${id}" aria-labelledby="${id}-title"><figcaption class="diagram-heading" id="${id}-title"><span class="diagram-kind">${kind}</span><strong>${title}</strong></figcaption>${body}${note?`<p class="diagram-note">${note}</p>`:''}</figure>`;
}
function flow(id,title,terms,note='') {
  return frame(id,'流程',title,`<ol class="reading-flow ${terms.length<=4?'short-flow':''}">${terms.map((t,i)=>`<li><span class="flow-index mono">${String(i+1).padStart(2,'0')}</span><span class="flow-term">${termHTML(t)}</span></li>`).join('')}</ol>`,note);
}
function parts(id,title,terms,note='',operator='+') {
  return frame(id,'关系',title,`<ul class="concept-parts" data-operator="${escape(operator)}">${terms.map(t=>`<li>${termHTML(t)}</li>`).join('')}</ul>`,note);
}
function fields(id,title,rows,note='') {
  return frame(id,'示例',title,`<dl class="reading-fields">${rows.map(([key,value])=>`<div><dt>${termHTML(key)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`,note);
}
function register(article, source, html) {codeDiagrams.set(article+'|'+norm(source),html);}
function registerFlow(article,id,title,terms,note='',source=terms.join('\n↓\n')) {register(article,source,flow(id,title,terms,note));}
function text(article,source,html){textDiagrams.set(article+'|'+source,html);}

// Essay 02: expanding candidates, then organizing a complete creative process.
registerFlow('02','prompt-output','一次提示，得到一次输出',['Prompt','Output'],'','Prompt → Output');
registerFlow('02','creation-process','把输出放进完整创作',['Intent','Planning','Generation','Editing','Iteration','Result']);
const candidates = `<div class="candidate-cloud" aria-label="多个候选方案">${['A','B','C','D','E','…','N'].map(x=>`<span>${x}</span>`).join('')}</div>`;
register('02','                 ┌→ A\n                 ├→ B\n                 ├→ C\nIntent ──────────├→ D\n                 ├→ E\n                 ├→ ...\n                 └→ N',
  frame('generation-expands','展开','一个意图，展开多种可能',`<div class="candidate-path"><div class="candidate-end"><b>1</b>${termHTML('Intent')}</div><span class="path-arrow" aria-hidden="true">→</span>${candidates}</div>`,'候选代表不同的可能性；数量增加，不等于作品价值同比增加。'));
register('02','A ─┐\nB ─┤\nC ─┤\nD ─┼────→ Judgment ────→ 1\nE ─┤\n...│\nN ─┘',
  frame('taste-selects','收束','从候选中，形成愿意留下的结果',`<div class="candidate-path converging">${candidates}<span class="path-arrow" aria-hidden="true">→</span><div class="candidate-judgment">${termHTML('Judgment')}<span>比较 · 删除 · 组合 · 修改</span></div><span class="path-arrow" aria-hidden="true">→</span><div class="candidate-end"><b>1</b><strong>确定的表达</strong></div></div>`,'“1”可以是一件作品，也可以是一组已经确定的表达。'));
registerFlow('02','simple-generation','常见的生成链路',['Prompt','Generate','Output']);
registerFlow('02','creative-system','把判断接入创作系统',['Intent','Taste Context','Creative Direction','Generation','Critique','Ranking','Selection','Editing','Result','Memory'],'生成执行只是其中一环；评审影响修改，选择进入记忆。');
for(const article of ['02','03']) registerFlow(article,'brand-judgment','品牌判断怎样参与创作',[article==='02'?'Generate':'Generation','Critique','Rank','Reject','Edit']);
register('02','AIGC 1.0\nGeneration\n↓\n能不能生成\n\n\nAIGC 2.0\nCreation\n↓\n能不能完成创作\n\n\nAIGC 3.0\nTaste\n↓\n知不知道什么值得创作',
  frame('three-perspectives','层次','从生成能力，到创作与判断',`<div class="perspective-grid">${[['1.0','Generation','生成能力','能不能生成','质量 · 速度 · 成本'],['2.0','Creation','创作能力','能不能完成创作','控制 · 编辑 · 叙事'],['3.0','Taste','审美判断','知不知道什么值得创作','判断 · 文化 · 身份']].map(([n,en,zh,q,d])=>`<div><span class="mono">AIGC ${n}</span><strong>${zh}</strong><small>${en}</small><p>${q}</p><span>${d}</span></div>`).join('')}</div>`,'三个讨论层次会长期共存，并非整个行业必须依次走过的时间表。'));

// Essay 03: keep the three existing bespoke figures and render the remaining blocks.
registerFlow('03','prompt-generation','从提示开始的单次生成',['Prompt','Generate']);
registerFlow('03','direction-before-generation','在生成之前，先形成创作方向',['Intent','Creative Brief','Taste Context','Reference Retrieval','Visual Strategy','Art Direction','Generation']);
register('03','Intent\nContext\nTaste\nReference\nPlanning\nDirection\nGeneration\nCritique\nSelection\nEditing\nMemory',
  parts('creative-responsibilities','完整创作涉及哪些工作',['Intent','Context','Taste','Reference','Planning','Direction','Generation','Critique','Selection','Editing','Memory'],'这是工作内容的展开，同一个模型可以承担多个角色。',''));
register('03','Quality\n×\nContext\n×\nIdentity\n×\nCulture\n×\nPreference',
  parts('judgment-factors','创作评价中相互影响的因素',['Quality','Context','Identity','Culture','Preference'],'乘号表示相互影响，不是可以直接计算的评分公式。','×'));
registerFlow('03','critique-refinement','把评审转成下一步修改',['Generate','Critique','Aesthetic Gradient','Regenerate','Critique','Refine'],'审美梯度在这里比喻修改方向；修改后仍需检查。');
register('03','Taste t0\n↓\nChoices\n↓\nTaste t1\n↓\nNew References\n↓\nTaste t2\n↓\nMore Creation\n↓\nTaste t3',
  frame('taste-timeline','时间线','偏好会随经历继续变化',`<ol class="taste-timeline">${[['t₀','起初的审美理解','实际选择 · Choices'],['t₁','选择之后的理解','新的参考 · New References'],['t₂','接触新参考后的理解','更多创作 · More Creation'],['t₃','新的审美理解','']].map(([t,zh,event])=>`<li><span class="timeline-dot"></span><span class="mono">${t}</span><strong>${zh}</strong>${event?`<span class="timeline-event">${event} ↓</span>`:''}</li>`).join('')}</ol>`,'时间线表示理解可能更新，不代表审美会自动变好。'));

// Essay 04: comparison axes are descriptive, never fake measurements or ratings.
register('04','Composition\n+\nColor\n+\nTypography\n+\nMaterial',parts('visual-attributes','先看见这些视觉属性',['Composition','Color','Typography','Material'],'属性之外，还需要情绪、文化、时代与表达者的语境。'));
const axisSource = 'Composition     Centered   ←──────→ Asymmetric\nDensity         Dense      ←──────→ Sparse\nColor           Saturated  ←──────→ Muted\nContrast        High       ←──────→ Low\nTypography      Quiet      ←──────→ Expressive\nMaterial        Digital    ←──────→ Physical\nLighting        Dramatic   ←──────→ Natural\nRhythm          Dynamic    ←──────→ Calm\nImperfection    Perfect    ←──────→ Raw\nEmotion         Loud       ←──────→ Quiet\nCulture         Generic    ←──────→ Specific';
const axes = [
 ['Composition','居中','非对称','Centered','Asymmetric'],['Density','密集','疏朗','Dense','Sparse'],
 ['Color','高饱和','低饱和','Saturated','Muted'],['Contrast','高对比','低对比','High','Low'],
 ['Typography','安静','有表现力','Quiet','Expressive'],['Material','数字感','物质触感','Digital','Physical'],
 ['Lighting','戏剧化','自然','Dramatic','Natural'],['Rhythm','动态','平静','Dynamic','Calm'],
 ['Imperfection','完美修饰','粗粝','Perfect','Raw'],['Emotion','张扬','安静','Loud','Quiet'],
 ['Culture','通用','具体','Generic','Specific'],
];
register('04',axisSource,frame('taste-axes','比较轴','让“感觉”有可以讨论的位置',`<dl class="taste-axes">${axes.map(([key,l,r,le,re])=>`<div><dt>${termHTML(key)}</dt><dd><span><strong>${l}</strong><small>${le}</small></span><i aria-hidden="true"></i><span><strong>${r}</strong><small>${re}</small></span></dd></div>`).join('')}</dl>`,'这些轴用来比较，不是评分标尺；两端没有高低之分，也未必互相排斥。'));
register('04','Density       → Sparse\nColor         → Muted\nContrast      → Medium-Low\nTypography    → Quiet\nMaterial      → Physical\nLighting      → Natural\nRhythm        → Calm\nImperfection  → Slightly Raw',
  fields('taste-example','把“高级一点”拆成一个可尝试的方向',[
   ['Density','疏朗 / Sparse'],['Color','低饱和 / Muted'],['Contrast','中低对比 / Medium-Low'],
   ['Typography','安静 / Quiet'],['Material','物质触感 / Physical'],['Lighting','自然 / Natural'],
   ['Rhythm','平静 / Calm'],['Imperfection','略带粗粝 / Slightly Raw']
  ],'这只是一种项目方向，不能推导为通用的“高级感”配方。'));
register('04','Preference\n+\nBoundary',parts('preference-boundary','既说清喜欢什么，也说明不接受什么',['Preference','Boundary']));
register('04','90% 克制\n+\n10% 冒险',frame('order-experiment','关系','以克制为主，给冒险留一个位置',`<div class="proportion-strip"><span>90% 克制</span><span>10% 冒险</span></div>`,'百分比是主次关系的比喻，没有可直接测量的含义。'));
register('04','严格 Grid\n+\n一处故意破坏 Grid',frame('grid-exception','关系','整体保持秩序，一处打破秩序',`<div class="grid-relationship"><div class="grid-demo" aria-hidden="true">${'<span></span>'.repeat(8)}<span class="grid-break"></span></div><div><strong>严格的网格</strong><span class="relationship-plus">＋</span><strong>一处有意的破格</strong></div></div>`,'破格是否产生张力，要回到具体作品判断。'));
register('04','Taste Language\n+\nReference\n+\nChoice History',parts('taste-evidence','语言、参考与选择历史共同提供依据',['Taste Language','Reference','Choice History']));
registerFlow('04','first-three-layers','从描述差异，到确定方向',['Taste Language','Reference System','Art Direction']);
registerFlow('04','taste-in-creation','审美经验怎样参与创作',['Intent','Context','Taste','Direction','Generation','Judgment','Memory']);
for(const [i,from,to] of [[1,'Highly Polished','Natural Texture'],[2,'Symmetry','Asymmetry'],[3,'Digital','Physical'],[4,'Dense','Sparse'],[5,'Perfect','Imperfect']]){
  register('04',from+'\n↓\n'+to,`<div class="taste-shift" role="group" aria-label="一种可能的偏好变化"><span>${termHTML(from)}</span><span class="path-arrow" aria-hidden="true">→</span><span>${termHTML(to)}</span></div>`);
}
register('04','Composition\nDensity\nColor\nContrast\nTypography\nMaterial\nLighting\nRhythm\nImperfection\nEmotion\nCulture\nIdentity\nRelationship\nBoundary',
 parts('taste-vocabulary','沿着这些维度，寻找可以讨论的差异',['Composition','Density','Color','Contrast','Typography','Material','Lighting','Rhythm','Imperfection','Emotion','Culture','Identity','Relationship','Boundary'],'这是一张工作地图，未说清的感受也可以先留下。',''));

function tasteSpec(code) {
  const sections = code.split(/\n\n+/).slice(1);
  const keys = {'Cultural Reference':'文化参考',Avoid:'避免',Tension:'张力'};
  return frame('taste-spec','约定卡','Taste Spec · 审美约定 v0.1',`<dl class="taste-spec">${sections.map(section=>{const [keyLine,...lines]=section.split('\n');const key=keyLine.replace(/:$/,'');const values=lines.map(l=>l==='Low.'?'低信息密度。':l==='80% Order'?'80% 秩序（Order）':l==='20% Disruption'?'20% 打破秩序（Disruption）':l);return `<div${key==='Avoid'?' class="spec-boundary"':''}><dt><strong>${keys[key]||label(key)}</strong><small>${escape(key)}</small></dt><dd>${values.map(l=>`<span>${escape(l)}</span>`).join('')}</dd></div>`;}).join('')}</dl>`,'这是一份示意约定，需配合具体参考；当前任务可以修订这些默认选择。');
}

// Standalone relations in prose get the same reading treatment as fenced diagrams.
for(const article of ['01','02']) {
 text(article,article==='01'?'**Generation：1 → N**':'**Generation = 1 → N**',`<div class="reading-relation"><span>生成 · Generation</span><strong>一个意图</strong><i>→</i><strong>多个候选</strong><small>1 → N</small></div>`);
 text(article,article==='01'?'**Taste：N → 1**':'**Taste = N → 1**',`<div class="reading-relation"><span>判断 · Taste</span><strong>多个候选</strong><i>→</i><strong>确定的表达</strong><small>N → 1</small></div>`);
}
text('01','**AI 味 = 高完成度 × 低选择性**',frame('ai-flavor-relation','概念式','完成度可能掩盖选择不足',`<p class="concept-equation">AI 味 <span>=</span> 高完成度 <span>×</span> 低选择性</p>`,'这是对创作现象的提醒，不是能够计算分数的定律。'));
text('01','**Intent → Generate → Critique → Select → Edit → Refine**',flow('creation-choices','一次创作中的判断链',['Intent','Generate','Critique','Select','Edit','Refine']));
text('01','**1 → N → K → 1**',frame('candidate-narrowing','展开与收束','从一个意图，到一个完成的表达',`<ol class="count-path">${[['1','创作意图'],['N','多个候选'],['K','少数值得继续的方向'],['1','形成作品']].map(([n,s])=>`<li><b>${n}</b><span>${s}</span></li>`).join('')}</ol>`));
text('02','**Generation Capacity ↑ / Judgment Value ↑**',frame('judgment-value','条件性趋势','执行更容易获得，判断更可能成为瓶颈',`<div class="trend-pair"><div><strong>生成能力更易获得</strong><small>Generation Capacity ↑</small></div><span aria-hidden="true">→</span><div><strong>判断的价值更凸显</strong><small>Judgment Value ↑</small></div></div>`,'这表达一种条件性的趋势，不是可直接计算的定量规律。'));
text('02','**Taste Language → Reference System → Art Direction → Generation → Aesthetic Critic → Taste Memory**',flow('six-layer-overview','六层能力如何衔接',['Taste Language','Reference System','Art Direction','Generation','Aesthetic Critic','Taste Memory']));
text('03','**Generate → Judge → Choose → Remember → Generate Better**',flow('learning-cycle-summary','把每轮选择变成下一轮的经验',['Generate','Judge','Choose','Remember','Generate Better'],'“生成得更好”是需要检验的目标，不是运行循环后的必然结果。'));
text('03','**Context + Taste + Memory**',parts('context-taste-memory','让当前任务、判断与经验一起参与',['Context','Taste','Memory']));
text('03','**Beauty ≠ Contextual Judgment**',frame('beauty-context','区别','好看，与适合当前语境，是两种判断',`<p class="concept-equation">好看 <span>≠</span> 语境中的判断</p><p class="equation-original">Beauty ≠ Contextual Judgment</p>`));
text('05','Capture → Atomize → Annotate → Embed → Cluster → Retrieve → Assemble Candidates → Feedback → Version。',
 frame('reference-lifecycle','生命周期','四个阶段，九个动作',`<ol class="reference-lifecycle">${[['建库',[['保存','Capture'],['拆解','Atomize'],['标注','Annotate']]],['组织',[['表征','Embed'],['聚类','Cluster']]],['调用',[['检索','Retrieve'],['组织候选','Assemble Candidates']]],['进化',[['收集反馈','Feedback'],['更新版本','Version']]]].map(([phase,steps],i)=>`<li><span class="mono">0${i+1}</span><strong>${phase}</strong><ol>${steps.map(([zh,en])=>`<li><strong>${zh}</strong><small>${en}</small></li>`).join('')}</ol></li>`).join('')}</ol>`,'反馈只有影响下一次调用，才真正进入参考系统的经验。'));
text('05','**正例 + 近邻反例 + 选择理由 + 使用语境 + 职责与作用域 + 来源与权限 + 使用反馈。**',parts('reference-record','一条可复用的参考，应该留下什么',['正例','近邻反例','选择理由','使用语境','职责与作用域','来源与权限','使用反馈'],'',''));
text('05','**Taste Representation = Taste Language + Reference Evidence + Choice History**',parts('taste-representation','审美表示由三类依据共同构成',['Taste Language','Reference Evidence','Choice History'],'Taste Representation = Taste Language + Reference Evidence + Choice History'));
names['Direction Quality']='方向质量'; names['Generation Quality']='生成质量'; names['Judgment Quality']='判断质量';
text('06','**Output Quality ≠ Best Lucky Sample**  \n**Output Quality = Direction Quality × Generation Quality × Judgment Quality**',parts('output-quality','方向、生成与判断，共同影响作品质量',['Direction Quality','Generation Quality','Judgment Quality'],'作品质量不等于偶然命中的最好样本。这里的等号与乘号是比喻，没有定义可计算的质量函数。','×')+`<p class="equation-original">Output Quality ≠ Best Lucky Sample<br>Output Quality = Direction Quality × Generation Quality × Judgment Quality</p>`);
text('06','> Prompt → Generation → Selection → Revision',flow('generation-workflow','常见的生成工作流',['Prompt','Generation','Selection','Revision']));
text('06','> Intent → Direction Hypothesis → World → Anchor → Constraints → Reference Stack → Generation',flow('direction-workflow','生成之前，先明确关键选择',['Intent','Direction Hypothesis','World','Anchor','Constraints','Reference Stack','Generation']));

const inlineReplacements = {
 '01':[['Prompt → Generate → Done','写提示、生成，然后结束'],['**Generation → Creation → Taste**','**生成、创作与审美判断**']],
 '04':[['**Taste → Judgment → Direction**','**审美感受、具体判断与修改方向**']],
 '05':[
  ['**建库：Capture → Atomize → Annotate。**','**建库：保存、拆解、标注。**'],
  ['**组织：Embed → Cluster。**','**组织：表征、聚类。**'],
  ['**调用：Retrieve → Assemble Candidates。**','**调用：检索、组织候选。**'],
  ['**进化：Feedback → Version。**','**进化：收集反馈、更新版本。**'],
 ],
};
export function prepareReadingDiagrams(articleId, markdown) {
 let output=markdown;
 for(const [key,html] of textDiagrams){const [id,source]=[key.slice(0,2),key.slice(3)];if(id===articleId&&output.includes(source)){output=output.replace(source,html);diagramAudit.push({article:articleId,type:'prose-diagram',source});}}
 for(const [from,to] of inlineReplacements[articleId]||[]){if(output.includes(from)){output=output.replace(from,to);diagramAudit.push({article:articleId,type:'inline-label',source:from});}}
 return output;
}
export function additionalDiagram(articleId,code) {
 const source=norm(code.text);
 let result=codeDiagrams.get(articleId+'|'+source);
 if(articleId==='04'&&source.startsWith('TASTE SPEC / v0.1\n'))result=tasteSpec(source);
 if(result)diagramAudit.push({article:articleId,type:'code-diagram',source});
 return result||false;
}
