const auth = require('../../utils/auth')
const mock = require('../../utils/mock')
const preview = require('../../utils/app-preview')

Page({
  data: { industries: mock.INDUSTRIES, indIndex: 1, subIndex: 2, sub: null, apps: [], lock: null, certified: false },

  onLoad() { this.refresh() },

  onShow() {
    // 应用列表向游客开放公开概览，详情内容仍按认证权限控制。
    this.setData({ lock: null, certified: auth.can('certified') })
  },

  onNav(e) {
    this.setData(e.detail)
    this.refresh()
  },

  refresh() {
    const sub = this.data.industries[this.data.indIndex].subs[this.data.subIndex]
    this.setData({ sub, apps: mock.APPS.filter(a => a.subId === sub.id).map(a => ({id:a.id,name:a.name,cover:a.publicCoverUrl||a.mainImageUrl||'',summary:preview.summary(a,sub.name)})) })
  },

  toDetail(e) { wx.navigateTo({ url: '/pages/app-detail/app-detail?id=' + e.currentTarget.dataset.id }) }
})

