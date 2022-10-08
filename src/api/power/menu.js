import request from "../request"

//搜索菜单
export function queryMenu(data) {
  return request({
    url: `/system/menu/query`,
    method: 'post',
    data: data || {}
  })
}

//复制菜单
export function pasteMenu(id,parentId) {
  return request({
    url: '/system/menu/paste/'+id+'?parentId='+parentId,
    method: 'put'
  })
}

//新增菜单
export function addMenu(data) {
  return request({
    url: `/system/menu/add`,
    method: 'post',
    data: data || {}
  })
}

//修改菜单
export function updateMenu(data) {
  return request({
    url: `/system/menu/${data.id}`,
    method: 'put',
    data: data || {}
  })
}

//删除菜单
export function deleteMenu(id) {
  return request({
    url: `/system/menu/delete/${id}`,
    method: 'delete'
  })
}

//批量删除菜单
export function deleteMenus(data) {
  return request({
    url: `/system/menu/deleteByIds`,
    method: 'delete',
    data: data || {}
  })
}
