import request from "../request"

// 查询渲染列表
export function queryByPage(data) {
  return request({
    url: '/system/user/queryByPage',
    method: 'post',
    data: data || {}
  })
}

//新增用户
export  function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data || {}
  })
}
//获取用户
export  function acquireUser(data) {
  return request({
    url: `/system/user?uniqueId=${data}`,
    method: 'get',
  })
}

//删除用户
export  function deletUser(id) {
  return request({
    url: `/system/user/delete/${id}`,
    method: 'delete',
  })
}

//批量删除
export  function deleteUsers(data) {
  return request({
    url: '/system/user/deleteBatch',
    method: 'delete',
    data: data || {}
  })
}

//修改用户
export function updateUser(data) {
  return request({
    url: `/system/user/update/${data.id}`,
    method: 'put',
    data: data || {}
  })
}

//查询用户信息
export function userInfo(userId) {
  return request({
    url: `/system/menu/getMenuTreeByRoleId`,
    method: 'get'
  })
}

//角色分配
export function roleAssign(userId,roelId) {
  return request({
    url: `/system/user/roleAssign?userId=`+userId+`&roleId=`+roelId,
    method: 'get'
  })
}

//重置密码
export function resetPass(data) {
  return request({
    url: `/system/user/resetPass`,
    method: 'post',
    data: data || {}
  })
}

//获取机构数据权限
//export function getUserPower(userId) {
//return request({
//  url: `/system/userObjRela/getDetail/${userId}`,
//  method: 'get'
//})
//}

export function getUserPower(userId) {
  return request({
    url: `/system/userObjRela?userId=${userId}`,
    method: 'get'
  })
}

//修改组织机构数据权限
export function updatePower(data) {
  return request({
    url: `/system/userObjRela/update`,
    method: 'put',
    data: data || {}
  })
}

//修改组织机构数据权限2
export function updatePower2(data) {
  return request({
    url: `/system/userObjRela/updateUser`,
    method: 'put',
    data: data || {}
  })
}

//获取按钮权限
export function getButPermissions(data) {
return request({
    url: `/system/menu/getButPermissions`,
    method: 'get',
})
}

export function user_(id) {
  return request({
    url: `/system/user/getUser/${id}`,
    method: 'get',
  })
}

export function getOrgById(id) {
  return request({
    url: `system/group/${id}`,
    method: 'GET'
  })
}


