const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

Page({
  data: { d: null, crumb: '', pages: [], lock: null, favItem: null, sales: false },
  onLoad(q) {
    const d = mock.findDoc(q.id) || mock.DOCS[0]
    const sales = q.sales === '1'
    const title = sales ? d.title + '（销售用源文件）' : d.title
    const crumb = '专属知识库 > 产品培训 > 文档 > ' + title
    const pages = Array.from({ length: d.pages }, (_, i) => i + 1)
    this.setData({ d: Object.assign({}, d, { title }), crumb, pages, sales,
      favItem: { type: 'doc', id: d.id + (sales ? '-s' : ''), title, sub: crumb, url: '/pages/kb-doc/kb-doc?id=' + d.id + (sales ? '&sales=1' : '') } })
  },
  // 按图例：知识库文档（含销售用 ACH 源文件）为“有权限用户”可见，即认证会员和员工
  onShow() { this.setData({ lock: auth.lockFor(this.data.d.access) }) },
  openPdf() {
    // 正式版：wx.downloadFile 云存储地址后 wx.openDocument({ filePath, showMenu: true }) 全屏查看
    wx.showToast({ title: '全屏打开 PDF', icon: 'none' })
  },
  onShareAppMessage() { return { title: this.data.d.title, path: this.data.favItem.url } }
})
