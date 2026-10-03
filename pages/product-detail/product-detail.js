const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

Page({
  data: { p: null, b: null, crumb: '', lock: null, favItem: null, consultUrl: '' },

  onLoad(q) {
    const p = mock.findProduct(q.id) || mock.PRODUCTS[0]
    const b = mock.findBrand(p.brand)
    const crumb = [p.brandName, p.series, p.name].join(' > ')
    this.setData({
      p, b, crumb,
      favItem: { type: 'product', id: p.id, title: p.name, sub: crumb, url: '/pages/product-detail/product-detail?id=' + p.id },
      consultUrl: '/pages/inquiry/inquiry?tab=0&product=' + p.id
    })
  },

  onShow() { this.setData({ lock: auth.lockFor(this.data.p.access) }) },
  toConsult() { wx.navigateTo({ url: this.data.consultUrl }) },
  onShareAppMessage() { return { title: this.data.p.brandName + ' ' + this.data.p.name, path: '/pages/product-detail/product-detail?id=' + this.data.p.id } }
})
