const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

const LIMIT = 20

Page({
  data: { keyword: '', groups: [], total: 0, hots: ['Devcon', '得复康', '润滑油', '风能', '手册'] },

  onInput(e) { this.search(e.detail.value.trim()) },
  useHot(e) { this.search(e.currentTarget.dataset.k) },

  search(keyword) {
    if (!keyword) return this.setData({ keyword, groups: [], total: 0 })
    const k = keyword.toLowerCase()
    const hit = s => s.toLowerCase().includes(k)
    const crumb = (indId, subId) => mock.industryOf(indId).name + (subId ? ' > ' + mock.subOf(subId).name : ' > 行业通用')
    const groups = [
      { name: '应用', list: mock.APPS.filter(a => hit(crumb(a.industryId, a.subId) + a.name))
        .map(a => ({ title: a.name, sub: crumb(a.industryId, a.subId), url: '/pages/app-detail/app-detail?id=' + a.id, locked: !auth.can(a.access) })) },
      { name: '产品', list: mock.PRODUCTS.filter(p => hit(p.name + p.code + p.brandName + mock.findBrand(p.brand).cn + p.series))
        .map(p => ({ title: p.name, sub: p.brandName + ' > ' + p.series, url: '/pages/product-detail/product-detail?id=' + p.id, locked: !auth.can(p.access) })) },
      { name: '视频', list: mock.VIDEOS.filter(v => hit(crumb(v.industryId, v.subId) + v.title + v.kind))
        .map(v => ({ title: v.title + '（' + v.kind + '）', sub: crumb(v.industryId, v.subId), url: '/pages/kb-video/kb-video?id=' + v.id, locked: !auth.can(v.access) })) },
      { name: '文档', list: mock.DOCS.filter(d => hit(d.title + d.docType))
        .map(d => ({ title: d.title, sub: '产品培训 > 文档 > ' + d.docType, url: '/pages/kb-doc/kb-doc?id=' + d.id, locked: !auth.can(d.access) })) }
    ]
    const total = groups.reduce((n, g) => n + g.list.length, 0)
    groups.forEach(g => { g.count = g.list.length; g.list = g.list.slice(0, LIMIT) })
    this.setData({ keyword, groups, total })
  },

  open(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
