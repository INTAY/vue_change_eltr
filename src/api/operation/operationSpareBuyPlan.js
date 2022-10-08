/**
 * 备品备件采购 接口
 */
import request from "../request"

// 查询
export function queryByPage(data) {
  return request({
    url: '/operation/spareBuyPlan/queryByPage',
    method: 'POST',
    data: data || {}
  })
}

// 修改
export function modify(data) {
  return request({
    url: `/operation/spareBuyPlan/update/${data.id}`,
    method: 'PUT',
    data: data || {}
  })
}

// 删除
export function remove(id) {
  return request({
    url: `/operation/spareBuyPlan/delete/${id}`,
    method: 'DELETE'
  })
}

// 批量删除
export function batchDelete(data) {
  return request({
    url: '/operation/spareBuyPlan/batchDelete',
    method: 'DELETE',
    data: data
  })
}

// 保存
export function add(data) {
  return request({
    url: "/operation/spareBuyPlan/add",
    method: "POST",
    data: data || {}
  })
}

// 获取采购计划详情
export function getDetail(id) {
  return request({
    url: `/operation/spareBuyPlan/${id}`,
    method: 'GET'
  })
}

// 获取指定id组织机构用户树
export function getOrgUserTree (id) {
  return request({
    url: `/system/group/getOrgUserTree/${id}`,
    method: 'GET'
  })
}

// 审批指定采购计划
export function approval(data) {
  return request({
    url: "/operation/spareBuyPlanPro/approval",
    method: "PUT",
    data: data || {}
  })
}




