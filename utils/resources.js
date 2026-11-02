// 将单个地址、数组和云端媒体对象展开，避免只读取第一条。
function urls(value) {
 if (!value) return []
 if (Array.isArray(value)) return value.flatMap(urls)
 if (typeof value==='string') { const s=value.trim(); if (/^[\[{]/.test(s)) {try{return urls(JSON.parse(s))}catch(_){return []}} return /^https?:\/\//i.test(s)?[s]:[] }
 return urls(value.tempFileURL||value.download_url||value.url||value.src||value.value||'')
}
function videos(item,can=()=>true) {
 const rows=[]
 const add=(r)=>{ if(r.visible===false||!can(r.access))return; urls(r.src||r.resourceFileUrl||r.videoFileUrl||r.url).forEach(src=>rows.push({id:r.id||src,title:r.title||'视频',src,poster:r.poster||r.coverImageUrl||''})) }
 ;(item.resources||[]).filter(r=>r.kind==='video').forEach(add)
 ;(Array.isArray(item.videos)?item.videos:[]).forEach(v=>add(typeof v==='string'?{src:v}:v))
 urls(item.videoFileUrls||item.videoFileUrl||item.videoUrl).forEach(src=>add({src,poster:item.videoCoverUrl}))
 const seen=new Set();return rows.filter(r=>{if(seen.has(r.src))return false;seen.add(r.src);return true}).map((r,i)=>({...r,id:r.id+'-'+i}))
}
function articles(item,can=()=>true) {
 const resources=(item.resources||[]).filter(r=>r.kind==='article'&&r.visible!==false&&can(r.access))
 const rows=resources.length?resources:(item.articles||[])
 return rows.filter(r=>typeof r==='object').map((r,i)=>({...r,id:r.id||'article-'+i,url:urls(r.externalUrl||r.resourceFileUrl||r.url)[0]||''}))
}
function documents(item,can=()=>true) {return (item.resources||[]).filter(r=>['single_page','document','doc','pdf'].includes(r.kind)&&r.visible!==false&&can(r.access)).map((r,i)=>({...r,id:r.id||'doc-'+i,url:urls(r.resourceFileUrl||r.externalUrl||r.url)[0]||''}))}
// 产品主视频与正文末尾的补充视频分开配置，两个区域不重复播放同一地址。
function productVideos(item,can=()=>true) {
 const primary=videos(item,can)
 const existing=new Set(primary.map(v=>v.src))
 const additional=videos({videos:item.additionalVideos||[]},can).filter(v=>!existing.has(v.src))
 return {primary,additional}
}
module.exports={urls,videos,articles,documents,productVideos}
