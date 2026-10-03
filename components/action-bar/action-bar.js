// 详情页底部：收藏 / 转发 / 需求咨询
const fav = require('../../utils/fav')

Component({
  properties: {
    item: { type: Object, value: null }, // 收藏对象 { type, id, title, sub, url }
    consult: { type: String, value: '' } // 需求咨询页地址，空则不显示
  },
  data: { faved: false },
  observers: {
    item(item) { if (item) this.setData({ faved: fav.has(item.type, item.id) }) }
  },
  methods: {
    toggleFav() { this.setData({ faved: fav.toggle(this.data.item) }) },
    toConsult() { wx.navigateTo({ url: this.data.consult }) }
  }
})
