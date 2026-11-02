const auth = require('../../utils/auth')
const { selection } = require('../../utils/markets')

// 字段按 PPT 第4页原型图；姓名/手机/公司从会员资料自动填充
const FIELDS = [
  { key: 'name', label: '姓名', required: true, placeholder: '自动填充' },
  { key: 'phone', label: '手机号码', required: true, placeholder: '自动填充' },
  { key: 'company', label: '公司名称', placeholder: '自动填充（选填）' },
  { key: 'title', label: '职位', required: true, placeholder: '请输入职位' },
  { key: 'industrySelections', label: '意向代理行业', type: 'markets', required: true },
  { key: 'brandsProducts', label: '品牌和产品', required: true, placeholder: '请输入意向代理的品牌和产品', multiline: true },
  { key: 'resources', label: '客户资源', placeholder: '选填', multiline: true }
]

Page({
  data: { fields: FIELDS, form: {industrySelections:[]}, lock: null },

  onShow() { this.setData({ lock: auth.lockFor('registered') }) },

  onLoad() {
    const u = auth.getUser()
    this.setData({ form: { industrySelections: [], name: u.name || '', phone: u.phone || '', company: u.company || '', title: u.title || '' } })
  },

  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.key]: e.detail.value.trim() }) },

  onIndustries(e) { this.setData({'form.industrySelections': e.detail.value}) },

  submit() {
    if (!auth.can('registered')) return
    if (!selection(this.data.form.industrySelections).length) return wx.showToast({title:'请选择意向代理的细分行业',icon:'none'})
    const miss = FIELDS.find(f => f.required && !this.data.form[f.key])
    if (miss) return wx.showToast({ title: '请填写' + miss.label, icon: 'none' })
    if (!/^1\d{10}$/.test(this.data.form.phone)) return wx.showToast({title:'手机号格式不正确',icon:'none'})
    this.lastPayload = {...this.data.form, industrySelections: selection(this.data.form.industrySelections)}
    // 正式版：写入 CloudBase 申请表，后台审核后开通经销商身份
    wx.showModal({ title: '表单校验通过', content: '当前为前端演示，申请尚未发送。正式提交待后台接口接入。', showCancel: false, success: () => wx.navigateBack() })
  }
})

