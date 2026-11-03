const test=require('node:test')
const assert=require('node:assert/strict')
const rules=require('../utils/markets')
const media=require('../utils/resources')
const engine=require('../utils/search')
const data=require('../utils/mock')

test('seven markets, stable cross-market selections and no invalid pairs',()=>{
 assert.equal(rules.MARKETS.length,7)
 assert.equal(rules.selection(['traffic:0','fluid:0','traffic:0','bad']).length,2)
 assert.equal(rules.pair('traffic','fluid:0'),null)
 assert.equal(rules.pair('traffic','traffic:1').segmentName,'新能源电池')
 assert.equal(rules.MARKETS.flatMap(m=>m.subs).length,41)
})
test('all video records and array fields display, duplicates/hidden/forbidden excluded',()=>{
 const p={videoFileUrls:['https://test/a.mp4'],resources:[{kind:'video',resourceFileUrl:['https://test/a.mp4','https://test/b.mp4']},{kind:'video',resourceFileUrl:'https://test/c.mp4'},{kind:'video',access:'staff',resourceFileUrl:'https://test/private.mp4'},{kind:'video',visible:false,resourceFileUrl:'https://test/hidden.mp4'}]}
 assert.deepEqual(media.videos(p,a=>a!=='staff').map(v=>v.src),['https://test/a.mp4','https://test/b.mp4','https://test/c.mp4'])
 assert.equal(media.videos({}).length,0)
 assert.deepEqual(media.urls('javascript:alert(1)'),[])
})
test('search includes body text, market/segment aliases and six groups',()=>{
 assert(engine.search(data,'新能源汽车动力电池')[0].count>0)
 assert(engine.matches('耐磨 修复',['高耐磨','金属修复']))
 const fixture={PRODUCTS:[{id:'p',name:'产品',intro:'独有正文',markets:['目标市场']}],APPS:[{id:'a',name:'应用',desc:'独有正文',access:'certified',articles:[{title:'推文',content:'独有正文'}],resources:[{kind:'video',title:'视频',summary:'独有正文',access:'staff'},{kind:'document',title:'文档',summary:'独有正文'}]}],COMPANY:[{id:'c',title:'公司',content:'独有正文'}]}
 const groups=engine.search(fixture,'独有正文')
 assert.deepEqual(groups.map(g=>g.count),[1,1,1,1,1,1])
 assert.equal(groups[3].list[0].access,'staff')
 assert.equal(engine.search(fixture,'目标市场')[0].count,1)
})
function page(name,user={role:'member'}){
 let config;global.Page=p=>config=p;const notices=[]
 global.wx={getStorageSync:()=>user,showToast:r=>notices.push(r),showModal:r=>notices.push(r)}
 const file=require.resolve('../pages/'+name+'/'+name);delete require.cache[file];require(file)
 const p={...config,data:structuredClone(config.data),notices,setData(values){for(const [path,value]of Object.entries(values)){const keys=path.split('.');let target=this.data;for(const key of keys.slice(0,-1))target=target[key]||(target[key]={});target[keys.at(-1)]=value}}}
 return p
}
test('consultation resets child selection, keeps contact and validates all three forms',()=>{
 const p=page('inquiry',{role:'member',name:'测试',industrySelections:[{segmentId:'traffic:0'}]});p.onLoad({})
 assert.equal(p.data.form.marketId,'')
 p.onMarket({detail:{value:0}});p.onSegment({detail:{value:0}});p.onMarket({detail:{value:1}})
 assert.equal(p.data.form.segmentId,'');assert.equal(p.data.form.name,'测试')
 for(let i=0;i<3;i++){p.pickTab({currentTarget:{dataset:{i}}});assert(p.data.fields.some(f=>f.key==='marketId'&&f.required));assert(p.data.fields.some(f=>f.key==='segmentId'&&f.required))}
 p.submit();assert.equal(p.notices.at(-1).title,'请选择市场和细分市场')
 p.onSegment({detail:{value:0}});Object.assign(p.data.form,{phone:'13800000000',company:'公司',email:'a@b.com',question:'咨询',agree:true});p.submit()
 assert.equal(p.lastPayload.marketId,'electronics');assert.equal(p.lastPayload.segmentId,'electronics:0');assert.match(p.notices.at(-1).content,/尚未发送/)
})
test('product category default is first real category and switches by brand',()=>{
 const p=page('products');p.onLoad({});assert(!p.data.series.includes('全部'));assert(p.data.list.every(x=>x.series===p.data.series[0]));p.pickBrand(1);assert(p.data.list.every(x=>x.brand===p.data.brand.id))
})
test('dealer requires segment and brands/products independently',()=>{
 const p=page('dealer');p.onLoad();p.submit();assert.match(p.notices.at(-1).title,/细分行业/)
 p.onIndustries({detail:{value:['traffic:0','electronics:0']}});Object.assign(p.data.form,{name:'测试',phone:'13800000000',title:'经理'});p.submit();assert.match(p.notices.at(-1).title,/品牌和产品/)
 p.data.form.brandsProducts='测试品牌 产品';p.submit();assert.equal(p.lastPayload.industrySelections.length,2)
})
test('supplementary product videos support multiple items, permissions and cross-section deduplication',()=>{
 const p={videos:[{src:'https://test/main.mp4'}],additionalVideos:[{title:'施工演示',src:'https://test/a.mp4'},{title:'维护',src:'https://test/b.mp4'},{src:'https://test/main.mp4'},{src:'https://test/hidden.mp4',visible:false},{src:'https://test/private.mp4',access:'staff'}]}
 const sections=media.productVideos(p,a=>a!=='staff')
 assert.equal(sections.primary.length,1);assert.deepEqual(sections.additional.map(v=>v.title),['施工演示','维护'])
})
test('application public summary never falls back to protected body',()=>{
 const preview=require('../utils/app-preview')
 assert(!preview.summary({desc:'保密正文'},'风能').includes('保密正文'))
 assert.equal(preview.summary({publicSummary:'公开简介',desc:'保密正文'}),'公开简介')
 assert.equal(preview.gate({role:'guest'}).role,'member')
 assert.equal(preview.gate({role:'member',certStatus:'pending'}).page,'member')
})
test('native application preview strips restricted content and refreshes after authentication',()=>{
 const user={role:'guest'};const p=page('app-detail',user);p.onLoad({id:data.APPS[0].id})
 assert.equal(p.data.restricted,true);assert.equal(p.data.app.desc,undefined);assert.deepEqual(p.data.videos,[]);assert.equal(p.data.gate.role,'member')
 user.role='member';p.onShow();assert.equal(p.data.gate.role,'certified')
 user.certStatus='pending';p.onShow();assert.equal(p.data.gate.page,'member')
 user.role='certified';user.certStatus='';p.onShow();assert.equal(p.data.restricted,false);assert.equal(p.data.app.desc,data.APPS[0].desc)
})

