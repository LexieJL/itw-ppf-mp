const auth = require('../../utils/auth')

// 字段按 PPT 第4页原型图；姓名/手机/公司从会员资料自动填充
const FIELDS = [
  { key: 'name', label: '姓名', required: true, placeholder: '自动填充' },
  { key: 'phone', label: '手机号码', required: true, placeholder: '自动填充' },
  { key: 'company', label: '公司名称', placeholder: '自动填充（选填）' },
  { key: 'title', label: '职位', required: true, placeholder: '请输入职位' },
  { key: 'target', label: '想要代理的行业/品牌/产品', required: true, placeholder: '请输入', multiline: true },
  { key: 'resources', label: '客户资源', placeholder: '选填', multiline: true }
]

Page({
  data: { fields: FIELDS, form: {}, lock: null },

  onShow() { this.setData({ lock: auth.lockFor('registered') }) },

  onLoad() {
    const u = auth.getUser()
    this.setData({ form: { name: u.name || '', phone: u.phone || '', company: u.company || '', title: u.title || '' } })
  },

  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.key]: e.detail.value.trim() }) },

  submit() {
    const miss = FIELDS.find(f => f.required && !this.data.form[f.key])
    if (miss) return wx.showToast({ title: '请填写' + miss.label, icon: 'none' })
    // 正式版：写入 CloudBase 申请表，后台审核后开通经销商身份
    wx.showModal({ title: '申请已提交', content: '我们会尽快与您联系。', showCancel: false, success: () => wx.navigateBack() })
  }
})
