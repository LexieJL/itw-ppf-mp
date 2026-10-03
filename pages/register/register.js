const auth = require('../../utils/auth')
const mock = require('../../utils/mock')

// 注册字段按 PPT 第15页原型图（ITW 反馈：先按现有 UI 开发，测试后再定稿）
// 测试阶段所有字段都可以留空直接提交；上线前改为 false 恢复必填校验
const ALLOW_EMPTY = true
// 测试阶段提交认证后直接成为认证会员，不走销售审核；上线前改为 false，恢复“审核中”流程
const AUTO_CERTIFY = true
const FORMS = {
  member: [
    { key: 'name', label: '姓名', required: true },
    { key: 'phone', label: '手机号码', type: 'phone', required: true },
    { key: 'smsCode', label: '手机号验证', type: 'code', target: 'phone', required: true, placeholder: '短信验证码' },
    { key: 'company', label: '公司名称', placeholder: '选填' },
    { key: 'title', label: '职位', placeholder: '选填' },
    { key: 'industries', label: '关注行业', type: 'industries', required: true },
    { key: 'email', label: '邮箱', type: 'email', required: true }
  ],
  certified: [
    { key: 'name', label: '姓名', required: true },
    { key: 'phone', label: '手机号码', type: 'phone', required: true },
    { key: 'smsCode', label: '手机号验证', type: 'code', target: 'phone', required: true, placeholder: '短信验证码' },
    { key: 'company', label: '公司名称', required: true },
    { key: 'brands', label: '已代理品牌/主营产品', required: true, placeholder: '请输入' },
    { key: 'title', label: '职位', required: true },
    { key: 'industries', label: '关注行业', type: 'industries', required: true },
    { key: 'email', label: '邮箱', type: 'email', required: true },
    { key: 'isDealer', label: '是否已是ITW PPF经销商', type: 'radio', required: true }
  ],
  staff: [
    { key: 'name', label: '姓名', required: true },
    { key: 'phone', label: '手机号', type: 'phone', required: true },
    { key: 'dept', label: '部门', required: true },
    { key: 'email', label: '企业邮箱', type: 'email', required: true, placeholder: 'ITW PPF 企业邮箱' },
    { key: 'emailCode', label: '邮箱验证码', type: 'code', target: 'email', required: true, placeholder: '邮箱验证码' }
  ]
}

Page({
  data: {
    role: 'member', fields: FORMS.member, allowEmpty: ALLOW_EMPTY, form: { industries: {} }, countdown: 0,
    industries: mock.INDUSTRIES,
    roles: [{ key: 'member', name: '普通会员' }, { key: 'certified', name: '认证会员' }, { key: 'staff', name: 'ITW PPF员工' }],
    tips: {
      certified: '认证会员适用于经销商及客户。选择“认证会员”注册，需提交资质接受审核，由销售在 CRM 中人工确认。',
      staff: '使用 ITW PPF 企业邮箱注册，验证后即开通员工身份。'
    }
  },

  onLoad(q) {
    const user = auth.getUser()
    const form = Object.assign({ industries: {} }, user.role === 'guest' ? {} : user)
    this.setData({ form })
    this.pickRole({ currentTarget: { dataset: { role: q.role || 'member' } } })
  },

  pickRole(e) {
    const role = e.currentTarget.dataset.role
    this.setData({ role, fields: FORMS[role] })
  },

  onInput(e) { this.setData({ ['form.' + e.currentTarget.dataset.key]: e.detail.value.trim() }) },
  onRadio(e) { this.setData({ ['form.' + e.currentTarget.dataset.key]: e.detail.value }) },
  toggleIndustry(e) {
    const name = e.currentTarget.dataset.name
    this.setData({ ['form.industries.' + name]: !this.data.form.industries[name] })
  },

  sendCode(e) {
    if (this.data.countdown) return
    const target = this.data.form[e.currentTarget.dataset.target]
    if (!target) return wx.showToast({ title: '请先填写' + (e.currentTarget.dataset.target === 'phone' ? '手机号' : '邮箱'), icon: 'none' })
    wx.showToast({ title: '验证码已发送', icon: 'none' })
    this.setData({ countdown: 60 })
    this.timer = setInterval(() => {
      const c = this.data.countdown - 1
      this.setData({ countdown: c })
      if (c <= 0) clearInterval(this.timer)
    }, 1000)
  },
  onUnload() { clearInterval(this.timer) },

  validate() {
    const f = this.data.form
    for (const field of this.data.fields) {
      const v = f[field.key]
      const empty = field.type === 'industries' ? !Object.values(f.industries || {}).some(Boolean) : !v
      if (field.required && empty && !ALLOW_EMPTY) return '请填写' + field.label
      if (v && field.type === 'phone' && !/^1\d{10}$/.test(v)) return '手机号格式不正确'
      if (v && field.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) return '邮箱格式不正确'
      if (v && field.type === 'code' && !/^\d{6}$/.test(v)) return '验证码为 6 位数字'
    }
    return ''
  },

  submit() {
    const err = this.validate()
    if (err) return wx.showToast({ title: err, icon: 'none' })
    const { smsCode, emailCode, ...profile } = this.data.form
    const role = this.data.role
    // 正式版：调用云函数保存资料、校验验证码，并同步到 CRM（PPT第19页）
    if (role === 'certified' && AUTO_CERTIFY) {
      auth.setUser(Object.assign(profile, { role: 'certified', certStatus: '' }))
      wx.showModal({
        title: '认证成功',
        content: '您已成为认证会员，可以查看应用详情和专属知识库。（测试阶段免审核）',
        showCancel: false,
        success: () => wx.switchTab({ url: '/pages/member/member' })
      })
      return
    }
    if (role === 'certified') {
      auth.setUser(Object.assign(profile, { role: 'member', certStatus: 'pending' }))
      wx.showModal({
        title: '认证申请已提交',
        content: '销售将在 CRM 中人工确认您的资质，审核通过后自动升级为认证会员。审核期间您可以先以普通会员身份浏览。',
        showCancel: false,
        success: () => wx.switchTab({ url: '/pages/member/member' })
      })
      return
    }
    auth.setUser(Object.assign(profile, { role, certStatus: '' }))
    wx.showToast({ title: '注册成功' })
    setTimeout(() => wx.switchTab({ url: '/pages/member/member' }), 800)
  }
})
