const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

// 常见问题库：关键词检索、分类筛选、用户提问（提问经后台审核后发布）
Page({
  data: {
    cats: ['全部'].concat(mock.FAQ_CATEGORIES), cat: '全部', keyword: '', list: mock.FAQ, open: {}, lock: null,
    asking: false, askCats: mock.FAQ_CATEGORIES, askCat: -1, askText: '', askImage: ''
  },

  onShow() { this.setData({ lock: auth.lockFor('registered') }) },

  onInput(e) { this.setData({ keyword: e.detail.value.trim() }); this.refresh() },
  pickCat(e) { this.setData({ cat: e.currentTarget.dataset.c }); this.refresh() },
  refresh() {
    const { cat, keyword } = this.data
    this.setData({ list: mock.FAQ.filter(f => (cat === '全部' || f.category === cat) && (!keyword || (f.q + f.a).includes(keyword))) })
  },
  toggle(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ ['open.' + id]: !this.data.open[id] })
  },

  noop() {},
  openAsk() { this.setData({ asking: true }) },
  closeAsk() { this.setData({ asking: false }) },
  onAskCat(e) { this.setData({ askCat: Number(e.detail.value) }) },
  onAskText(e) { this.setData({ askText: e.detail.value.trim() }) },
  pickImage() {
    wx.chooseMedia({ count: 1, mediaType: ['image'], success: res => this.setData({ askImage: res.tempFiles[0].tempFilePath }) })
  },
  submitAsk() {
    if (this.data.askCat < 0) return wx.showToast({ title: '请选择问题分类', icon: 'none' })
    if (!this.data.askText) return wx.showToast({ title: '请填写问题描述', icon: 'none' })
    // 正式版：写入 CloudBase，运营在后台回答并审核后发布到问题库
    this.setData({ asking: false, askCat: -1, askText: '', askImage: '' })
    wx.showModal({ title: '提问已提交', content: '我们会尽快回复，审核后发布到问题库。', showCancel: false })
  }
})
