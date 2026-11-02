const auth = require('../../utils/auth')
const mock = require('../../utils/mock')
const media = require('../../utils/resources')

Page({
  data: { p: null, b: null, crumb: '', lock: null, favItem: null, consultUrl: '' },

  onLoad(q) {
    const p = mock.findProduct(q.id) || mock.PRODUCTS[0]
    const b = mock.findBrand(p.brand)
    const crumb = [p.brandName, p.series, p.name].join(' > ')
    this.setData({
      videos: media.productVideos(p, auth.can).primary,
      additionalVideos: media.productVideos(p, auth.can).additional,
      p, b, crumb,
      favItem: { type: 'product', id: p.id, title: p.name, sub: crumb, url: '/pages/product-detail/product-detail?id=' + p.id },
      consultUrl: '/pages/inquiry/inquiry?tab=0&product=' + p.id
    })
  },

  onShow() { this.setData({ lock: auth.lockFor(this.data.p.access), videos:media.productVideos(this.data.p,auth.can).primary, additionalVideos:media.productVideos(this.data.p,auth.can).additional }) },
  toConsult() { wx.navigateTo({ url: this.data.consultUrl }) },
  onVideoError() { wx.showToast({title:'视频暂时无法播放，请稍后重试',icon:'none'}) },
  onShareAppMessage() { return { title: this.data.p.brandName + ' ' + this.data.p.name, path: '/pages/product-detail/product-detail?id=' + this.data.p.id } }
})

