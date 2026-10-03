const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

Page({
  data: { type: 'video', industries: mock.INDUSTRIES, indIndex: 1, subIndex: 2, items: [], lock: null },

  onLoad(q) {
    this.setData({ type: q.type || 'video' })
    wx.setNavigationBarTitle({ title: '产品培训' })
    this.refresh()
  },
  onShow() { this.setData({ lock: auth.lockFor('certified') }) },
  onNav(e) { this.setData(e.detail); this.refresh() },

  refresh() {
    const sub = this.data.industries[this.data.indIndex].subs[this.data.subIndex]
    const src = this.data.type === 'video' ? mock.VIDEOS : mock.DOCS
    this.setData({ items: src.filter(x => mock.inSub(x, sub)) })
  },

  open(e) {
    const page = this.data.type === 'video' ? 'kb-video' : 'kb-doc'
    wx.navigateTo({ url: '/pages/' + page + '/' + page + '?id=' + e.currentTarget.dataset.id })
  }
})
