// 测试数据：结构即后台（CloudBase）需要配置的数据结构，正式资料由 ITW 在运营后台上传
const ARTICLE_URL = 'https://mp.weixin.qq.com/'

// 七大行业及细分领域：Jiayuan 2026-10-03 提供的表格（左侧固定栏 = 行业，上方滑动栏 = 细分领域）
const INDUSTRIES = [
  { id: 'traffic', name: '交通', subs: ['乘用车', '新能源动力电池', '汽车电子', '商用车', '轨道交通'] },
  { id: 'electronics', name: '电子', subs: ['笔记本电脑/台式机', '智能手机', '智能穿戴', '安防', '电梯', '电源'] },
  { id: 'auto', name: '汽车后市场', subs: ['空调清洁', '轮胎修补包', '汽车美容', '汽车添加剂', '雨刮'] },
  { id: 'heavy', name: '重工', subs: ['火力发电厂', '钢厂', '矿山行业', '石油化工', '水泥厂', '通用维保'] },
  { id: 'fluid', name: '流体', subs: ['轨道交通', '航空航天', '工业维修与保养', '脱模剂应用'] },
  { id: 'wind', name: '风能', subs: ['复合材料', '维修与保养', '海上基础灌浆', '陆地基础灌浆'] },
  { id: 'marine', name: '船舶', subs: ['环氧垫片', 'LPG/LNG船舶'] }
].map(ind => ({
  id: ind.id,
  name: ind.name,
  subs: ind.subs.map((name, i) => ({
    id: ind.id + '-' + i,
    name,
    desc: ind.name + ' · ' + name + '：总体应用文字描述。这里介绍该细分领域的典型工况、常见问题和 ITW PPF 的整体解决思路（测试内容）。'
  }))
}))

const APPS = []
const DOCS = []
const VIDEOS = []
const DOC_TYPES = ['手册', '单页', 'ACH', '其他']
INDUSTRIES.forEach(ind => ind.subs.forEach(sub => {
  DOC_TYPES.forEach((t, i) => DOCS.push({
    id: sub.id + '-d' + i, industryId: ind.id, subId: sub.id, docType: t,
    title: sub.name + t, pages: 4, access: 'certified'
  }))
  for (let i = 1; i <= 4; i++) {
    VIDEOS.push({
      id: sub.id + '-v' + i, industryId: ind.id, subId: sub.id,
      title: '视频' + i, kind: i % 2 ? 'SOP视频' : 'VR视频',
      desc: sub.name + '相关培训视频' + i + '的文字描述（测试内容）。', access: 'certified'
    })
    APPS.push({
      id: sub.id + '-a' + i, industryId: ind.id, subId: sub.id,
      name: '应用' + i,
      desc: sub.name + '应用' + i + '：应用文字描述，说明使用场景、施工要点和效果（测试内容）。',
      articles: [
        { title: '案例｜' + sub.name + '应用' + i + '现场实录', url: ARTICLE_URL },
        { title: '技术解读｜如何选择合适的胶粘方案', url: ARTICLE_URL },
        { title: '客户故事｜效率提升 30% 的秘密', url: ARTICLE_URL }
      ],
      singlePageDocId: sub.id + '-d1',
      achDocId: sub.id + '-d2',
      access: 'certified'
    })
  }
}))

// 品牌与产品：来自 ITW 的 【4国语言翻译】模版-小程序用2.xlsx（utils/catalog.js 自动生成）
const catalog = require('./catalog')
const BRANDS = catalog.BRANDS.map(b => Object.assign({}, b, {
  count: catalog.PRODUCTS.filter(p => p.brand === b.id).length
}))
const brandOf = id => BRANDS.find(b => b.id === id)
const PRODUCTS = catalog.PRODUCTS.map(p => Object.assign({}, p, {
  brandName: brandOf(p.brand).name,
  code: p.skus.map(s => s.code).filter(Boolean).join(' / '),
  access: 'registered'
}))

// 市场对应的资料（xlsx「市场对应的资料」表）：按行业挂在知识库，所有细分领域都能看到；PDF 由 ITW 另行打包
// 表里的“市场”与七大行业的对应关系是默认做法，待 ITW 确认
const MARKET_DOCS = {
  traffic: ['交通运输行业产品手册'],
  electronics: ['【视频】笔记本电脑行业胶粘剂解决方案', '【视频】手机行业胶粘剂解决方案', 'OEM电子行业产品手册'],
  auto: ['赢驰快修产品手册', '赢驰专业渠道产品手册', '轮胎修补包产品介绍', 'QMI产品手册', 'Slime轮胎修补包'],
  heavy: ['工业维修产品'],
  fluid: ['MRO工业维修和保养', '工业脱模剂', '微量润滑技术', '维修保养润滑解决方案'],
  wind: ['海上基础灌浆解决方案'],
  marine: ['船舶制造和维修解决方案', '衬垫解决方案']
}

