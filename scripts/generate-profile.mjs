// Install once with npm ci; regenerate with npm run generate.
// Or run from any directory: node scripts/generate-profile.mjs
// Content follows the owner’s README and portfolio; all SVG layouts are generated locally.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {animateBanner} from './animate-banner.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const assets=path.join(root,'assets');
const bannerTemplate=fs.readFileSync(path.join(assets,'banner-template.svg'),'utf8');
const font="-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif";
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
// Exact palette from liangqianxing/scripts/profile-style.mjs.
const themes={
 light:{bg:'#FBFCFD',panel:'#FFFFFF',line:'#D8E1EB',ink:'#1B2C44',text:'#40536B',muted:'#55687F',accent:'#325F99',secondary:'#276C75',tint:'#F0F4F8'},
 dark:{bg:'#121C2B',panel:'#172437',line:'#304056',ink:'#F0F4FA',text:'#C1CDDD',muted:'#A5B4C8',accent:'#9FBEED',secondary:'#9ED4D2',tint:'#172437'}
};
const text=(s,x,y,size,color,weight=400)=>`<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(s)}</text>`;
const rect=(x,y,w,h,rx,fill,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;
function svg(w,h,c,title,body,defs='',spaceBelow=0){return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h+spaceBelow}" viewBox="0 0 ${w} ${h+spaceBelow}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title><defs>${defs}</defs>${rect(1,1,w-2,h-2,20,c.bg,c.line)}${body}</svg>\n`;}
const files={};
function write(name,body,extension='svg'){const hash=createHash('sha256').update(body).digest('hex').slice(0,10);const file=`assets/${name}-${hash}.${extension}`;fs.writeFileSync(path.join(root,file),body);files[name]=file;return file;}
function header(theme,mobile){
 const c=themes[theme];
 let banner=bannerTemplate
  .replaceAll('Liu Mengxuan','Hank Huang')
  .replace('Systems, AI Infrastructure and Agents','Quality Engineering, Test Infrastructure and Agents')
  .replace('CEYLAN://SYSTEMS-LAB','GREYHY://QUALITY-LAB')
  .replace('Systems · AI Infra · Agents · Engineering','Quality · Test Infra · AI / Agent')
  .replace('building useful things from first principles','building reliable systems')
  .replace('>SYSTEMS<','>QUALITY<').replace('>AI INFRA<','>TEST INFRA<');
 // Resolve colors explicitly so GitHub picture sources work consistently in both themes.
 banner=banner.replace(/@media \(prefers-color-scheme: dark\) \{[\s\S]*?\n    \}/,'');
 const colors={'#f8fafc':c.bg,'#ecfeff':c.tint,'#f0fdfa':c.tint,'#0891b2':c.accent,'#14b8a6':c.secondary,'#22d3ee':c.secondary,'#0e7490':c.accent,'#0f172a':c.ink,'#475569':c.text,'#334155':c.text,'#0f766e':c.secondary,'#ffffff':c.panel,'#cbd5e1':c.line,'#f1f5f9':c.tint,'#cffafe':c.tint,'#ccfbf1':c.tint,'#06b6d4':c.accent};
 banner=banner.replace(/#[0-9a-fA-F]{6}/g,color=>colors[color]||color);
 if(mobile){
  const orbit=banner.slice(banner.lastIndexOf('  <g>'),banner.lastIndexOf('</svg>')).replace('<g>','<g transform="translate(-467 259) scale(.7)">');
  const defs=banner.match(/<defs>[\s\S]*?<\/defs>/)[0];
  const terminal=`${rect(20,20,400,230,18,c.panel,c.line)}${rect(21,21,398,40,17,c.tint)}<circle cx="40" cy="41" r="5" fill="#fb7185"/><circle cx="58" cy="41" r="5" fill="#fbbf24"/><circle cx="76" cy="41" r="5" fill="#34d399"/>${text('GREYHY://QUALITY-LAB',107,46,11,c.accent,700)}${text('$ whoami',40,100,15,c.accent,600)}${text('Hank Huang',40,145,34,c.ink,700)}${text('Quality · Test Infra · AI / Agent',40,181,16,c.text,500)}${text('→ building reliable systems',40,220,14,c.text,500)}`;
  banner=`<svg xmlns="http://www.w3.org/2000/svg" width="440" height="480" viewBox="0 0 440 480" role="img"><title>Hank Huang · Quality / Test Infra / AI Agent</title>${defs}<style>.orbit-label{font:700 13px ${font};fill:${c.secondary};letter-spacing:.5px}.core{font:800 28px ${font};fill:white;text-anchor:middle}</style>${rect(0,0,440,480,22,c.bg)}${terminal}${orbit}</svg>`;
 }
 return write(`profile-header-${mobile?'mobile-':''}${theme}`,banner);
}
const projects=[
 {id:'repo-fetcher',title:'Repository Fetcher',label:'TEST TOOLING / UTILITIES',lines:['面向大规模异步微服务的仓库拉取','并发执行、失败重试与可观测性'],tags:['Microservices','Concurrency','Observability'],href:"https://docs.hankhuang.top/Tech/multi-agent-code-review/%E6%A0%B8%E5%BF%83%E5%AE%9E%E7%8E%B0%EF%BC%9A%E5%BE%AE%E6%9C%8D%E5%8A%A1%E4%BB%93%E5%BA%93%E5%B9%B6%E5%8F%91%E6%8B%89%E5%8F%96%E3%80%81%E9%87%8D%E8%AF%95%E4%B8%8E%E5%8F%AF%E8%A7%82%E6%B5%8B%E6%80%A7",cta:'Read engineering notes',desc:'微服务仓库并发拉取工具'},
 {id:'agentops',title:'AgentOps',label:'AI APPLICATIONS / EVALUATION',lines:['AI 应用与 Agent 评测工作流','覆盖应用构建、评测与质量分析'],tags:['Agent','Evaluation','Quality'],href:'https://agentops.hankhuang.top/#carousel',cta:'Explore platform',desc:'AI 应用与评测平台'},
 {id:'agent-review',title:'Multi-Agent Review',label:'AGENT HARNESS / CODE REVIEW',lines:['面向异步微服务的代码审查','以多智能体协作支持工程分析'],tags:['Multi-Agent','Harness','Review'],href:'https://docs.hankhuang.top/Tech/multi-agent-code-review/overview',cta:'Read engineering notes',desc:'异步微服务的多智能体代码审查'},
 {id:'automation',title:'Hy AutoTest',label:'CROSS-PLATFORM / AUTOMATION',lines:['跨平台端到端自动化测试框架','从测试执行到持续集成的工程实践'],tags:['E2E','Automation','CI/CD'],href:'https://github.com/GreyHy/Hy-AutoTest-Framework',cta:'View repository',desc:'跨平台端到端自动化测试框架'},
 {id:'tcm',title:'TCM Platform',label:'TEST MANAGEMENT / COLLABORATION',lines:['用例组织、协作与测试执行','连接测试流程与质量分析'],tags:['Test cases','Execution','Analytics'],href:'https://hy-tcm.hankhuang.top/',cta:'Explore platform',desc:'测试用例管理与执行平台'},
 {id:'ai-cases',title:'AI Case Generator',label:'MCP / PLUGINS / SKILLS',lines:['通过 MCP、Plugins 与 Skills','将 AI 用例生成接入测试工作流'],tags:['MCP','Plugins','Skills'],href:'https://docs.hankhuang.top/Tech/tcm-case-management-ai-generation/ai-generation',cta:'Read engineering notes',desc:'MCP / Plugins / Skills 用例生成'},
 {id:'api-ui',title:'API & UI Automation',label:'TEST PLATFORMS / ENGINEERING',lines:['面向 API 与 UI 的自动化平台','将接口和界面测试纳入平台能力'],tags:['API','UI','Platform'],href:'https://docs.hankhuang.top/Tech/api-ui-automation/overview',cta:'Read engineering notes',desc:'API 与 UI 自动化平台'}
];
const projectGroups=[
 {title:'Projects I can build in Test Infrastructure & Quality Engineering',ids:['repo-fetcher','automation','tcm','api-ui']},
 {title:'Projects I can build in AI & Multi-Agent System',ids:['ai-cases','agent-review','agentops']}
];
const projectById=new Map(projects.map(project=>[project.id,project]));
const orderedProjects=projectGroups.flatMap(group=>group.ids.map(id=>projectById.get(id)));
function card(p,theme,mobile){const c=themes[theme],w=400,h=220;const body=`${rect(22,24,4,24,2,c.accent)}${text(p.label,36,40,mobile?11:10,c.accent,600)}${text(p.title,22,81,25,c.ink,700)}${p.lines.map((s,i)=>text(s,22,113+i*23,mobile?16:14,c.text)).join('')}${p.tags.map((s,i)=>{const x=22+p.tags.slice(0,i).reduce((n,t)=>n+t.length*6.3+23,0);return rect(x,152,s.length*6.3+17,24,7,c.tint)+text(s,x+8,168,11,c.accent,600);}).join('')}${text(p.cta,22,201,11,c.muted,500)}${text('↗',360,202,20,c.accent)}`;return write(`project-${p.id}-${mobile?'mobile-':''}${theme}`,svg(w,h,c,`${p.title} · ${p.desc}`,body,'',12));}
const practices=[{id:'quality',title:'Quality & Reliability',label:'BUSINESS / SYSTEMS',lines:['分布式与国际化系统的质量保障','围绕幂等、补偿和对账识别资损风险'],tags:['Risk','Reliability','Systems'],cta:'Explore Business',href:'https://hankhuang.top/#business',desc:'业务链路与资损防控'}, {id:'teams',title:'Teams & Growth',label:'MANAGEMENT / ENABLEMENT',lines:['质量体系、流程治理与人才培养','用能力雷达和实践规范支持团队成长'],tags:['Quality','Teams','Growth'],cta:'Explore Management',href:'https://hankhuang.top/#management',desc:'质量体系与团队建设'}];
const statusItems=[
 {id:'location',width:108,title:'深圳',detail:'',icon:'location'},
 {id:'shopee',width:228,title:'Shopee',detail:'测试开发工程师',brand:'shopee'},
 {id:'transwarp',width:282,title:'星环科技',detail:'自动化测试工程师',logo:'transwarp.svg'},
 {id:'education',width:346,title:'湘潭大学 · 软件工程',detail:'优秀毕业生 · 专业前20%',logo:'xiangtan-university.png'}
];
const statusIcons={
 location:'<path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/>',
 work:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18m-6 0v3H9v-3"/>',
 education:'<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v7c4 3 8 3 12 0v-7m4-2v8"/>'
};
function status(item,theme){
 const c=themes[theme],accent=item.id==='location'?c.accent:c.secondary;
 const logo=item.id==='transwarp'?`${rect(10,12,80,36,8,'#233F73')}<image href="data:image/svg+xml;base64,${fs.readFileSync(path.join(assets,'logos',item.logo)).toString('base64')}" x="15" y="17" width="70" height="26"/>`:item.logo?`<image href="data:image/${item.logo.endsWith('.svg')?'svg+xml':'png'};base64,${fs.readFileSync(path.join(assets,'logos',item.logo)).toString('base64')}" x="12" y="12" width="36" height="36"/>`:item.brand?brandIcon(item.brand,14,14,32,'#EE4D2D'):'';
 const body=`${rect(.5,.5,item.width-1,59,13,c.bg,c.line)}${logo}<g transform="translate(15 18)" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${statusIcons[item.icon]||''}</g>${text(item.title,item.id==='transwarp'?102:logo?62:54,item.detail?25:36,item.detail?16:17,c.ink,650)}${item.detail?text(item.detail,item.id==='transwarp'?102:logo?62:54,46,15,c.text,500):''}`;
 write(`profile-status-${item.id}-${theme}`,`<svg xmlns="http://www.w3.org/2000/svg" width="${item.width}" height="66" viewBox="0 0 ${item.width} 66" role="img"><title>${esc(item.title+(item.detail?' · '+item.detail:''))}</title>${body}</svg>\n`);
}
// Brand SVGs are vendored; generation and GitHub rendering need no external requests.
const brands={
 Selenium:['selenium','#43B02A'],Pytest:['pytest','#009FE3'],Jenkins:['jenkins','#D24939'],
 JMeter:['apachejmeter','#D22128'],Locust:['locust','#629C4D'],Playwright:['playwright'],Appium:['appium','#EE376D'],Docker:['docker','#2496ED'],Kubernetes:['kubernetes','#326CE5'],
 MCP:['modelcontextprotocol'],Python:['python','#3776AB'],Java:['java'],Go:['go','#00ADD8'],Linux:['linux'],MySQL:['mysql','#4479A1'],Redis:['redis','#FF4438'],Git:['git','#F05032'],
 Kafka:['apachekafka'],Vue:['vuedotjs','#42B883'],React:['react','#149ECA'],Prometheus:['prometheus','#E6522C'],Grafana:['grafana','#F46800'],OpenTelemetry:['opentelemetry'],Elasticsearch:['elasticsearch','#00A4AB'],ClickHouse:['clickhouse','#B59B00']
};
const concepts={
 'API / UI':'<rect x="2" y="3" width="20" height="17" rx="3"/><path d="M2 8h20m-14 4-3 2 3 2m8-4 3 2-3 2m-3-5-2 6"/>',
 Performance:'<path d="M3 19a10 10 0 1 1 18 0M12 13l5-6M6 8l1 1m-3 4h2m12 0h2"/><circle cx="12" cy="14" r="2"/>',
 'Multi-Agent':'<circle cx="12" cy="5" r="3"/><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="m10 8-3 7m7-7 3 7M8 18h8"/>',
 'Agent Harness':'<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4m-14-4 3 2-3 2m5 0h3"/>',
 RAG:'<ellipse cx="9" cy="5" rx="6" ry="3"/><path d="M3 5v12c0 3 12 3 12 0V5M3 11c3 3 9 3 12 0"/><circle cx="17" cy="15" r="4"/><path d="m20 18 3 3"/>',
 'Agent Eval':'<path d="M8 4H4v18h16V4h-4"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m8 13 3 3 6-7"/>',
 'Context Management':'<rect x="3" y="2" width="14" height="16" rx="2"/><path d="M7 6h6M7 10h6M7 14h3m-3 8h12a2 2 0 0 0 2-2V6"/>',
 '微服务':'<rect x="1" y="2" width="8" height="7" rx="2"/><rect x="15" y="2" width="8" height="7" rx="2"/><rect x="8" y="16" width="8" height="7" rx="2"/><path d="M5 9v4h14V9m-7 4v3"/>',
 eBPF:'<path d="m12 2 9 5v10l-9 5-9-5V7Z"/><path d="m6 13 4-5v8l4-8v8l4-5"/>'
};
function brandIcon(slug,x,y,size,color){
 const source=fs.readFileSync(path.join(assets,'tool-icons',slug+'.svg'),'utf8');
 const viewBox=source.match(/viewBox="([^"]+)"/)[1];
 const body=source.slice(source.indexOf('>')+1,source.lastIndexOf('</svg>')).replace(/<title>[\s\S]*?<\/title>/g,'');
 return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${viewBox}" fill="${color||'currentColor'}">${body}</svg>`;
}
function toolIcon(label,c){const brand=brands[label];return brand?`<g color="${c.ink}">${brandIcon(brand[0],11,9,20,brand[1]||c.ink)}</g>`:`<g transform="translate(10 8)" fill="none" stroke="${c.accent}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${concepts[label]}</g>`;}
const toolId=label=>label==='微服务'?'microservices':label.toLowerCase().replace(/[^a-z]+/g,'-');
const toolWidth=label=>Math.ceil([...label].reduce((n,ch)=>n+(/[\u3400-\u9fff]/.test(ch)?13:7.4),0)+51);
const groups=[
 ['Quality engineering',['Selenium','Pytest','Jenkins','JMeter','Locust','Playwright','Appium','Docker','Kubernetes','API / UI','Performance']],
 ['AI / Agent',['MCP','Multi-Agent','Agent Harness','RAG','Agent Eval','Context Management']],
 ['Languages & systems',['Python','Java','Go','Linux','MySQL','Redis','Git','微服务','Kafka','Vue','React']],
 ['Observability · 可观测',['Prometheus','Grafana','OpenTelemetry','eBPF','Elasticsearch','ClickHouse']]
];
for(const theme of ['light','dark']){
 for(const item of statusItems)status(item,theme);
 for(const mobile of [false,true]){header(theme,mobile);for(const p of [...projects,...practices])card(p,theme,mobile);}
 const c=themes[theme];
 for(const label of groups.flatMap(g=>g[1])){const w=toolWidth(label);write(`tool-${toolId(label)}-${theme}`,`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="44" viewBox="0 0 ${w} 44" role="img"><title>${esc(label)}</title>${rect(.5,.5,w-1,37,10,c.bg,c.line)}${toolIcon(label,c)}${text(label,40,24,12,c.text,500)}</svg>\n`);}
}
// One responsive SVG keeps Shenzhen and Shopee on the same row at narrow widths.
for(const theme of ['light','dark']){
 const location=fs.readFileSync(path.join(root,files['profile-status-location-'+theme]),'utf8');
 const shopee=fs.readFileSync(path.join(root,files['profile-status-shopee-'+theme]),'utf8').replace('<svg ','<svg x="114" ');
 write('profile-status-location-shopee-'+theme,`<svg xmlns="http://www.w3.org/2000/svg" width="342" height="66" viewBox="0 0 342 66" role="img"><title>深圳 · Shopee · 测试开发工程师</title>${location}${shopee}</svg>`);
}
for(const theme of ['light','dark'])for(const mobile of [false,true]){
 const base=`profile-header-${mobile?'mobile-':''}${theme}`;
 const source=fs.readFileSync(path.join(root,files[base]),'utf8');
 const gif=await animateBanner(source,themes[theme],mobile);
 write(base+'-animated',gif,'gif');
 console.log(`Animated ${base}: ${(gif.length/1024).toFixed(0)} KiB`);
}
function bannerPicture(){
 const variants=[['(max-width: 1100px) and (prefers-color-scheme: dark)','mobile-dark'],['(max-width: 1100px)','mobile-light'],['(prefers-color-scheme: dark)','dark']];
 const reduced=[...variants,['','light']].map(([media,key])=>`  <source media="(prefers-reduced-motion: reduce)${media?' and '+media:''}" srcset="${files['profile-header-'+key]}" />`);
 const animated=variants.map(([media,key])=>`  <source media="${media}" srcset="${files['profile-header-'+key+'-animated']}" />`);
 return `<picture>\n${[...reduced,...animated].join('\n')}\n  <img width="100%" src="${files['profile-header-light-animated']}" alt="Hank Huang / GreyHy · 质量工程、自动化与 AI Agent · terminal 动态介绍" />\n</picture>`;
}
function picture(base,alt,width='100%',mobile=true){return `<picture>\n${mobile?`  <source media="(max-width: 1100px) and (prefers-color-scheme: dark)" srcset="${files[base+'-mobile-dark']}" />\n  <source media="(max-width: 1100px)" srcset="${files[base+'-mobile-light']}" />\n`:''}  <source media="(prefers-color-scheme: dark)" srcset="${files[base+'-dark']}" />\n  <img width="${width}" src="${files[base+'-light']}" alt="${esc(alt)}" />\n</picture>`;}
function linkedCard(p){return `<a href="${p.href}">${picture('project-'+p.id,p.title+' · '+p.desc,'400')}</a>`;}
const readme=`<!-- Generated by node scripts/generate-profile.mjs. Edit content in that script, then regenerate. -->
${bannerPicture()}

<p align="center">
  <a href="https://hankhuang.top"><b>Blog ↗</b></a> &nbsp; · &nbsp;
  <a href="https://docs.hankhuang.top"><b>Engineering Notes ↗</b></a> &nbsp; · &nbsp;
  <a href="https://hankhuang.top/analytics/overview/"><b>Observability ↗</b></a> &nbsp; · &nbsp;
  <a href="https://hankhuang.top/?ask=1"><b>Personal Agent ↗</b></a>
</p>

你好，我是 **Hank Huang / GreyHy**，在深圳从事测试开发。这里记录我在**测试基础设施与质量工程**、**AI 与多智能体系统**中的项目与实践。

<p>
${picture('profile-status-location-shopee','深圳 · Shopee · 测试开发工程师','342',false)}
</p>

<p>
${statusItems.slice(2).map(item=>picture('profile-status-'+item.id,item.title+' · '+item.detail,String(item.width),false)).join('\n')}
</p>

### 01 / Projects · 项目实践

${projectGroups.map(group=>{
 const items=group.ids.map(id=>projectById.get(id));
 const rows=[];
 for(let i=0;i<items.length;i+=2)rows.push(`<p>\n${items.slice(i,i+2).map(linkedCard).join('\n')}\n</p>`);
 return `#### ${group.title}\n\n${rows.join('\n\n')}`;
}).join('\n\n')}

