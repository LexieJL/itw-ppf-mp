// 角色与权限（测试版存在本地缓存；正式版由 CloudBase 保存角色并在云函数中校验）
// ITW 已确认（反馈PPT第8页）四类身份：游客 / 普通会员 / 认证会员（经销商及客户）/ ITW员工，
// 页面按图例三档权限配置：未注册可见(public) / 所有用户可见(registered) / 有权限用户(certified，认证会员和员工)
const ROLE_LEVEL = { guest: 0, member: 1, certified: 2, staff: 3 }
const ROLE_NAME = { guest: '游客', member: '普通会员', certified: '认证会员', staff: 'ITW PPF员工' }
// 内容的访问级别：public 所有人 / registered 已注册 / certified 认证会员及以上 / staff 内部员工
const ACCESS_LEVEL = { public: 0, registered: 1, certified: 2, staff: 3 }

function getUser() {
  return wx.getStorageSync('user') || { role: 'guest' }
}

function setUser(user) {
  wx.setStorageSync('user', user)
}

function can(access) {
  return ROLE_LEVEL[getUser().role] >= ACCESS_LEVEL[access || 'public']
}

// 没有权限时返回遮罩配置（lock-mask 组件使用），有权限返回 null
function lockFor(access) {
  if (can(access)) return null
  const user = getUser()
  if (user.role === 'guest') {
    return { pre: '点击', link: '注册', post: '成为会员，解锁更多内容', url: '/pages/register/register?role=member' }
  }
  if (access === 'staff') {
    return { pre: '该内容仅限', link: 'ITW PPF员工', post: '查看', url: '/pages/register/register?role=staff' }
  }
  if (user.certStatus === 'pending') {
    return { pre: '', link: '认证申请', post: '审核中，通过后即可查看', url: '/pages/member/member', tab: true }
  }
  return { pre: '完成', link: '身份认证', post: '解锁更多权益', url: '/pages/register/register?role=certified' }
}

module.exports = { ROLE_NAME, getUser, setUser, can, lockFor }
