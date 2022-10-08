/**
 * 运维任务管理 接口
 */
import request from "../request"

// 根据条件分页查询运维任务信息
export function queryByPage(data) {
  return request({
    url: '/operation/inspectTask/queryByPage',
    method: 'POST',
    data: data || {}
  })
}

// 根据条件查询站点
export function operationQueryStationList(data) {
  return request({
    url: '/property/station/operationQueryStationList',
    method: 'POST',
    data: data || {}
  })
}

// 新增运维任务
export function save(data) {
  return request({
    url: '/operation/inspectTask/add',
    method: 'POST',
    data: data || {}
  })
}

// 修改运维任务
export function modify(data) {
  return request({
    url: `/operation/inspectTask/update/${data.id}`,
    method: 'PUT',
    data: data || {}
  })
}

// 运维任务条件查询充电桩列表
export function operationQueryDevList(data) {
  return request({
    url: '/property/stake/operationQueryDevList',
    method: 'POST',
    data: data || {}
  })
}

// 获取指定id运维任务信息
export function getInspectTaskById(id) {
  return request({
    url: `/operation/inspectTask/${id}`,
    method: 'GET'
  })
}

// 审批运维任务
export function approval(data) {
  return request({
    url: "/operation/inspectTask/approval",
    method: 'PUT',
    data: data || {}
  })
}

// 启动运维任务
export function voidInspectTask(id) {
  return request({
    url: `/operation/inspectTask/voidInspectTask/${id}`,
    method: 'PUT'
  })
}

// 停止运维任务
export function lussuedInspectTask(id) {
  return request({
    url: `/operation/inspectTask/lussuedInspectTask/${id}`,
    method: 'PUT'
  })
}

