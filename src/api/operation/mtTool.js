/**
 * 运维工具管理 接口
 */
import request from "../request"

// 新增
export function add(data) {
  return request({
    url: '/operation/operation/mt-tool/add',
    method: 'POST',
    data: data || {}
  })
}

// 修改
export function modify(data) {
  return request({
    url: `/operation/operation/mt-tool/update/${data.id}`,
    method: 'PUT',
    data: data || {}
  })
}

// 删除
export function remove(data) {
  return request({
    url: `/operation/operation/mt-tool/${id}`,
    method: 'DELETE',
    data: data || {}
  })
}

// 批量删除
export function removeAll(data) {
  return request({
    url: '/operation/operation/mt-tool/deleteByIds',
    method: 'DELETE',
    data: data
  })
}

// 查询运维预案
export function search(data) {
  return request({
    url: '/operation/operation/mt-tool/conditions',
    method: 'POST',
    data: data || {}
  })
}

// 导出
export function exportMtTool(data) {
  return request({
    url: '/operation/operation/mt-tool/exportMtTool',
    method: 'POST',
    data: data || {}
  })
}

// 导入
export function excleRead(data) {
  return request({
    url: '/operation/operation/mt-tool/excleRead',
    method: 'POST',
    data: data || {}
  })
}

// 查询字典参数
export function findByDicId(data) {
  return request({
    url: `/system/pubDicValue/findByParentId/${data}`,
    method: 'GET'
  })
}

// 根据类型查厂家
export function searchFactByType(data) {
  return request({
    url: '/property/assetFact/searchList',
    method: 'POST',
    data: data || {}
  })
}

// 根据类型、厂家，查型号
export function searchModel(data) {
  return request({
    url: '/property/assetModel/searchList',
    method: 'POST',
    data: data || {}
  })
}


