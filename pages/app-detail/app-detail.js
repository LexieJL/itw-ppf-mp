const auth = require('../../utils/auth')
const mock = require('../../utils/mock')
const media = require('../../utils/resources')

Page({
  data: { app: null, crumb: '', lock: null, favItem: null, consultUrl: '' },

  onLoad(q) {
    const app = mock.findApp(q.id) || mock.APPS[0]
    const crumb = [mock.industryOf(app.industryId).name, mock.subOf(app.subId).name, app.name].join(' > ')
    this.setData({
      videos: media.videos(app, auth.can),
      app, crumb, articles:media.articles(app,auth.can), documents:media.documents(app,auth.can),
      favItem: { type: 'app', id: app.id, title: app.name, sub: crumb, url: '/pages/app-detail/app-detail?id=' + app.id },
      consultUrl: '/pages/inquiry/inquiry?tab=0&app=' + app.id
    })
  },

  onShow() {
    // 应用详情：认证会员及以上可见；普通会员看到模糊遮罩
    this.setData({ lock: auth.lockFor(this.data.app.access),videos:media.videos(this.data.app,auth.can),articles:media.articles(this.data.app,auth.can),documents:media.documents(this.data.app,auth.can) })
  },

  openArticle(e) {
    if (!auth.can(this.data.app.access)) return
    if (!e.currentTarget.dataset.url) return wx.showToast({title:'推文暂未提供',icon:'none'})
    wx.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(e.currentTarget.dataset.url) })
  },
  openDocument(e) {
    if (!auth.can(this.data.app.access)) return
    const url=e.currentTarget.dataset.url
    if (!url) return wx.showToast({title:'文件暂未提供',icon:'none'})
    wx.downloadFile({url,success:r=>{if(r.statusCode!==200)return wx.showToast({title:'文件下载失败',icon:'none'});wx.openDocument({filePath:r.tempFilePath,showMenu:true,fail:()=>wx.showToast({title:'文件无法打开',icon:'none'})})},fail:()=>wx.showToast({title:'文件下载失败',icon:'none'})})
  },
  openSinglePage() { wx.navigateTo({ url: '/pages/kb-doc/kb-doc?id=' + this.data.app.singlePageDocId }) },
  openAch() {
    wx.navigateTo({ url: '/pages/kb-doc/kb-doc?sales=1&id=' + this.data.app.achDocId })
  },

  onVideoError() { wx.showToast({title:'视频暂时无法播放，请稍后重试',icon:'none'}) },
  onShareAppMessage() {
    return { title: this.data.crumb, path: '/pages/app-detail/app-detail?id=' + this.data.app.id }
  }
})