<details>
  <summary><b>展开项目文字版与入口</b></summary>

| 项目 | 方向 | 入口 |
| :--- | :--- | :--- |
${orderedProjects.map(p=>`| **${p.title}** | ${p.desc} | [${p.cta}](${p.href}) |`).join('\n')}


</details>

### 02 / Practice · 业务与团队

<p>
${practices.map(linkedCard).join('\n')}
</p>

从业务链路的风险识别、幂等与补偿校验，到质量规范和团队能力建设；AI / Agent 评测侧关注回归集、BadCase，以及规则评分、LLM Judge 与人工校准。

### 03 / Toolkit · 常用工具与技术方向

${groups.map(([title,tools])=>`**${title}**\n\n<p>\n${tools.map(label=>picture('tool-'+toolId(label),label,String(toolWidth(label)),false)).join('\n')}\n</p>`).join('\n\n')}

### 04 / Notes · 写作与思考

- [工程文档](https://docs.hankhuang.top)：记录测试平台、自动化与 AI / Agent 项目中的实现方法。
- [Thinking And Talk](https://hankhuang.top/#thinking)：关于工程实践、职业选择与 AI Agent 时代的成长。

<details>
  <summary><b>GitHub 活动与语言统计</b></summary>
  <br />
  <img width="100%" src="./github-metrics.svg" alt="GreyHy 的 GitHub 活动与语言统计，由仓库现有 Metrics 工作流更新" />
</details>

---

<p align="center">
  <sub>欢迎交流工程实践与项目合作：<a href="mailto:hank.huang.it@gmail.com">hank.huang.it@gmail.com</a></sub>
</p>
`;
fs.writeFileSync(path.join(root,'README.md'),readme);
// Remove only stale assets generated by this script, preserving existing repository assets.
const used=new Set(Object.values(files).map(f=>path.basename(f)));
for(const name of fs.readdirSync(assets))if(/^(profile-header-|profile-status-|project-(repo-fetcher|agentops|agent-review|automation|tcm|ai-cases|api-ui|quality|teams)-|tool-).*-[a-f0-9]{10}\.(?:svg|gif)$/.test(name)&&!used.has(name))fs.unlinkSync(path.join(assets,name));
console.log(`Generated README and ${used.size} theme-aware assets (SVG + GIF).`);
