import request from "../request"

// 分页查询工单
export function queryByPage(params) {
  return request({
    url: "/operation/workSheet/queryByPage",
    method: "POST",
    data: params || {}
  })
}
//  新增工单
export function addWorkSheet(params) {
  return request({
    url: "/operation/workSheet/add",
    method: "POST",
    data: params || {}
  })
}
//  批量派单
export function dispatch(params) {
  return request({
    url: "/operation/workSheet/dispatch",
    method: "PUT",
    data: params || {}
  })
}
//  派单
export function dispatchById(data) {
  return request({
    url: `/operation/workSheet/dispatchById`,
    method: "PUT",
    data: data||{}
  })
}
//  获取工单详情
export function getDetails(id) {
  return request({
    url: `/operation/workSheet/getDetails/${id}`,
    method: "GET",
  })
}
export function confirmedById(data) {
  return request({
    url: `/operation/workSheet/confirmedById`,
    method: "PUT",
    data: data|| {}
  })
}
//省市区选择框
export function sxqxzk() {
  return request({
    url: `/system/region/getRegionTree?id=-1`,
    method: 'GET',
  })
}

//  获取充电站列表
export function queryChargeList(params) {
  return request({
    url: `/property/station/getStationsByConditions`,
    method: 'POST',
    data: params || {}
  })
}

//  分页查询充电设备信息
export function queryChargeDevice(params) {
  return request({
    url: `/property/stake/queryByPage`,
    method: 'POST',
    data: params || {}
  })
}

export function queryUser(data) {
  return request({
    url: '/system/user/queryByPage',
    method: 'post',
    data: data || {}
  })
}


//  获取充电站信息
export function getStationsByregId(id) {
  return request({
    url: `/property/station/getStationsByregId?regId=${id}`,
    method: 'POST'
  })
}

//  搜索组织机构
export function conditionsQry(data) {
  return request({
    url: `/system/group/conditions`,
    method: 'POST',
    data: data || {}
  })
}

//  根据工单ID和设备ID获取处理记录
export function queryBysheetIdDevId(sheetId, devId) {
  return request({
    url: `/operation/workSheetProc/queryBysheetIdDevId/${sheetId}/${devId}`,
    method: 'GET',
  })
}
//  根据条件分页查询工单备品备件更换记录
export function spareSwitchRecQuery(data) {
  return request({
    url: `/operation/spareSwitchRec/queryByPage`,
    method: 'POST',
    data: data || {}
  })
}

//  根据工单备品备件更换记录ID查询审批列表
export function queryProBySwitchRecId(sheetId) {
  return request({
    url: `/operation/spareSwitchPro/queryProBySwitchRecId/${sheetId}`,
    method: 'GET',
  })
}


