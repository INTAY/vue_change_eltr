import request from '@/api/request'

// 获取路由
export const getRouters = (params) => {
  return request({
    url: 'system/menu/getMenuTreeByRoleId',
    method: 'get'
  })
}
// 条件查找生产厂家信息列表
export function produceList(data) {
  return request({
    url: '/property/assetFact/searchList',
    method: 'post',
    data: data || {}
  })
}

// 修改密码
//export function updatePassword(data) {
//return request({
//  url: `/system/user/updatePassword?newPassword=${data.pass}&password=${data.oldPass}&userId=${data.id}`,
//  method: 'put',
//  data: data || {}
//})
//}

// 修改密码
export function updatePassword(data) {
  return request({
    url: `/system/user/updatePass`,
    method: 'post',
    data: data || {}
  })
}
