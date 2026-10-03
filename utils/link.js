// 统一跳转：后台给按钮、Banner、模块配置的 link 都走这里
// link: { type: 'tab' | 'page' | 'custom' | 'article' | 'miniprogram', url?, id?, appId?, path?, name? }
function open(link) {
  if (!link) return
  switch (link.type) {
    case 'tab': return wx.switchTab({ url: link.url })
    case 'page': return wx.navigateTo({ url: link.url })
    case 'custom': return wx.navigateTo({ url: '/pages/custom/custom?id=' + link.id })
    case 'article': return wx.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(link.url) })
    case 'miniprogram':
      if (!link.appId) return wx.showToast({ title: '将跳转' + (link.name || '外部小程序') + '（待配置）', icon: 'none' })
      return wx.navigateToMiniProgram({ appId: link.appId, path: link.path || '' })
  }
}

module.exports = { open }
