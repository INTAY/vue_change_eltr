import request from "../request"

// 组织机构树
export function getOrgTree() {
  return request({
    url: "/system/group/getOrgTree",
    method: "GET",
  })
}

// 根据用户获取组织结构树
export function getOrgById(id) {
  return request({
    url: "/system/group/" + id,
    method: "GET",
  })
}

// 用户组织机构树
export function getOrgUserTree(id) {
  return request({
    url: "/system/group/getOrgUserTree/" + id,
    method: "GET",
  })
}

// 获取运维方案列表
export function queryList(queryParams) {
  return request({
    url: "/operation/inspectContent/queryList",
    method: "POST",
    data: queryParams || {}
  })
}

// 获取指定运维预案信息
export function getDetail(id) {
  return request({
    url: `/operation/inspectContent/${id}`,
    method: 'GET'
  })
}

// 分页查询组织机构
export function queryOrgByPage(params) {
  return request({
    url: "/system/group/queryByPage",
    method: "POST",
    data: params || {}
  })
}

// 运维任务分页查询组织机构
export function queryDevOpsOrgByPage(params) {
  return request({
    url: "/system/group/operationGroupPage",
    method: "POST",
    data: params || {}
  })
}

// 获取运维充电桩数据
export function queryOperationQueryDevPage(params) {
  return request({
    url: "/property/assetDev/operationQueryDevPage",
    method: "POST",
    data: params || {}
  })
}

//运维站点分页查询业务
export function getStateList(params) {
  return request({
    url: '/property/station/operationQueryStationList',
    method: 'POST',
    data: params || {}
  })
}

//运维站点分页查询业务
export function getOperationQueryPage(params) {
  return request({
    url: '/property/station/operationQueryPage',
    method: 'POST',
    data: params || {}
  })
}

// 获取区域数据
export function getAreas(id) {
  return request({
    url: "/system/region/getRegionTree?id=" + id,
    method: "get",

  })
}

// 获取站点数据
export function getQueryByPage(data) {
  return request({
    url: '/property/station/queryByPage',
    method: 'post',
    data: data || {}
  })
}

// 新增运维任务
export function addDevOpsTask(data) {
  return request({
    url: "/operation/inspectTask/add",
    method: "POST",
    data: data || {}
  })
}

// 获取运维任务
export function getInspectTask(id) {
  return request({
    url: "/operation/inspectTask/" + id,
    method: "POST",
  })
}