const marketDocs = []
const marketVideos = []
Object.keys(MARKET_DOCS).forEach(indId => MARKET_DOCS[indId].forEach((title, i) => {
  const isVideo = title.startsWith('【视频】')
  const item = { id: indId + '-m' + i, industryId: indId, subId: '', access: 'certified' }
  if (isVideo) marketVideos.push(Object.assign(item, { title: title.replace('【视频】', ''), kind: '解决方案视频', desc: title + '（ITW 提供的资料清单，视频待上传）' }))
  else marketDocs.push(Object.assign(item, { title, docType: '手册', pages: 2 }))
}))
DOCS.unshift.apply(DOCS, marketDocs)
VIDEOS.unshift.apply(VIDEOS, marketVideos)

const COMPANY = [1, 2, 3, 4].map(i => ({
  id: 'c' + i, title: '公司介绍' + i,
  summary: ['集团概况', '品牌历史', '全球布局', '服务网络'][i - 1],
  content: '内容内容内容。这里是公司介绍' + i + '的图文内容，由运营人员在后台用富文本编辑器上传，并选择查看权限（测试内容）。',
  access: 'certified'
}))

// 常见问题库（首页新增模块示例）
const FAQ_CATEGORIES = ['产品选型', '施工工艺', '储存与安全', '售后服务']
const FAQ = [
  ['产品选型', '金属磨损修复应该选哪类修补剂？', '一般选用钢质或铝质填充的环氧修补剂，按基材和工作温度选择型号（测试内容）。'],
  ['产品选型', '修补后的部位能承受多高温度？', '常规型号可耐 120℃ 左右，高温型号可达 200℃ 以上，具体以产品技术资料为准（测试内容）。'],
  ['产品选型', '湿表面或油污表面可以直接施工吗？', '建议先清洁除油；部分型号支持潮湿表面施工（测试内容）。'],
  ['施工工艺', '表面处理需要做到什么程度？', '建议喷砂或打磨至露出金属本色，并用清洗剂除油（测试内容）。'],
  ['施工工艺', '双组分产品怎么混合？', '按包装标注的重量或体积比例充分混合至颜色均匀，在适用期内用完（测试内容）。'],
  ['施工工艺', '低温环境下固化变慢怎么办？', '可适当加热施工部位，或选用低温固化型号（测试内容）。'],
  ['储存与安全', '产品保质期多久？', '未开封常温储存一般为 24 个月，以包装标注为准（测试内容）。'],
  ['储存与安全', '施工时需要哪些防护？', '佩戴手套和护目镜，保持通风，详见安全技术说明书（测试内容）。'],
  ['售后服务', '可以申请技术人员上门指导吗？', '可以，在“需求咨询”中选择“上门申请”提交（测试内容）。'],
  ['售后服务', '如何获取样品？', '在“需求咨询”中选择“样品资料申请”提交（测试内容）。']
].map((f, i) => ({ id: 'q' + i, category: f[0], q: f[1], a: f[2] }))

const find = (arr, id) => arr.find(x => x.id === id)
const industryOf = id => find(INDUSTRIES, id)
const subOf = id => {
  for (const ind of INDUSTRIES) { const s = find(ind.subs, id); if (s) return s }
  return null
}

module.exports = {
  ARTICLE_URL, INDUSTRIES, APPS, DOCS, VIDEOS, DOC_TYPES,
  BRANDS, PRODUCTS, COMPANY, FAQ, FAQ_CATEGORIES,
  findApp: id => find(APPS, id),
  findProduct: id => find(PRODUCTS, id),
  findBrand: brandOf,
  // 行业级资料（subId 为空）在该行业的每个细分领域都显示
  inSub: (x, sub) => x.subId === sub.id || (!x.subId && sub.id.indexOf(x.industryId + '-') === 0),
  findDoc: id => find(DOCS, id),
  findVideo: id => find(VIDEOS, id),
  findCompany: id => find(COMPANY, id),
  industryOf, subOf
}
