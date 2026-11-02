// 公开摘要单独配置，不截取受限正文作为游客预览。
function summary(app, context='') {
 const plain=String(app.publicSummary||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()
 return plain ? plain.slice(0,120)+(plain.length>120?'…':'') : (context ? context+'相关应用。' : '')+'浏览应用概览，认证后查看完整方案和相关资料。'
}
function gate(user,access='certified') {
 if(user.role==='guest')return {title:'想了解这个应用的解决方案？',text:'注册会员，继续探索应用库。完整方案、视频和文档需完成身份认证后查看。',button:'注册会员',role:'member'}
 if(access==='staff')return {title:'此资料仅供 ITW PPF 员工查看',text:'请使用员工身份完成验证。',button:'员工身份验证',role:'staff'}
 if(user.certStatus==='pending')return {title:'认证申请审核中',text:'审核期间可继续浏览公开概览，通过后即可查看完整方案和资料。',button:'查看认证状态',page:'member'}
 return {title:'认证后查看完整应用方案',text:'你已注册会员。完成身份认证后，可查看此应用的详细方案、视频和文档。',button:'申请身份认证',role:'certified'}
}
module.exports={summary,gate}
