// 行业导航：左侧七大行业（竖向），顶部细分领域（可左右滑动）
Component({
  options: { multipleSlots: false },
  properties: {
    industries: { type: Array, value: [] },
    indIndex: { type: Number, value: 0 },
    subIndex: { type: Number, value: 0 }
  },
  methods: {
    onInd(e) { this.triggerEvent('change', { indIndex: e.currentTarget.dataset.i, subIndex: 0 }) },
    onSub(e) { this.triggerEvent('change', { indIndex: this.data.indIndex, subIndex: e.currentTarget.dataset.i }) }
  }
})
