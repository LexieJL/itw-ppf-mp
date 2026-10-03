// 收藏（测试版存本地；正式版写入 CloudBase，可跨设备同步）
const KEY = 'favorites'

function list() {
  return wx.getStorageSync(KEY) || []
}

function has(type, id) {
  return list().some(f => f.type === type && f.id === id)
}

// item: { type: app|product|video|doc, id, title, sub, url }
function toggle(item) {
  let all = list()
  const exists = all.some(f => f.type === item.type && f.id === item.id)
  if (exists) all = all.filter(f => !(f.type === item.type && f.id === item.id))
  else all.unshift(Object.assign({ time: Date.now() }, item))
  wx.setStorageSync(KEY, all)
  wx.showToast({ title: exists ? '已取消收藏' : '已收藏', icon: 'none' })
  return !exists
}

module.exports = { list, has, toggle }
