import request from "../request"

export  function cx(data) {
  return request({
    url: '/system/resource/all',
    method: 'post',
    data: data || {}
  })
}

//新增
export function add(data) {
  return request({
    url: '/system/resource',
    method: 'post',
    data: data || {}
  })
}
// 删除
export function resDel(id) {
  return request({
    url: `/system/resource/${id}`,
    method: 'delete',
  })
}

// 修改
export function xiuGai(data) {
  return request({
    url: `/system/resource/${data.id}`,
    method: 'put',
    data: data || {}
  })
}

//批量删除
export function piliangDelete(data) {
  return request({
    url: '/system/resource/deleteByIds',
    method: 'post',
    data: data || {}
  })
}

// 树状图：
// 显示
export function getResTree(){
  return  request({
    url: '/system/resource/tree',
    method: 'get'
  })
}

//根据parentId获取下级资源
export function getChildren(parentId){
  return  request({
    url: '/system/resource/children/'+parentId,
    method: 'get'
  })
}

//表格查询
export function queryPage(data) {
  return request({
    url: '/system/resource/conditions',
    method: 'post',
    data: data || {}
  })
}

//获取单个资源信息
export function getResById(id){
  return  request({
    url: `/system/resource/${id}`,
    method: 'get'
  })
}
