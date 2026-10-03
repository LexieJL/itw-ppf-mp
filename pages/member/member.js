const auth = require('../../utils/auth')

Page({
  data: {
    user: { role: 'guest' }, roleName: '', certified: false,
    kbEntries: [
      { name: '公司介绍', url: '/pages/kb-company/kb-company' },
      { name: '产品培训', url: '/pages/kb-training/kb-training' }
    ],
    roles: Object.keys(auth.ROLE_NAME).map(key => ({ key, name: auth.ROLE_NAME[key] }))
  },

  onShow() { this.load() },

  load() {
    const user = auth.getUser()
    this.setData({ user, roleName: auth.ROLE_NAME[user.role], certified: auth.can('certified') })
  },

  onAvatar(e) { this.save({ avatar: e.detail.avatarUrl }) },
  onNick(e) { this.save({ nickname: e.detail.value }) },
  save(patch) { auth.setUser(Object.assign(auth.getUser(), patch)); this.load() },

  showIdentity() {
    const u = this.data.user
    const status = u.certStatus === 'pending' ? '\n认证申请审核中（销售在 CRM 中人工确认）' : ''
    wx.showModal({ title: '会员身份', content: '当前身份：' + this.data.roleName + status, showCancel: false })
  },
  followOA() {
    // 正式版使用 <official-account> 组件（仅在扫码等特定场景显示），或引导到公众号文章关注
    wx.showToast({ title: '前往关注“依工聚合”公众号', icon: 'none' })
  },
  openKb(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  toRegister() { wx.navigateTo({ url: '/pages/register/register?role=member' }) },
  toCertify() { wx.navigateTo({ url: '/pages/register/register?role=certified' }) },
  toFav() { wx.navigateTo({ url: '/pages/favorites/favorites' }) },
  toInquiry() { wx.navigateTo({ url: '/pages/inquiry/inquiry' }) },
  toDealer() { wx.navigateTo({ url: '/pages/dealer/dealer' }) },

  switchRole(e) {
    const role = e.currentTarget.dataset.role
    const user = role === 'guest' ? { role } : Object.assign(auth.getUser(), { role, certStatus: '', name: auth.getUser().name || '测试用户' })
    auth.setUser(user)
    this.load()
    wx.showToast({ title: '已切换为' + auth.ROLE_NAME[role], icon: 'none' })
  }
})
