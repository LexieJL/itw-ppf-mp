const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

Page({
  data: { industries: mock.INDUSTRIES, indIndex: 1, subIndex: 2, sub: null, apps: [], lock: null, certified: false },

  onLoad() { this.refresh() },

  onShow() {
    // 应用库列表：已注册用户可见，游客不可见
    this.setData({ lock: auth.lockFor('registered'), certified: auth.can('certified') })
  },

  onNav(e) {
    this.setData(e.detail)
    this.refresh()
  },

  refresh() {
    const sub = this.data.industries[this.data.indIndex].subs[this.data.subIndex]
    this.setData({ sub, apps: mock.APPS.filter(a => a.subId === sub.id) })
  },

  toDetail(e) { wx.navigateTo({ url: '/pages/app-detail/app-detail?id=' + e.currentTarget.dataset.id }) }
})
