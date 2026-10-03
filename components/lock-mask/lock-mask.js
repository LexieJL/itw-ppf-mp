// 权限遮罩：页面内容加 .blurred（高斯模糊），本组件弹出提示，点击跳转注册/认证
Component({
  properties: {
    lock: { type: Object, value: null },
    closable: { type: Boolean, value: false }
  },
  methods: {
    noop() {},
    onMask() { if (this.data.closable) this.close() },
    close() { this.triggerEvent('close') },
    go() {
      const { url, tab } = this.data.lock
      if (tab) wx.switchTab({ url })
      else wx.navigateTo({ url })
      this.triggerEvent('close')
    }
  }
})
