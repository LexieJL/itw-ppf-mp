// 运营后台（CMS）配置：首页 Banner、首页模块、自定义页面都是数据，改这里不用改页面代码、不用重新提审。
// 正式版这些数据存在 CloudBase，由运营在后台用预制控件新增、排序、隐藏、设置跳转和权限。
// access：public 所有人 / registered 已注册 / certified 认证会员和员工
const ARTICLE_URL = 'https://mp.weixin.qq.com/'

const HOME = {
  banners: [
    { id: 'b1', title: '新品发布｜Devcon 高性能修补剂', sub: '金属修复 · 耐磨防护 · 快速固化', bg: 'linear-gradient(120deg,#5e0022 0%,#8B0033 55%,#b3264f 100%)', link: { type: 'article', url: ARTICLE_URL } },
    { id: 'b2', title: '行业方案｜风电叶片维修全流程', sub: '从现场检测到修复验收', bg: 'linear-gradient(120deg,#2b1d24 0%,#5b1830 55%,#8B0033 100%)', link: { type: 'article', url: ARTICLE_URL } },
    { id: 'b3', title: '活动专题｜2026 技术交流会报名中', sub: '11月18日 · 苏州', bg: 'linear-gradient(120deg,#6c0a2c 0%,#a8325e 60%,#c75a7c 100%)', link: { type: 'custom', id: 'event2026' } }
  ],
  // icon 对应 images/icons/<icon>.svg；color 主色、tint 浅底色
  modules: [
    { key: 'apps', name: '应用库', sub: '按行业查找应用方案', icon: 'apps', color: '#8B0033', tint: '#f8e6ec', access: 'registered', visible: true, link: { type: 'tab', url: '/pages/apps/apps' } },
    { key: 'products', name: '产品库', sub: '品牌 · 系列 · 规格', icon: 'products', color: '#a8325e', tint: '#f9e9ef', access: 'registered', visible: true, link: { type: 'tab', url: '/pages/products/products' } },
    { key: 'kb', name: '专属知识库', sub: '公司介绍 · 产品培训', icon: 'kb', color: '#5b1830', tint: '#f2e6ea', access: 'registered', visible: true, link: { type: 'page', url: '/pages/kb/kb' } },
    { key: 'inquiry', name: '需求咨询', sub: '样品 · 上门 · 问询', icon: 'inquiry', color: '#c2185b', tint: '#fbe7ef', access: 'registered', visible: true, link: { type: 'page', url: '/pages/inquiry/inquiry' } },
    { key: 'dealer', name: '成为经销商', sub: '提交代理申请', icon: 'dealer', color: '#7b3f55', tint: '#f3e9ed', access: 'registered', visible: true, link: { type: 'page', url: '/pages/dealer/dealer' } },
    // 工业电商的小程序 AppID 待 ITW 提供
    { key: 'mall', name: '工业电商', sub: '在线选购', icon: 'mall', color: '#2e7d32', tint: '#e7f3e8', access: 'public', visible: true, badge: '外部商城', badgeType: 'ext', link: { type: 'miniprogram', appId: '', name: '工业电商' } },
    // 以下两个是 PPT 首页第二屏“未来可以增加更多模块”的示例
    { key: 'faq', name: '常见问题库', sub: '检索 · 分类 · 提问', icon: 'faq', color: '#6d4c41', tint: '#f1ebe8', access: 'registered', visible: true, badge: '新增示例', badgeType: 'new', link: { type: 'page', url: '/pages/faq/faq' } },
    { key: 'event', name: '活动专题', sub: '后台用控件搭建的页面', icon: 'event', color: '#455a64', tint: '#e9eef0', access: 'public', visible: true, badge: '新增示例', badgeType: 'new', link: { type: 'custom', id: 'event2026' } }
  ]
}

// 自定义页面：由预制控件（blocks）组成，运营可新增页面、调整控件顺序、配置按钮跳转
// 控件类型：image 图片 / text 图文 / video 视频 / products 产品卡片 / pdf PDF手册 / entries 入口宫格 / button 按钮
const PAGES = {
  event2026: {
    title: '2026 技术交流会', access: 'public',
    blocks: [
      { type: 'image', label: '活动主视觉', height: 340, link: null },
      { type: 'text', title: '2026 ITW PPF 技术交流会', body: '时间：2026年11月18日\n地点：苏州\n内容：新品发布、行业应用案例分享、现场施工演示（测试内容）。' },
      { type: 'entries', title: '快速入口', items: [
        { name: '风能方案', link: { type: 'tab', url: '/pages/apps/apps' } },
        { name: '产品库', link: { type: 'tab', url: '/pages/products/products' } },
        { name: '往期回顾', link: { type: 'article', url: ARTICLE_URL } }
      ] },
      { type: 'video', title: '往届活动回顾' },
      { type: 'products', title: '活动推荐产品', ids: ['p131', 'p132', 'p1', 'p29'] },
      { type: 'pdf', title: '活动日程（PDF）', docId: 'wind-0-d0' },
      { type: 'button', text: '立即报名', link: { type: 'page', url: '/pages/inquiry/inquiry?tab=2' } }
    ]
  }
}

module.exports = { HOME, PAGES }
