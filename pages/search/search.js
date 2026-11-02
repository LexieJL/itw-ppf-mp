const auth = require('../../utils/auth')
const mock = require('../../utils/mock')
const engine = require('../../utils/search')
const LIMIT=20
Page({
 data:{keyword:'',groups:[],total:0,hots:['Devcon','得复康','新能源电池','风能','手册'],lock:null},
 onInput(e){this.search(e.detail.value.trim())},
 useHot(e){this.search(e.currentTarget.dataset.k)},
 onShow(){if(this.data.keyword)this.search(this.data.keyword)},
 search(keyword){
  const groups=keyword?engine.search(mock,keyword):[]
  this.results=groups
  this.setData({keyword,total:groups.reduce((n,g)=>n+g.count,0),groups:groups.map(g=>this.group(g,LIMIT))})
 },
 group(g,n){return {...g,more:g.count>n,list:g.list.slice(0,n).map((r,i)=>({...r,key:g.name+i,locked:!auth.can(r.access),url:'/pages/'+r.page+'/'+r.page+'?id='+encodeURIComponent(r.id)}))}},
 more(e){const i=Number(e.currentTarget.dataset.i);const groups=this.data.groups.slice();groups[i]=this.group(this.results[i],groups[i].list.length+LIMIT);this.setData({groups})},
 open(e){const {i,j}=e.currentTarget.dataset;const r=this.data.groups[i].list[j];if(!auth.can(r.access))return this.setData({lock:auth.lockFor(r.access)});wx.navigateTo({url:r.url})},
 closeLock(){this.setData({lock:null})}
})
