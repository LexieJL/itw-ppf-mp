// Offline renderer tests: no browser, external SDK, network or live backend writes.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm')
function loadPreview(){
 const elements=new Map(),events={}
 const element=()=>({innerHTML:'',textContent:'',scrollTop:0,classList:{toggle(){},add(){}},style:{},appendChild(){}})
 const document={getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)},querySelector:s=>s==='.status'?element():null,querySelectorAll:()=>[],addEventListener:(name,fn)=>{(events[name]||=[]).push(fn)},documentElement:element()}
 const context=vm.createContext({document,console,URLSearchParams,location:{search:''},setInterval(){},setTimeout(){},clearTimeout(){},matchMedia:()=>({matches:false})});context.window=context
 const html=fs.readFileSync(require('node:path').join(__dirname,'../preview.html'),'utf8')
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1])
 for(let code of scripts){code=code.replace('  syncIndustriesFromCloudBase();\n})();','  window.testAPI={PAGES,S,APPS,PRODUCTS,INDUSTRIES,go,frame,marketSingleHtml,marketMultiHtml,saveDraft,restoreDraft,syncIndustriesFromCloudBase};\n})();');vm.runInContext(code,context)}
 return {context,api:context.testAPI,elements,events}
}
test('all preview page render functions execute across four roles',()=>{
 const {api}=loadPreview();const failures=[]
 for(const role of ['guest','member','certified','staff']){api.S.user={role};for(const [name,P]of Object.entries(api.PAGES)){try{const f=api.frame(name,{});const html=P.render.call(P,f.ps,f.q);assert.equal(typeof html,'string')}catch(e){failures.push(role+'/'+name+': '+e.message)}}}
 assert.deepEqual(failures,[])
})
test('all consultation tabs render two selectors and preserve original application field',()=>{
 const {api}=loadPreview();const P=api.PAGES.inquiry
 for(let tab=0;tab<3;tab++){const html=P.render({tab,prov:'',city:'',marketId:'traffic',segmentId:'traffic:1'},{});assert.match(html,/name="marketId"/);assert.match(html,/name="segmentId"/);assert.match(html,/value="traffic:1" selected/);if(tab!==1)assert.match(html,/name="app"/)}
 assert.match(api.marketMultiHtml(['traffic:0','fluid:0']),/交通／乘用车/)
 assert.match(api.marketMultiHtml(['traffic:0','fluid:0']),/流体／轨道交通/)
})
test('preview displays all associated videos and no duplicate product consultation card',()=>{
 const {api}=loadPreview();api.S.user={role:'certified'}
 const a=api.APPS[0];a.resources=[{kind:'video',resourceFileUrl:['https://test/a.mp4','https://test/b.mp4']},{kind:'video',resourceFileUrl:['https://test/c.mp4']}]
 const html=api.PAGES['app-detail'].render({}, {id:a.id});assert.equal((html.match(/<video /g)||[]).length,3)
 const p=api.PAGES['product-detail'].render({}, {id:api.PRODUCTS[0].id});assert(!p.includes('data-go="inquiry"'));assert(!p.includes('<video'))
 api.S.user={role:'guest'};assert(!api.PAGES['app-detail'].render({}, {id:a.id}).includes('<video'))
})
test('draft restore retains checkboxes, inputs and changed market',()=>{
 const {api,context}=loadPreview();let els=[{name:'name',value:'张三',type:'text'},{name:'agree',checked:true,type:'checkbox'},{name:'marketId',value:'traffic',type:'select-one'}];const form={id:'inqform',elements:els};context.document.querySelector=()=>form
 const f={ps:{}};api.saveDraft(f);els[0].value='';els[1].checked=false;els[2].value='fluid';api.restoreDraft(f)
 assert.equal(els[0].value,'张三');assert.equal(els[1].checked,true);assert.equal(els[2].value,'fluid')
})
test('search rendering covers industry aliases and body text without runtime errors',()=>{
 const {api}=loadPreview();api.S.user={role:'member'};const html=api.PAGES.search.results({kw:'新能源汽车动力电池'});assert.match(html,/产品/);assert(!html.includes('没有找到'))
})
test('cloud resource loading reads every page and keeps all video URLs',async()=>{
 const {api,context}=loadPreview();const calls=[]
 const industry={_id:'industry1',code:'transportation',name:'交通'}
 const category={_id:'cat1',industry:'industry1',code:'traffic-passenger',name:'乘用车'}
 const application={_id:'app1',code:'live-app',applicationCategory:'cat1',name:'云应用',videoFile:['https://test/main1.mp4','https://test/main2.mp4']}
 const resources=Array.from({length:101},(_,i)=>({_id:'resource'+i,application:'app1',title:'视频'+i,resourceKind:'video',resourceFile:['https://test/'+i+'a.mp4','https://test/'+i+'b.mp4']}))
 const model=(name,rows)=>({list:async({pageNumber,pageSize})=>{calls.push([name,pageNumber]);return {data:{records:rows.slice((pageNumber-1)*pageSize,pageNumber*pageSize)}}}})
 context.cloudbase={init:()=>({models:{industries:model('industries',[industry]),application_categories:model('categories',[category]),applications:model('applications',[application]),application_resources:model('resources',resources)}})}
 await api.syncIndustriesFromCloudBase()
 assert(calls.some(([name,page])=>name==='resources'&&page===2))
 assert.equal(api.APPS.length,1);assert.equal(api.APPS[0].resources.length,101)
 api.S.user={role:'certified'};const html=api.PAGES['app-detail'].render({},{id:'live-app'})
 assert.equal((html.match(/<video /g)||[]).length,204)
})
