import request from "../request"

//删除角色
export function roleDelete(id) {
  return request({
    url: `/system/role/${id}`,
    method: 'delete',
  })
}

//搜索角色
export  function queryRole(data) {
  return request({
    url: `/system/role/conditions`,
    method: 'post',
    data: data || {}
  })
}

//复制角色
export  function pasteRole(id) {
  return request({
    url: `/system/role/paste/${id}`,
    method: 'put'
  })
}

//新增角色
export function addRole(data) {
  return request({
    url: `/system/role`,
    method: 'post',
    data: data || {}
  })
}

//修改角色
export function updateRole(data) {
  return request({
    url: `/system/role/update/${data.id}`,
    method: 'put',
    data: data || {}
  })
}