test('home library entries navigate to preview and clear old modal after returning',()=>{
 const p=page('index',{role:'guest'}),tabs=[];global.wx.switchTab=o=>tabs.push(o.url);p.onShow()
 for(const key of ['apps','products']){const i=p.data.modules.findIndex(m=>m.key===key);p.onModule({currentTarget:{dataset:{i}}});assert.equal(p.data.lock,null);assert.equal(tabs.at(-1),'/pages/'+key+'/'+key)}
 const i=p.data.modules.findIndex(m=>m.key==='inquiry');p.onModule({currentTarget:{dataset:{i}}});assert(p.data.lock);p.onShow();assert.equal(p.data.lock,null)
})
test('article visibility is consistent across legacy rows, resource rows and search',()=>{
 const can=a=>a!=='staff';const app={id:'a',access:'certified',articles:['旧推文',{title:'隐藏推文',visible:false},{title:'员工推文',access:'staff'}]}
 assert.deepEqual(media.articles(app,can).map(a=>a.title),['旧推文'])
 app.resources=[{kind:'article',title:'已下架推文',visible:false}]
 assert.deepEqual(media.articles(app,can),[]);assert.equal(engine.search({APPS:[app]},'推文')[2].count,0)
 app.resources=[{kind:'article',title:'公开推文',externalUrl:'https://test/article'}]
 assert.equal(media.articles(app,can)[0].url,'https://test/article')
 assert.equal(engine.search({APPS:[{id:'b',name:'应用',publicSummary:'公开关键词'}]},'公开关键词')[1].count,1)
})
