/**
 * 运维预案 接口
 */
import request from "../request"

// 获取指定id的组织机构树
export function getOrgTree() {
  return request({
    url: `/system/group/getOrgTree`,
    method: 'GET'
  })
}

// 新增getDetail
export function add(data) {
  return request({
    url: '/operation/inspectContent/add',
    method: 'POST',
    data: data || {}
  })
}

// 根据条件分页查询运维预案
export function queryPage(data) {
  return request({
    url: '/operation/inspectContent/queryPage',
    method: 'POST',
    data: data || {}
  })
}

// 删除
export function remove(id) {
  return request({
    url: `/operation/inspectContent/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除
export function batchDelete(data) {
  return request({
    url: '/operation/inspectContent/batchDelete',
    method: 'DELETE',
    data: data
  })
}

// 更新
export function updateById(data) {
  return request({
    url: `/operation/inspectContent/updateById/${data.id}`,
    method: 'PUT',
    data: data || {}
  })
}

// 更改状态
export function updateStatus(id) {
  return request({
    url: `/operation/inspectContent/updateStatus/${id}`,
    method: 'PUT'
  })
}

// 获取指定运维预案信息
export function getDetail(id) {
  return request({
    url: `/operation/inspectContent/${id}`,
    method: 'GET'
  })
}

// 根据条件查询运维预案列表
export function queryList(data) {
  return request({
    url: '/operation/inspectContent/queryList',
    method: 'POST',
    data: data || {}
  })
}

