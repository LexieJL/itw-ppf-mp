const auth = require('../../utils/auth')
const cms = require('../../utils/cms')
const mock = require('../../utils/mock')
const link = require('../../utils/link')

// 通用页面：按后台配置的控件列表渲染，新增页面只需在后台加一条配置
Page({
  data: { page: null, blocks: [], lock: null },

  onLoad(q) {
    const page = cms.PAGES[q.id]
    if (!page) return wx.showToast({ title: '页面不存在或已下架', icon: 'none' })
    wx.setNavigationBarTitle({ title: page.title })
    const blocks = page.blocks.map(b => b.type === 'products'
      ? Object.assign({}, b, { list: b.ids.map(mock.findProduct).filter(Boolean) })
      : b)
    this.setData({ page, blocks })
  },

  onShow() { if (this.data.page) this.setData({ lock: auth.lockFor(this.data.page.access) }) },

  onLink(e) { link.open(e.currentTarget.dataset.link) },
  toProduct(e) { wx.navigateTo({ url: '/pages/product-detail/product-detail?id=' + e.currentTarget.dataset.id }) },
  toDoc(e) { wx.navigateTo({ url: '/pages/kb-doc/kb-doc?id=' + e.currentTarget.dataset.id }) },

  onShareAppMessage() { return { title: this.data.page.title, path: '/pages/custom/custom?id=' + this.options.id } }
})
