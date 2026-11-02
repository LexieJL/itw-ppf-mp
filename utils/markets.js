// 表单分类来自《小程序demo 修改》第8页。ID独立于应用目录的历史分类ID。
const MARKETS = [
 ['traffic','交通',['乘用车','新能源电池','汽车电子','商用车','轨道交通','复合材料']],
 ['electronics','电子',['笔记本电脑/台式机','智能手机','智能穿戴','电源','安防','电梯']],
 ['auto','汽车后市场',['空调清洁','轮胎修补包','汽车美容','汽车添加剂','雨刮']],
 ['heavy','重工',['火力发电厂','钢厂','矿山行业','石油化工','水泥厂','通用维保']],
 ['fluid','流体',['轨道交通','航空航天','食品行业','设备制造','重工业','港口码头','通用维保','脱模剂应用']],
 ['wind','风能',['复合材料','维修与保养','海上基础灌浆','陆地基础灌浆']],
 ['marine','船舶',['集装箱船','散货船','油船','海工船','海洋平台','LPG/LNG船舶']]
].map(([id,name,subs]) => ({id,name,subs:subs.map((name,i)=>({id:id+':'+i,name}))}))
function selection(ids) {
 const selected = new Set(Array.isArray(ids) ? ids : [])
 return MARKETS.flatMap(m=>m.subs.filter(s=>selected.has(s.id)).map(s=>({marketId:m.id,marketName:m.name,segmentId:s.id,segmentName:s.name})))
}
function pair(marketId,segmentId) { return selection([segmentId]).find(s=>s.marketId===marketId) || null }
module.exports = { MARKETS, selection, pair }
