const auth = require('../../utils/auth')
const mock = require('../../utils/mock')
const media = require('../../utils/resources')
const preview = require('../../utils/app-preview')

Page({
  data: { app: null, crumb: '', lock: null, favItem: null, consultUrl: '' },

  onLoad(q) {
    const app = mock.findApp(q.id) || mock.APPS[0]
    const crumb = [mock.industryOf(app.industryId).name, mock.subOf(app.subId).name, app.name].join(' > ')
    this.fullApp = app
    this.setData({crumb, favItem:{type:'app',id:app.id,title:app.name,sub:crumb,url:'/pages/app-detail/app-detail?id='+app.id},consultUrl:'/pages/inquiry/inquiry?tab=0&app='+app.id})
    this.refreshAccess()
  },

  onShow() { this.refreshAccess() },
  refreshAccess() {
    if(!this.fullApp)return
    const app=this.fullApp
    const allowed=auth.can(app.access)
    const sub=mock.subOf(app.subId)
    this.setData({
      lock:null, restricted:!allowed, gate:preview.gate(auth.getUser(),app.access),
      app:allowed?app:{id:app.id,name:app.name,access:app.access},
      publicContext:sub&&sub.desc||'探索相关领域的应用选型与资料。', publicSummary:preview.summary(app,sub&&sub.name),cover:app.publicCoverUrl||app.mainImageUrl||'',
      videos:allowed?media.videos(app,auth.can):[],articles:allowed?media.articles(app,auth.can):[],documents:allowed?media.documents(app,auth.can):[]
    })
  },
  unlock() {
    const gate=this.data.gate
    if(gate.page==='member')return wx.switchTab({url:'/pages/member/member'})
    wx.navigateTo({url:'/pages/register/register?role='+gate.role})
  },
  backToApps() { wx.switchTab({url:'/pages/apps/apps'}) },

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
  openSinglePage() { if(!auth.can(this.fullApp.access))return;wx.navigateTo({ url: '/pages/kb-doc/kb-doc?id=' + this.data.app.singlePageDocId }) },
  openAch() {
    if(!auth.can(this.fullApp.access))return
    wx.navigateTo({ url: '/pages/kb-doc/kb-doc?sales=1&id=' + this.data.app.achDocId })
  },

  onVideoError() { wx.showToast({title:'视频暂时无法播放，请稍后重试',icon:'none'}) },
  onShareAppMessage() {
    return { title: this.data.crumb, path: '/pages/app-detail/app-detail?id=' + this.data.app.id }
  }
})

