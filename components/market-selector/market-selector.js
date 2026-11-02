const { MARKETS, selection } = require('../../utils/markets')
Component({
 properties: { value: {type:Array,value:[],observer:'refresh'} },
 data: { markets:MARKETS, active:0, options:[], selected:[] },
 lifetimes: { attached() { this.refresh() } },
 methods: {
  refresh() { const ids=this.data.value || []; this.setData({options:MARKETS[this.data.active].subs.map(s=>({...s,checked:ids.includes(s.id)})),selected:selection(ids)}) },
  onMarket(e) { this.setData({active:Number(e.detail.value)});this.refresh() },
  toggle(e) { const id=e.currentTarget.dataset.id; const ids=(this.data.value||[]).slice(); const i=ids.indexOf(id);if(i<0)ids.push(id);else ids.splice(i,1);this.triggerEvent('change',{value:ids,selections:selection(ids)}) }
 }
})
