// 只索引页面文本/资源元数据，不抓取附件、外部推文或视频内部内容。
function text(value) {if(Array.isArray(value))return value.map(text).join(' ');if(value&&typeof value==='object')return Object.values(value).map(text).join(' ');return String(value==null?'':value)}
function normalize(value) {return text(value).replace(/<[^>]*>/g,' ').toLowerCase().replace(/新能源汽车动力电池|新能源动力电池/g,'新能源电池').replace(/\s+/g,' ').trim()}
function matches(keyword,values) {const q=normalize(keyword);const hay=normalize(values);return !!q&&q.split(' ').every(t=>hay.includes(t))}
function productText(p,brand={}) {return [p.name,p.code,p.brandName,brand.name,brand.cn,p.series,p.intro,p.usage,p.description,p.content,p.markets,p.fields,p.skus]}
function search(data,keyword) {
 const groups=['产品','应用方案','推文','视频','文档','知识库'].map(name=>({name,list:[]}))
 const level={public:0,registered:1,certified:2,staff:3}
 const stricter=(a,b)=>(level[a||'public']||0)>=(level[b||'public']||0)?a||'public':b
 const add=(type,item,values,title,sub,page,id,access)=>{if(matches(keyword,values))groups[type].list.push({title,sub,page,id:id||item.id,access:access||item.access||'public'})}
 const context=x=>{const ind=x.ind||(data.INDUSTRIES||[]).find(i=>i.id===x.industryId); const sub=x.sub||(ind&&ind.subs.find(s=>s.id===x.subId));return [ind&&ind.name,sub&&sub.name].filter(Boolean).join(' > ')}
 ;(data.PRODUCTS||[]).forEach(p=>add(0,p,productText(p,(data.BRANDS||[]).find(b=>b.id===p.brand)),p.name,[p.brandName,p.series].join(' > '),'product-detail'))
 ;(data.APPS||[]).forEach(a=>{
  const c=context(a);add(1,a,[c,a.name,a.desc,a.summary,a.publicSummary,a.content],a.name,c,'app-detail')
  const allResources=a.resources||[]
  const resources=allResources.filter(r=>r.visible!==false)
  const articleRows=allResources.some(r=>r.kind==='article')?resources.filter(r=>r.kind==='article'):(a.articles||[])
  articleRows.forEach(r=>{if(typeof r==='string')r={title:r};if(r.visible===false)return;add(2,r,[c,r.title,r.summary,r.content],r.title,c,'app-detail',a.id,stricter(a.access,r.access))})
  resources.filter(r=>['video','document','doc','pdf','single_page'].includes(r.kind)).forEach(r=>add(r.kind==='video'?3:4,r,[c,r.title,r.summary,r.content],r.title,c,'app-detail',a.id,stricter(a.access,r.access)))
 })
 ;(data.VIDEOS||[]).forEach(v=>add(3,v,[context(v),v.title,v.kind,v.desc,v.summary,v.content],v.title,context(v),'kb-video'))
 ;(data.DOCS||[]).forEach(d=>add(4,d,[context(d),d.title,d.docType,d.summary,d.description,d.content],d.title,context(d),'kb-doc'))
 ;(data.COMPANY||[]).forEach(c=>add(5,c,[c.title,c.summary,c.content],c.title,'公司介绍','kb-article'))
 ;(data.FAQ||[]).forEach(f=>add(5,f,[f.category,f.q,f.a],f.q,f.category,'faq'))
 return groups.map(g=>({...g,count:g.list.length}))
}
module.exports={search,matches,productText}
