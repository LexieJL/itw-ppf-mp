const auth = require('../../utils/auth')
const fav = require('../../utils/fav')

Page({
  data: {
    tabs: [{ key: 'all', name: '全部' }, { key: 'app', name: '应用' }, { key: 'product', name: '产品' }, { key: 'video', name: '视频' }, { key: 'doc', name: '文档' }],
    typeName: { app: '应用', product: '产品', video: '视频', doc: '文档' },
    tab: 'all', keyword: '', items: [], lock: null
  },
  onShow() { this.setData({ lock: auth.lockFor('registered') }); this.refresh() },
  pickTab(e) { this.setData({ tab: e.currentTarget.dataset.key }); this.refresh() },
  onInput(e) { this.setData({ keyword: e.detail.value.trim() }); this.refresh() },
  refresh() {
    const { tab, keyword } = this.data
    this.setData({
      items: fav.list().filter(f => (tab === 'all' || f.type === tab) && (!keyword || (f.title + f.sub).includes(keyword)))
    })
  },
  open(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
