// Run from any directory: node scripts/generate-profile.mjs
// Content follows the owner’s README and portfolio; all SVG layouts are generated locally.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const assets=path.join(root,'assets');
const art=fs.readFileSync(path.join(assets,'profile-art.webp')).toString('base64');
const font="-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif";
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const themes={light:{bg:'#fffcf8',panel:'#fff',line:'#e9dfd3',ink:'#263344',text:'#566477',muted:'#788293',accent:'#b95119',tint:'#fff0df'},dark:{bg:'#151c26',panel:'#1b2532',line:'#334151',ink:'#f0f4f8',text:'#bbc8d8',muted:'#93a5ba',accent:'#ffb46c',tint:'#342a25'}};
const text=(s,x,y,size,color,weight=400)=>`<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(s)}</text>`;
const rect=(x,y,w,h,rx,fill,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;
function svg(w,h,c,title,body,defs='',spaceBelow=0){return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h+spaceBelow}" viewBox="0 0 ${w} ${h+spaceBelow}" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title><defs>${defs}</defs>${rect(1,1,w-2,h-2,20,c.bg,c.line)}${body}</svg>\n`;}
const files={};
function write(name,body){const hash=createHash('sha256').update(body).digest('hex').slice(0,10);const file=`assets/${name}-${hash}.svg`;fs.writeFileSync(path.join(root,file),body);files[name]=file;return file;}
function header(theme,mobile){const c=themes[theme],w=mobile?440:880,h=mobile?374:300;const artX=mobile?294:596,artY=mobile?24:28,artSize=mobile?118:240;
const body=`<path d="M30 0H${w-30}" stroke="${c.accent}" stroke-width="3"/>${text('HANK HUANG / GREYHY',30,45,mobile?12:13,c.accent,700)}${text('Build with quality.',30,mobile?198:112,mobile?31:38,c.ink,700)}${text('Think in systems.',30,mobile?238:159,mobile?31:38,c.ink,700)}${text('质量工程 · 自动化 · AI / Agent',30,mobile?282:204,mobile?16:18,c.text,500)}${text('从测试基础设施到智能体评测',30,mobile?311:234,mobile?14:15,c.muted)}${text('Shenzhen, China  /  hankhuang.top',30,mobile?346:270,12,c.muted)}<g><image x="${artX}" y="${artY}" width="${artSize}" height="${artSize}" clip-path="url(#art)" xlink:href="data:image/webp;base64,${art}"/>${rect(artX,artY,artSize,artSize,mobile?24:30,'none',c.line)}</g>`;
return write(`profile-header-${mobile?'mobile-':''}${theme}`,svg(w,h,c,'Hank Huang · 质量工程 / 自动化 / AI Agent',body,`<clipPath id="art">${rect(artX,artY,artSize,artSize,mobile?24:30,'#fff')}</clipPath>`));}
const projects=[
 {id:'agentops',title:'AgentOps',label:'AI APPLICATIONS / EVALUATION',lines:['AI 应用与 Agent 评测工作流','覆盖应用构建、评测与质量分析'],tags:['Agent','Evaluation','Quality'],href:'https://agentops.hankhuang.top/#carousel',cta:'Explore platform',desc:'AI 应用与评测平台'},
 {id:'agent-review',title:'Multi-Agent Review',label:'AGENT HARNESS / CODE REVIEW',lines:['面向异步微服务的代码审查','以多智能体协作支持工程分析'],tags:['Multi-Agent','Harness','Review'],href:'https://docs.hankhuang.top/Tech/multi-agent-code-review/overview',cta:'Read engineering notes',desc:'异步微服务的多智能体代码审查'},
 {id:'automation',title:'Hy AutoTest',label:'CROSS-PLATFORM / AUTOMATION',lines:['跨平台端到端自动化测试框架','从测试执行到持续集成的工程实践'],tags:['E2E','Automation','CI/CD'],href:'https://github.com/GreyHy/Hy-AutoTest-Framework',cta:'View repository',desc:'跨平台端到端自动化测试框架'},
 {id:'tcm',title:'TCM Platform',label:'TEST MANAGEMENT / AI GENERATION',lines:['测试用例管理与 AI 辅助生成','把用例组织和生成工作流连接起来'],tags:['Test cases','AI','Workflow'],href:'https://hy-tcm.hankhuang.top/',cta:'Explore platform',desc:'测试用例管理与 AI 辅助生成'},
 {id:'ai-cases',title:'AI Case Generator',label:'MCP / PLUGINS / SKILLS',lines:['通过 MCP、Plugins 与 Skills','将 AI 用例生成接入测试工作流'],tags:['MCP','Plugins','Skills'],href:'https://docs.hankhuang.top/Tech/tcm-case-management-ai-generation/ai-generation',cta:'Read engineering notes',desc:'MCP / Plugins / Skills 用例生成'},
 {id:'api-ui',title:'API & UI Automation',label:'TEST PLATFORMS / ENGINEERING',lines:['面向 API 与 UI 的自动化平台','将接口和界面测试纳入平台能力'],tags:['API','UI','Platform'],href:'https://docs.hankhuang.top/Tech/api-ui-automation/overview',cta:'Read engineering notes',desc:'API 与 UI 自动化平台'}
];
function card(p,theme,mobile){const c=themes[theme],w=400,h=220;const body=`${rect(22,24,4,24,2,c.accent)}${text(p.label,36,40,mobile?11:10,c.accent,600)}${text(p.title,22,81,25,c.ink,700)}${p.lines.map((s,i)=>text(s,22,113+i*23,mobile?16:14,c.text)).join('')}${p.tags.map((s,i)=>{const x=22+p.tags.slice(0,i).reduce((n,t)=>n+t.length*6.3+23,0);return rect(x,152,s.length*6.3+17,24,7,c.tint)+text(s,x+8,168,11,c.accent,600);}).join('')}${text(p.cta,22,201,11,c.muted,500)}${text('↗',360,202,20,c.accent)}`;return write(`project-${p.id}-${mobile?'mobile-':''}${theme}`,svg(w,h,c,`${p.title} · ${p.desc}`,body,'',12));}
const practices=[{id:'quality',title:'Quality & Reliability',label:'BUSINESS / SYSTEMS',lines:['分布式与国际化系统的质量保障','围绕幂等、补偿和对账识别资损风险'],tags:['Risk','Reliability','Systems'],cta:'Explore Business',href:'https://hankhuang.top/#business',desc:'业务链路与资损防控'}, {id:'teams',title:'Teams & Growth',label:'MANAGEMENT / ENABLEMENT',lines:['质量体系、流程治理与人才培养','用能力雷达和实践规范支持团队成长'],tags:['Quality','Teams','Growth'],cta:'Explore Management',href:'https://hankhuang.top/#management',desc:'质量体系与团队建设'}];
const groups=[['Quality engineering',['Selenium','Pytest','Jenkins','API / UI','Performance']],['AI / Agent',['MCP','Multi-Agent','Agent Harness','RAG','Agent Eval']],['Languages & systems',['Python','Java','Go','Linux','MySQL','Redis','Elasticsearch','Git']]];
for(const theme of ['light','dark']){
 for(const mobile of [false,true]){header(theme,mobile);for(const p of [...projects,...practices])card(p,theme,mobile);}
 const c=themes[theme];
 for(const label of groups.flatMap(g=>g[1])){const w=Math.round(label.length*7.1+34);write(`tool-${label.toLowerCase().replace(/[^a-z]+/g,'-')}-${theme}`,svg(w,32,c,label,`<circle cx="13" cy="16" r="3" fill="${c.accent}"/>${text(label,23,21,12,c.text,500)}`));}
}
function picture(base,alt,width='100%',mobile=true){return `<picture>\n${mobile?`  <source media="(max-width: 1100px) and (prefers-color-scheme: dark)" srcset="${files[base+'-mobile-dark']}" />\n  <source media="(max-width: 1100px)" srcset="${files[base+'-mobile-light']}" />\n`:''}  <source media="(prefers-color-scheme: dark)" srcset="${files[base+'-dark']}" />\n  <img width="${width}" src="${files[base+'-light']}" alt="${esc(alt)}" />\n</picture>`;}
function linkedCard(p){return `<a href="${p.href}">${picture('project-'+p.id,p.title+' · '+p.desc,'400')}</a>`;}
const readme=`<!-- Generated by node scripts/generate-profile.mjs. Edit content in that script, then regenerate. -->
${picture('profile-header','Hank Huang / GreyHy · 质量工程、自动化与 AI Agent')}

<p align="center">
  <a href="https://hankhuang.top"><b>Portfolio ↗</b></a> &nbsp; · &nbsp;
  <a href="https://docs.hankhuang.top"><b>Engineering Notes ↗</b></a> &nbsp; · &nbsp;
  <a href="https://github.com/GreyHy?tab=repositories"><b>Repositories ↗</b></a> &nbsp; · &nbsp;
  <a href="mailto:hank.huang.it@gmail.com"><b>Email ↗</b></a>
</p>

你好，我是 **Hank Huang / GreyHy**，目前在 **深圳，中国**。我关注质量工程与工程效能，围绕测试基础设施、跨平台自动化，以及 AI / Agent 评测与可靠性开展实践，并在[个人网站](https://hankhuang.top)与[工程文档](https://docs.hankhuang.top)中记录项目和思考。

### 01 / Projects · 项目实践

**AI / Agent**

<p>
${projects.slice(0,2).map(linkedCard).join('\n')}
</p>

**Test platforms & automation**

<p>
${projects.slice(2,4).map(linkedCard).join('\n')}
</p>
<p>
${projects.slice(4,6).map(linkedCard).join('\n')}
</p>

<details>
  <summary><b>展开项目文字版与入口</b></summary>

| 项目 | 方向 | 入口 |
| :--- | :--- | :--- |
${projects.map(p=>`| **${p.title}** | ${p.desc} | [${p.cta}](${p.href}) |`).join('\n')}
| CampusBBS | Spring Boot 项目 | [Repository](https://github.com/GreyHy/CampusBBS-SpringBoot-) |

项目卡片分别链接到可访问的平台、公开仓库或工程文档；更多项目可见 [Portfolio](https://hankhuang.top/#projects)。

</details>

### 02 / Practice · 业务与团队

<p>
${practices.map(linkedCard).join('\n')}
</p>

我关注业务链路中的风险识别与质量保障，也整理质量体系、团队能力建设与工程规范的实践。在 AI / Agent 评测中，重点关注回归集与 BadCase、分级质量指标，以及规则评分、LLM Judge 和人工校准的配合。

### 03 / Toolkit · 常用工具与技术方向

${groups.map(([title,tools])=>`**${title}**\n\n<p>\n${tools.map(label=>picture('tool-'+label.toLowerCase().replace(/[^a-z]+/g,'-'),label,String(Math.round(label.length*7.1+34)),false)).join('\n')}\n</p>`).join('\n\n')}

### 04 / Notes · 写作与思考

- [工程文档](https://docs.hankhuang.top)：记录测试平台、自动化与 AI / Agent 项目中的实现方法。
- [Thinking And Talk](https://hankhuang.top/#thinking)：关于工程实践、职业选择与 AI Agent 时代的成长。
- [Management](https://hankhuang.top/#management)：质量体系、团队能力评估与人才培养。

<details>
  <summary><b>GitHub 活动与语言统计</b></summary>
  <br />
  <img width="100%" src="./github-metrics.svg" alt="GreyHy 的 GitHub 活动与语言统计，由仓库现有 Metrics 工作流更新" />
</details>

---

<p align="center">
  <b>Quality engineering · Test infrastructure · AI / Agent</b><br />
  <sub>欢迎交流工程实践与项目合作：<a href="mailto:hank.huang.it@gmail.com">hank.huang.it@gmail.com</a></sub>
</p>
`;
fs.writeFileSync(path.join(root,'README.md'),readme);
// Remove only stale assets generated by this script, preserving existing repository assets.
const used=new Set(Object.values(files).map(f=>path.basename(f)));
for(const name of fs.readdirSync(assets))if(/^(profile-header-|project-(agentops|agent-review|automation|tcm|ai-cases|api-ui|quality|teams)-|tool-).*-[a-f0-9]{10}\.svg$/.test(name)&&!used.has(name))fs.unlinkSync(path.join(assets,name));
console.log(`Generated README and ${used.size} theme-aware SVG assets.`);
