const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

Page({
  data: { a: null, lock: null, favItem: null },
  onLoad(q) {
    const a = mock.findCompany(q.id) || mock.COMPANY[0]
    this.setData({ a, favItem: { type: 'doc', id: a.id, title: a.title, sub: '专属知识库 > 公司介绍', url: '/pages/kb-article/kb-article?id=' + a.id } })
  },
  onShow() { this.setData({ lock: auth.lockFor(this.data.a.access) }) },
  onShareAppMessage() { return { title: this.data.a.title, path: '/pages/kb-article/kb-article?id=' + this.data.a.id } }
})
