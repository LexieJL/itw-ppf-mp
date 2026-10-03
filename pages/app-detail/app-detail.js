const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

Page({
  data: { app: null, crumb: '', lock: null, favItem: null, consultUrl: '' },

  onLoad(q) {
    const app = mock.findApp(q.id) || mock.APPS[0]
    const crumb = [mock.industryOf(app.industryId).name, mock.subOf(app.subId).name, app.name].join(' > ')
    this.setData({
      app, crumb,
      favItem: { type: 'app', id: app.id, title: app.name, sub: crumb, url: '/pages/app-detail/app-detail?id=' + app.id },
      consultUrl: '/pages/inquiry/inquiry?tab=0&app=' + app.id
    })
  },

  onShow() {
    // 应用详情：认证会员及以上可见；普通会员看到模糊遮罩
    this.setData({ lock: auth.lockFor(this.data.app.access) })
  },

  openArticle(e) {
    wx.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(e.currentTarget.dataset.url) })
  },
  openSinglePage() { wx.navigateTo({ url: '/pages/kb-doc/kb-doc?id=' + this.data.app.singlePageDocId }) },
  openAch() {
    wx.navigateTo({ url: '/pages/kb-doc/kb-doc?sales=1&id=' + this.data.app.achDocId })
  },

  onShareAppMessage() {
    return { title: this.data.crumb, path: '/pages/app-detail/app-detail?id=' + this.data.app.id }
  }
})
