// 修改共享规则后运行 node tools/sync-preview-config.js，更新独立网页演示。
const fs=require('node:fs')
const path=require('node:path')
const root=path.join(__dirname,'..')
const file=path.join(root,'preview.html')
let html=fs.readFileSync(file,'utf8')
let block='<script>\nwindow.ITW_FRONTEND = {};\n'
for(const name of ['markets','resources','search','cms','app-preview'])block+='{ const module = {exports:{}};\n'+fs.readFileSync(path.join(root,'utils',name+'.js'),'utf8')+'\nwindow.ITW_FRONTEND['+JSON.stringify(name)+'] = module.exports; }\n'
block+='</script>'
const start=html.indexOf('<script>\nwindow.ITW_FRONTEND = {};')
if(start<0)throw new Error('Missing shared config marker')
const end=html.indexOf('</script>',start)+9
fs.writeFileSync(file,html.slice(0,start)+block+html.slice(end))
