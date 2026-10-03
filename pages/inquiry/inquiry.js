const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

const CONTACT = [
  { key: 'name', label: '姓名', required: true },
  { key: 'phone', label: '手机', required: true },
  { key: 'company', label: '公司', required: true },
  { key: 'email', label: '邮箱', required: true }
]
const ADDRESS = [
  { key: 'region', label: '省份/城市/区县', type: 'region', required: true },
  { key: 'address', label: '详细地址', required: true, placeholder: '请填写详细地址以确保快递准确送达' }
]
// 三类咨询表单，字段按 PPT 第14页原型图
const TABS = [
  { key: 'sample', name: '样品资料申请', fields: [
    { key: 'product', label: '选择产品', type: 'product', required: true },
    { key: 'app', label: '选择应用', type: 'app', required: true },
    ...CONTACT, ...ADDRESS,
    { key: 'scene', label: '应用场景', type: 'textarea', required: true, placeholder: '请简要描述您的应用场景' }
  ] },
  { key: 'visit', name: '上门申请', fields: [
    ...CONTACT, ...ADDRESS,
    { key: 'purpose', label: '访问目的', type: 'textarea', required: true, placeholder: '请简要描述访问目的' }
  ] },
  { key: 'general', name: '一般问询', fields: [
    { key: 'product', label: '选择产品', type: 'product' },
    { key: 'app', label: '选择应用', type: 'app' },
    ...CONTACT,
    { key: 'question', label: '问题描述', type: 'textarea', required: true, placeholder: '请简要描述您的问题' }
  ] }
]

Page({
  data: {
    tabs: TABS, tab: 0, fields: TABS[0].fields, form: {},
    productNames: mock.PRODUCTS.map(p => p.brandName + ' ' + p.name),
    appNames: mock.APPS.map(a => mock.subOf(a.subId).name + ' · ' + a.name)
  },

  onShow() { this.setData({ lock: auth.lockFor('registered') }) },

  onLoad(q) {
    const u = auth.getUser()
    this.setData({
      form: {
        name: u.name || '', phone: u.phone || '', company: u.company || '', email: u.email || '',
        product: q.product ? mock.PRODUCTS.findIndex(p => p.id === q.product) : -1,
        app: q.app ? mock.APPS.findIndex(a => a.id === q.app) : -1
      }
    })
    this.pickTab({ currentTarget: { dataset: { i: Number(q.tab || 0) } } })
  },

  pickTab(e) {
    const tab = e.currentTarget.dataset.i
    this.setData({ tab, fields: TABS[tab].fields })
  },

  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.key]: e.detail.value.trim() }) },
  onPick(e) { this.setData({ ['form.' + e.currentTarget.dataset.key]: Number(e.detail.value) }) },
  onRegion(e) { this.setData({ 'form.region': e.detail.value }) },
  onCheck(e) {
    const v = e.detail.value
    this.setData({ 'form.marketing': v.includes('marketing'), 'form.agree': v.includes('agree') })
  },
  showTerms() { wx.showModal({ title: '使用条例和隐私权声明', content: '正式条款由 ITW 提供。', showCancel: false }) },

  submit() {
    const f = this.data.form
    for (const field of this.data.fields) {
      const v = f[field.key]
      if (field.required && (v === undefined || v === '' || v === -1)) return wx.showToast({ title: '请填写' + field.label, icon: 'none' })
    }
    if (!/^1\d{10}$/.test(f.phone)) return wx.showToast({ title: '手机号格式不正确', icon: 'none' })
    if (!f.agree) return wx.showToast({ title: '请先同意使用条例和隐私权声明', icon: 'none' })
    // 正式版：写入 CloudBase 咨询记录并分派处理人（后台流程待开发）
    wx.showModal({ title: '提交成功', content: '我们已收到您的' + TABS[this.data.tab].name + '，会尽快与您联系。', showCancel: false })
  }
})
