const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

Page({
  data: { list: mock.COMPANY, lock: null },
  onShow() { this.setData({ lock: auth.lockFor('certified') }) },
  open(e) { wx.navigateTo({ url: '/pages/kb-article/kb-article?id=' + e.currentTarget.dataset.id }) }
})
