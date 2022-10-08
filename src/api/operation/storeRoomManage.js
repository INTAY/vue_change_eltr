/* 库房管理接口 */
import request from "../request"

//  根据条件分页查询库房信息
export function queryByPage(params) {
  return request({
    url: "/operation/warehouseInfo/queryPage",
    method: "POST",
    data: params || {}
  })
}

// 根据条件查询库房信息列表
export function queryList(params) {
  return request({
    url: "/operation/warehouseInfo/queryList",
    method: "POST",
    data: params || {}
  })
}

// 新增一个库房信息
export function add(params) {
  return request({
    url: "/operation/warehouseInfo/add",
    method: "POST",
    data: params || {}
  })
}

// 修改库房信息
export function modify(params) {
  return request({
    url: `/operation/warehouseInfo/update/${params.id}`,
    method: "PUT",
    data: params || {}
  })
}

// 删除
export function remove(id) {
  return request({
    url: `/operation/warehouseInfo/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除
export function batchDelete(data) {
  return request({
    url: '/operation/warehouseInfo/batchDelete',
    method: 'DELETE',
    data: data
  })
}

