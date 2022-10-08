import request from "../request"

//  获取任务详情
export function getDetails(id) {
  return request({
    url: `/operation/bjInspectTask/${id}`,
    method: "GET",
  })
}

//  新增运维任务
export function addTasks(params) {
  return request({
    url: "/operation/bjInspectTask/add",
    method: "POST",
    data: params || {}
  })
}

//  分页查询运维任务信息
export function queryByPage(params) {
  return request({
    url: "/operation/bjInspectTask/queryByPage",
    method: "POST",
    data: params || {}
  })
}


//  条件查询站点和桩列表
export function queryStationAndStakeNum(params) {
  return request({
    url: "/property/station/queryStationAndStakeNum",
    method: "POST",
    data: params || {}
  })
}


//  条件查询运维模块列表
export function queryList(params) {
  return request({
    url: "/operation/inspectContent/queryList",
    method: "POST",
    data: params || {}
  })
}

//  获取指定运维模块ID的主子模块信息
export function getListByInspId(inspId) {
  return request({
    url: `/operation/inspectContentDet/getListByInspId/${inspId}`,
    method: "GET",
  })
}


//  分页查询计划、周期工单信息
export function workSheetBjQuery(params) {
  return request({
    url: "/operation/bjWorkSheet/queryByPage",
    method: "POST",
    data: params || {}
  })
}
//  分页查询缺陷工单信息
export function queryDefit(params) {
  return request({
    url: "/operation/bjWorkSheet/queryDefit",
    method: "POST",
    data: params || {}
  })
}
//  分页查询故障工单信息
export function queryFault(params) {
  return request({
    url: "/operation/bjWorkSheet/queryFault",
    method: "POST",
    data: params || {}
  })
}

//  获取处理部门
export function getOperationTree(id) {
  return request({
    url: `/system/group/getOperationTree/${id}`,
    method: "GET",
  })
}
//  获取桩信息
export function operationQueryDevList(staId) {
  return request({
    url: `/property/stake/operationQueryStake/${staId}`,
    method: "GET"
  })
}
export function getOrderDetail(id) {
  return request({
    url: `/operation/bjWorkSheet/getDetail/${id}`,
    method: "GET"
  })
}



//  获取工单子模块详情
export function getSubContent(params) {
  return request({
    url: `/operation/bjWorkSheet/getSubContent?id=${params.id}&inspType=${params.inspType}`,
    method: "GET",
    // data: params || {}
  })
}


//  获取子模块的桩详情
export function getChildDetail(id) {
  return request({
    url: `/operation/bjWorkSheet/getStakeContent/${id}`,
    method: "GET"
  })
}

//  根据工单ID获取处理日志
export function queryLog(sheetId) {
  return request({
    url: `/operation/workSheetProc/queryLog/${sheetId}`,
    method: "GET"
  })
}


  // 通过申请单号获取待办事项消息对象
export function getDetailData(id) {
  return request({
    url: `/system/busTask/getInfo?busId=${id}`,
    method: 'GET'
  })
}


//  通过申请单号获取操纵日志
export function selectInfo(params) {
  return request({
    url: `/system/busProcLog/getInfos`,
    method: "POST",
    data: params || {}
  })
}



//  根据条件返回审核结果值
export function applyResult(params) {
  return request({
    url: "/system/busConfig/selectInfo",
    method: "POST",
    data: params || {}
  })
}


//  计划工单导出
export function onOrderExportExcel(params) {
  return request({
    url: "/operation/bjWorkSheet/onOrderExportExcel",
    method: "POST",
    data: params || {}
  })
}

//  分页查询未处理问题
export function queryProblem(params) {
  return request({
    url: "/operation/bjInspectTask/queryProblem",
    method: "POST",
    data: params || {}
  })
}

//  停运审核
export function examine(params) {
  return request({
    url: "/operation/bjProOptApply/examine",
    method: "POST",
    data: params || {}
  })
}
//  计划和周期
export function taskExamine(params) {
  return request({
    url: "/operation/bjInspectTask/examine",
    method: "POST",
    data: params || {}
  })
}



//  点击删除，作废任务
export function cancel(id) {
  return request({
    url: `/operation/bjInspectTask/cancel/${id}`,
    method: "PUT",
  })
}


//  不更新任务信息，直接点击派发
export function directDispatch(id) {
  return request({
    url: `/operation/bjInspectTask/directDispatch/${id}`,
    method: "PUT",
  })
}

//  更新任务信息，点击派发
export function reDispatch(id,data) {
    return request({
      url: `/operation/bjInspectTask/reDispatch/${id}`,
      method: 'put',
      data: data || {}
    })
  }
//  点击撤回，撤回任务
export function revert(id) {
  return request({
    url: `/operation/bjInspectTask/revert/${id}`,
    method: "PUT",
  })
}
export function bjProOptApply(id) {
  return request({
    url: `/operation/bjProOptApply/${id}`,
    method: 'GET'
  })
}

