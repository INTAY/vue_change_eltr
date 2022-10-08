/**
 * 运维预案管理 接口
 */
import request from "../request"

// 查询组织机构树
export function searchTreeDataOrg() {
  return request({
    url: "",
    method: "POST",
    data: data || {}
  })
}

// 新增运维预案
export function add(data) {
  return request({
    url: '/operation/inspect-content/add',
    method: 'POST',
    data: data || {}
  })
}

// 修改运维预案
export function modify(data) {
  return request({
    url: `/operation/inspect-content/${id}`,
    method: 'PUT',
    data: data || {}
  })
}

// 作废运维预案
export function cancel(data) {
  return request({
    url: `/operation/inspect-content/${id}`,
    method: 'DELETE',
    data: data || {}
  })
}

// 查询运维预案
export function search(data) {
  return request({
    url: '/operation/inspect-content/conditions',
    method: 'POST',
    data: data || {}
  })
}




