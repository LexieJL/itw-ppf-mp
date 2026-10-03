// 运营后台（CMS）配置：首页 Banner、首页模块、自定义页面都是数据，改这里不用改页面代码、不用重新提审。
// 正式版这些数据存在 CloudBase，由运营在后台用预制控件新增、排序、隐藏、设置跳转和权限。
// access：public 所有人 / registered 已注册 / certified 认证会员和员工
const ARTICLE_URL = 'https://mp.weixin.qq.com/'

const HOME = {
  banners: [
    { id: 'b1', title: '新品发布｜Devcon 高性能修补剂', sub: '金属修复 · 耐磨防护 · 快速固化', bg: 'linear-gradient(120deg,#5e0022 0%,#8A1538 55%,#b3264f 100%)', link: { type: 'article', url: ARTICLE_URL } },
    { id: 'b2', title: '行业方案｜风电叶片维修全流程', sub: '从现场检测到修复验收', bg: 'linear-gradient(120deg,#2b1d24 0%,#5b1830 55%,#8A1538 100%)', link: { type: 'article', url: ARTICLE_URL } },
    { id: 'b3', title: '活动专题｜2026 技术交流会报名中', sub: '11月18日 · 苏州', bg: 'linear-gradient(120deg,#6c0a2c 0%,#a8325e 60%,#c75a7c 100%)', link: { type: 'custom', id: 'event2026' } }
  ],
  // icon 对应 images/icons/<icon>.svg；color 主色、tint 浅底色
  modules: [
    { key: 'apps', name: '应用库', sub: '按行业查找应用方案', icon: 'apps', color: '#8A1538', tint: '#f8e6ec', access: 'registered', visible: true, link: { type: 'tab', url: '/pages/apps/apps' } },
    { key: 'products', name: '产品库', sub: '品牌 · 系列 · 规格', icon: 'products', color: '#a8325e', tint: '#f9e9ef', access: 'registered', visible: true, link: { type: 'tab', url: '/pages/products/products' } },
    { key: 'kb', name: '专属知识库', sub: '公司介绍 · 产品培训', icon: 'kb', color: '#5b1830', tint: '#f2e6ea', access: 'registered', visible: true, link: { type: 'page', url: '/pages/kb/kb' } },
    { key: 'inquiry', name: '需求咨询', sub: '样品 · 上门 · 问询', icon: 'inquiry', color: '#c2185b', tint: '#fbe7ef', access: 'registered', visible: true, link: { type: 'page', url: '/pages/inquiry/inquiry' } },
    { key: 'dealer', name: '成为经销商', sub: '提交代理申请', icon: 'dealer', color: '#7b3f55', tint: '#f3e9ed', access: 'registered', visible: true, link: { type: 'page', url: '/pages/dealer/dealer' } },
    // 工业电商：ITW 提供的京东、天猫店铺链接（ITW外部链接.docx），汇总在通用页 mall
    { key: 'mall', name: '工业电商', sub: '在线选购', icon: 'mall', color: '#2e7d32', tint: '#e7f3e8', access: 'public', visible: true, badge: '外部商城', badgeType: 'ext', link: { type: 'custom', id: 'mall' } },
    // 以下两个是 PPT 首页第二屏“未来可以增加更多模块”的示例
    { key: 'faq', name: '常见问题库', sub: '检索 · 分类 · 提问', icon: 'faq', color: '#6d4c41', tint: '#f1ebe8', access: 'registered', visible: true, badge: '新增示例', badgeType: 'new', link: { type: 'page', url: '/pages/faq/faq' } },
    { key: 'event', name: '活动专题', sub: '后台用控件搭建的页面', icon: 'event', color: '#455a64', tint: '#e9eef0', access: 'public', visible: true, badge: '新增示例', badgeType: 'new', link: { type: 'custom', id: 'event2026' } }
  ]
}

// 自定义页面：由预制控件（blocks）组成，运营可新增页面、调整控件顺序、配置按钮跳转
// 控件类型：image 图片 / text 图文 / video 视频 / products 产品卡片 / pdf PDF手册 / entries 入口宫格 / button 按钮
// ITW 外部链接（来源：ITW外部链接.docx，均可在 itwppfasia 官网二级菜单找到）
// 小程序不能直接打开外部网站：web 类型默认复制链接，提示用户到浏览器打开；
// 官网如在小程序后台配置为业务域名，可把 webview 改为 true，用小程序内的网页打开
const LINKS = {
  site: { type: 'web', name: 'ITW PPF 官网', url: 'https://www.itwppfasia.com/cn/', webview: false },
  jobs: { type: 'web', name: 'ITW（中国）前程无忧官方招聘网', url: 'https://itw.51job.com/postList.html?typeId=5' },
  mallIndustrialJd: { type: 'web', name: '工业品商城（京东）', url: 'https://mall.jd.com/index-1000377827.html?from=pc' },
  mallAutoTmall: { type: 'web', name: '汽车养护品商城（天猫）', url: 'https://wynnsqijuyongpin.tmall.com/index.htm?spm=a1z10.1-b.w5002-26003437453.2.521c773ahpEFGM' },
  mallAutoJd: { type: 'web', name: '汽车养护品商城（京东）', url: 'https://mall.jd.com/index-1000129942.html?from=pc' }
}

// 会员中心「关于 ITW」入口
const ABOUT = [
  { name: 'ITW PPF 官网', sub: 'www.itwppfasia.com', link: LINKS.site },
  { name: '加入我们', sub: 'ITW（中国）前程无忧官方招聘', link: LINKS.jobs }
]

const PAGES = {
  mall: {
    title: '工业电商', access: 'public',
    blocks: [
      { type: 'text', title: 'ITW PPF 官方网店', body: '以下店铺在京东、天猫平台，点击后复制店铺链接，请在浏览器或对应 App 中打开。' },
      { type: 'entries', title: '工业品商城', items: [
        { name: '京东旗舰店', link: LINKS.mallIndustrialJd }
      ] },
      { type: 'entries', title: '汽车养护品商城', items: [
        { name: '天猫旗舰店', link: LINKS.mallAutoTmall },
        { name: '京东旗舰店', link: LINKS.mallAutoJd }
      ] }
    ]
  },
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

module.exports = { HOME, PAGES, LINKS, ABOUT }
