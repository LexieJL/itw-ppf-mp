// 统一跳转：后台给按钮、Banner、模块配置的 link 都走这里
// link: { type: 'tab' | 'page' | 'custom' | 'article' | 'miniprogram' | 'web', url?, id?, appId?, path?, name?, webview? }
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
    // 外部网站：小程序只能打开已配置业务域名的网页，其余复制链接让用户到浏览器打开
    case 'web':
      if (link.webview) return wx.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(link.url) })
      return wx.setClipboardData({
        data: link.url,
        success: () => wx.showModal({ title: '链接已复制', content: (link.name || '该链接') + '需要在浏览器中打开，请粘贴到浏览器访问。', showCancel: false })
      })
  }
}

module.exports = { open }
