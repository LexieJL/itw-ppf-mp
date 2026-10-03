const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

// 左侧 = 品牌（通到顶部），右侧上方 = 该品牌的产品系列标签（来自 ITW 产品表），下面是品牌介绍卡片和产品
Page({
  data: {
    brands: mock.BRANDS, brandIndex: 0, brand: null, series: [], seriesIndex: 0,
    introOpen: false, list: [], keyword: '', results: [], total: 0, lock: null
  },

  onLoad(q) {
    const i = q.brand ? Math.max(0, mock.BRANDS.findIndex(b => b.id === q.brand)) : 0
    this.pickBrand(i)
  },
  onShow() { this.setData({ lock: auth.lockFor('registered') }) },

  onBrand(e) { this.pickBrand(e.currentTarget.dataset.i) },
  onSeries(e) { this.setData({ seriesIndex: e.currentTarget.dataset.i }); this.refresh() },
  toggleIntro() { this.setData({ introOpen: !this.data.introOpen }) },

  pickBrand(i) {
    const brand = mock.BRANDS[i]
    const all = mock.PRODUCTS.filter(p => p.brand === brand.id)
    const series = all.length ? ['全部'].concat(Array.from(new Set(all.map(p => p.series)))) : []
    this.setData({ brandIndex: i, brand, series, seriesIndex: 0, introOpen: false })
    this.refresh()
  },

  refresh() {
    const s = this.data.series[this.data.seriesIndex]
    this.setData({ list: mock.PRODUCTS.filter(p => p.brand === this.data.brand.id && (s === '全部' || p.series === s)) })
  },

  onInput(e) {
    const keyword = e.detail.value.trim()
    const k = keyword.toLowerCase()
    const all = k ? mock.PRODUCTS.filter(p => (p.name + p.code + p.series + p.brandName + mock.findBrand(p.brand).cn).toLowerCase().includes(k)) : []
    // 最多显示 40 个，避免 setData 过大
    this.setData({ keyword, total: all.length, results: all.slice(0, 40) })
  },

  toDetail(e) { wx.navigateTo({ url: '/pages/product-detail/product-detail?id=' + e.currentTarget.dataset.id }) }
})
