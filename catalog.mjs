export const articles = [
 ['AI FLAVOR','为什么总有一股 AI 味？','从熟悉的完成度中，重新看见缺席的选择。','问题与方法'],
 ['GENERATION · CREATION · TASTE','当生成不再稀缺','生成、创作与判断，怎样影响我们留下什么。','问题与方法'],
 ['AESTHETIC STACK','我们能把审美工程化吗？','把描述、参考、方向、生成、评审与记忆接起来。','问题与方法'],
 ['TASTE LANGUAGE','我们到底该如何描述审美？','把“感觉不对”，变成可以讨论的具体差异。','六层能力'],
 ['REFERENCE SYSTEM','让参考成为有依据的选择','说明借什么、不借什么，让图片带着职责进入创作。','六层能力'],
 ['ART DIRECTION','在生成之前，确定方向','明确本轮目标、优先级，以及允许探索的边界。','六层能力'],
 ['GENERATION PROTOCOL','让每一轮生成带来信息','围绕一个问题组织候选，比较、修正，也学会停止。','六层能力'],
 ['AESTHETIC CRITIC','让 AI 帮你作出判断','区分观察与解释，让建议有证据，也有保护范围。','六层能力'],
 ['TASTE MEMORY','让经验进入下一次创作','保存选择发生的条件，让记忆跟得上人的变化。','六层能力'],
 ['BRAND TASTE','让 AI 理解一个品牌','在不同场景中延续立场，也为新表达留下位置。','品牌与协作'],
 ['COLLECTIVE JUDGMENT','一支团队如何共同判断？','把分歧落到作品，把依据带进交接。','品牌与协作'],
 ['BEYOND THE FRAMEWORK','审美工程的边界','当系统越来越懂你，怎样继续接触陌生的经验。','边界与未来']
].map((x,i)=>({id:String(i+1).padStart(2,'0'),term:x[0],title:x[1],summary:x[2],group:x[3]}));
export const layers=[
 {label:'审美语言',en:'Taste Language',verb:'描述',question:'怎样把感觉说清楚？',detail:'从构图、层级与元素关系中指出差异，让下一次修改有具体的落点。',result:'留下：一份能被讨论的审美描述',id:'04'},
 {label:'参考系统',en:'Reference System',verb:'参照',question:'这张图，究竟借什么？',detail:'为每张参考说明职责、使用语境与边界，保存支持选择的正例和近邻反例。',result:'留下：一组有职责的参考证据',id:'05'},
 {label:'艺术指导',en:'Art Direction',verb:'定向',question:'这次最重要的是什么？',detail:'把目标变成方向假设，约定哪些固定、哪些开放，遇到冲突时优先保护什么。',result:'留下：本轮的方向与优先级',id:'06'},
 {label:'生成协议',en:'Generation Protocol',verb:'探索',question:'这一轮，要解决什么问题？',detail:'组织可以比较的候选，记录实际输出，决定继续生成、局部编辑、回退或停止。',result:'留下：带着问题的一组候选',id:'07'},
 {label:'审美评审',en:'Aesthetic Critic',verb:'判断',question:'为什么留下这一版？',detail:'回到作品核对证据，给出有条件的选择和修改建议，同时保护已经成立的部分。',result:'留下：选择理由与修改范围',id:'08'},
 {label:'审美记忆',en:'Taste Memory',verb:'积累',question:'什么经验值得带到下一次？',detail:'把经历、偏好假设与当前约定分开保存，让过去帮助现在，也允许新的要求改变默认。',result:'留下：可以复用、可以更新的经验',id:'09'}
];
