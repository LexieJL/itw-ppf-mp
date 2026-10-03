const auth = require('../../utils/auth')

Page({
  data: {
    entries: [
      { name: '公司介绍', sub: '集团概况 · 品牌历史 · 全球布局', url: '/pages/kb-company/kb-company' },
      { name: '产品培训', sub: '视频类 · 文档类', url: '/pages/kb-training/kb-training' }
    ],
    lock: null, certified: false
  },
  onShow() { this.setData({ lock: auth.lockFor('registered'), certified: auth.can('certified') }) },
  open(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
