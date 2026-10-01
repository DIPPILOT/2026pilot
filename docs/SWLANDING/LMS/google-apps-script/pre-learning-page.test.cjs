const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../docs/shared/pre-learning-log.js'),'utf8');
function run(url,{expired=false,time='2026-10-01T12:00:00+09:00'}={}) {
  const loc=new URL(url,'https://example.com');
  let calls=[],redirect='',events={},ready,mutation,step=0;
  class Clock extends Date { constructor(...args){super(...(args.length?args:[time]));} static now(){return new Date(time).getTime();} }
  const card={getAttribute:()=>String(step),querySelector:()=>({textContent:'Task '+(step+1)})};
  const context={Date:Clock,URLSearchParams,console,MutationObserver:class {constructor(fn){mutation=fn;} observe(){}},
    window:{location:{pathname:loc.pathname,search:loc.search,replace:p=>redirect=p},addEventListener:(name,fn)=>events[name]=fn,LMS_CURRICULUM:{1:{skills:[{title:'Skill 1'}],missions:[{title:'Mission 1'}]}}},
    document:{readyState:'loading',title:'Task title | LMS',querySelector:s=>s==='.step-card.active'?card:{},addEventListener:(name,fn)=>{assert.equal(name,'DOMContentLoaded');ready=fn;}},
    localStorage:{getItem:()=>JSON.stringify({expiresAt:Clock.now()+(expired?-1:1000),value:JSON.stringify({studentId:'TEST'})}),removeItem:()=>{}},
    sessionStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},navigator:{userAgent:'test'},
    fetch:(url,options)=>{calls.push(options.body);return Promise.resolve({ok:true,json:()=>({ok:true})});}
  };
  vm.runInNewContext(source,context); if(ready)ready();
  return {calls,get redirect(){return redirect;},switchTo:n=>{step=n;mutation();},restore:()=>events.pageshow({persisted:true})};
}
for(let day=2;day<=10;day++)for(const suffix of ['1','2','3','mission1','mission2']) {
  const file=`day${day}/day${day}-ai-codex-${suffix}.html`;
  const r=run('/docs/'+file);
  assert.equal(r.calls.length,1);assert.equal(r.calls[0].get('missionId'),`DAY${day}-${suffix.startsWith('mission')?'MISSION'+suffix.slice(7):'TASK'+suffix}`);
  assert.equal((fs.readFileSync(path.join(__dirname,'../docs',file),'utf8').match(/src="\.\.\/shared\/pre-learning-log.js"/g)||[]).length,1);
}
for(const type of ['skill','mission']) {
  const url='/docs/shared/learning-lab.html?day=1&type='+type+'&id=1';
  const r=run(url); assert.equal(r.calls.length,1); assert.equal(r.calls[0].get('missionId'),'DAY1-'+type.toUpperCase()+'1');
  assert.equal(r.calls[0].get('pagePath'),url);
  r.restore();assert.equal(r.calls.length,2);
  const e=run(url,{expired:true});assert.equal(e.calls.length,0);assert.equal(e.redirect,'../login/login.html');
  for(const [time,count] of [['2026-10-02T17:59:59+09:00',1],['2026-10-02T18:00:00+09:00',0],['2026-10-02T22:00:00+09:00',1],['2026-10-03T09:00:00+09:00',0],['2026-10-03T18:00:00+09:00',1]])assert.equal(run(url,{time}).calls.length,count);
}
const day1=run('/docs/day1/day1-ai-codex.html?step=0');
day1.switchTo(0);assert.equal(day1.calls.length,1);
day1.switchTo(2);assert.equal(day1.calls[1].get('missionId'),'DAY1-TASK3');
day1.switchTo(0);assert.equal(day1.calls.length,3);
assert.equal(run('/docs/shared/learning-lab.html?day=1&type=skill&id=99').calls.length,0);
for(let day=1;day<=10;day++) {
  assert.equal(run(`/docs/day${day}/day${day}-ai-classroom.html`).calls.length,0);
  assert.ok(!fs.readFileSync(path.join(__dirname,`../docs/day${day}/day${day}-ai-classroom.html`),'utf8').includes('pre-learning-log.js'));
}
console.log('PASS: 45 standalone pages, skill/mission page load, Day 1 view transitions, no card logging, session expiry, KST boundaries, BFCache restoration');
