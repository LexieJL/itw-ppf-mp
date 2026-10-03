// 每个页面右下角的“搜索浮窗”和“我的收藏浮窗”
Component({
  properties: { bottom: { type: Number, value: 48 } },
  methods: {
    toSearch() { wx.navigateTo({ url: '/pages/search/search' }) },
    toFav() { wx.navigateTo({ url: '/pages/favorites/favorites' }) }
  }
})
