// web-view 页：公众号推文（需小程序与公众号关联）和 ITW 官网（itwppfasia.com 需配置为业务域名）
Page({
  data: { url: '' },
  onLoad(q) { this.setData({ url: decodeURIComponent(q.url || '') }) }
})
