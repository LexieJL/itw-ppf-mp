// 公众号推文：web-view 打开 mp.weixin.qq.com 文章（需小程序与公众号关联，或文章链接在业务域名内）
Page({
  data: { url: '' },
  onLoad(q) { this.setData({ url: decodeURIComponent(q.url || '') }) }
})
