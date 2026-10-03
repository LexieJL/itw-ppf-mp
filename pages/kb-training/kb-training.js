const auth = require('../../utils/auth')

Page({
  data: {
    entries: [
      { type: 'video', name: '视频类', sub: 'SOP视频 · VR视频' },
      { type: 'doc', name: '文档类', sub: '手册 · 单页 · ACH · 其他' }
    ],
    lock: null
  },
  onShow() { this.setData({ lock: auth.lockFor('certified') }) },
  open(e) { wx.navigateTo({ url: '/pages/kb-list/kb-list?type=' + e.currentTarget.dataset.type }) },
  toSearch() { wx.navigateTo({ url: '/pages/search/search' }) }
})
