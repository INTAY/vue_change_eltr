import request from "../request"


// 通过条件查询站点集合
export function getStationList(params) {
  return request({
    url: "/property/station/queryByConditions",
    method: "POST",
    data: params || {}
  })
}

// 充电桩列表
export function queryByPage(params) {
  return request({
    url: "/property/stake/queryByPage",
    method: "POST",
    data: params || {}
  })
}
// 充电桩附属设备列表
export function queryByStakeId(params) {
  return request({
    url: "/property/detail/selectInfosByStakeId",
    method: "GET",
    data: params || {}
  })
}
// 新增充电桩附属设备
export  function addEqInfo(data) {
  return request({
    url: '/property/detail/addInfo',
    method: 'post',
    data: data || {}
  })
}
// 批量删除附属设备
export function batchDeleteByIds(data) {
  return request({
    url: '/property/detail/deleteByIds',
    method: "DELETE",
    data: data
  });
}
// 获取附属设备详情
export function querySelectInfoById(params) {
  return request({
    url: '/property/detail/selectInfoById',
    method: "GET",
    data: params || {}
  })
}


// 通过Id组织结构获取数据
export function queryOrgById(id) {
  return request({
    url: `/system/group/${id}`,
    method: "GET",
  })
}

// 保存数据
export function saveData(params) {
  return request({
    url: "/property/stake/add",
    method: "POST",
    data: params || {}
  })
}

// 删除
export function deleteData(id) {
  return request({
    url: "/property/stake/" + id,
    method: "DELETE",
  })
}

// 批量删除
export function batchDelete(params) {
  return request({
    url: "/property/stake/batchDelete",
    method: "DELETE",
    data: params || {}
  })
}

// 修改接口
export function modifyData(params) {
  return request({
    url: "/property/stake/" + params.id,
    method: "PUT",
    data: params || {}
  })
}

// 获取站点
export function getStateName(code) {
  return request({
    url: "/property/station/getDetails/" + code,
    method: "GET",
  })
}

// 导出接口
export function exportData(params) {
  return request({
    url: "/property/stake/exportAssetDev",
    method: "POST",
    data: params || {}
  })
}

