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
//  分页查询未处理问题
export function queryProblem(data) {
  return request({
    url: "/operation/bjInspectTask/queryProblem",
    method: "POST",
    data: data || {}
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


//  根据任务ID撤回任务
export function taskRevert(taskId) {
  return request({
    url: `/operation/bjInspectTask/revert/${taskId}`,
    method: "PUT"
  })
}
//  根据任务ID派发任务
export function taskSend(taskId) {
  return request({
    url: `/operation/bjInspectTask/directDispatch/${taskId}`,
    method: "PUT"
  })
}
//  根据任务ID修改任务
export function taskModify(data) {
  return request({
    url: `/operation/bjInspectTask/reDispatch/${data.id}`,
    method: "PUT",
    data: data || {}
  })
}
//  根据任务ID删除任务
export function taskdel(taskId) {
  return request({
    url: `/operation/bjInspectTask/cancel/${taskId}`,
    method: "PUT"
  })
}
  // 巡视任务导出
  export function exportDataBj(data) {
    return request({
      url: '/operation/bjInspectTask/taskExportExcel',
      method: 'POST',
      data: data || {}
    })
  }
// 根据当前登录人获取组织机构树
export function getOrgTreeByUser() {
  return request({
    url: `/system/group/getOrgTreeByUser`,
    method: 'GET'
  })
}
//  通过组织Id获取下级用户
// export function getNextUsers(id) {
//   return request({
//     url: `/system/group/getAllNextUser/${id}`,
//     method: "GET",
//   })
// }

//  获取下级用户
export function getUserTree() {
  return request({
    url: `/system/group/getCurrentOrgUserTree`,
    method: "GET",
  })
}
//  根据任务ID忽略任务
export function ignore(params) {
  return request({
    url: `/operation/bjInspectTask/ignore?id=${params.id}&ignoreReason=${params.ignoreReason}`,
    method: "PUT",
    data: params || {} 
  })
}
