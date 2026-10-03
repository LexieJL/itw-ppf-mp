const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

Page({
  data: { v: null, crumb: '', lock: null, favItem: null },
  onLoad(q) {
    const v = mock.findVideo(q.id) || mock.VIDEOS[0]
    const crumb = '专属知识库 > 产品培训 > 视频 > ' + (v.subId ? mock.subOf(v.subId).name : mock.industryOf(v.industryId).name) + ' > ' + v.title
    this.setData({ v, crumb, favItem: { type: 'video', id: v.id, title: v.title + '（' + v.kind + '）', sub: crumb, url: '/pages/kb-video/kb-video?id=' + v.id } })
  },
  onShow() { this.setData({ lock: auth.lockFor(this.data.v.access) }) },
  fullscreen() { wx.showToast({ title: '全屏播放', icon: 'none' }) },
  onShareAppMessage() { return { title: this.data.v.title, path: '/pages/kb-video/kb-video?id=' + this.data.v.id } }
})
