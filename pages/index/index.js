const auth = require('../../utils/auth')
const cms = require('../../utils/cms')
const link = require('../../utils/link')

// 首页 Banner 和模块（顺序、显示隐藏、标题、图标、跳转、权限）都来自运营后台配置 utils/cms.js
Page({
  data: { banners: [], modules: [], role: 'guest', lock: null },

  onShow() {
    this.setData({
      role: auth.getUser().role,
      banners: cms.HOME.banners,
      modules: cms.HOME.modules.filter(m => m.visible).map(m => Object.assign({}, m, { locked: !auth.can(m.access) }))
    })
  },

  onBanner(e) { link.open(this.data.banners[e.currentTarget.dataset.i].link) },

  onModule(e) {
    const m = this.data.modules[e.currentTarget.dataset.i]
    // 除“工业电商”等公开模块外，游客点击任意模块：界面高斯模糊 + 要求注册
    if (m.locked) return this.setData({ lock: auth.lockFor(m.access) })
    link.open(m.link)
  },

  toRegister() { wx.navigateTo({ url: '/pages/register/register?role=member' }) },
  closeLock() { this.setData({ lock: null }) },
  onShareAppMessage() { return { title: 'ITW PPF', path: '/pages/index/index' } }
})
