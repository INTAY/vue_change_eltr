import request from "../request"

export function queryFact(data) {
    return request({
      url: `/operation/bjWorkSheet/queryFact`,
      method: 'post',
      data: data || {}
    })
  }


export function queryDefit(data) {
    return request({
      url: `/operation/bjWorkSheet/queryDefit`,
      method: 'post',
      data: data || {}
    })
  }


export function queryFault(data) {
    return request({
      url: `/operation/bjWorkSheet/queryFault`,
      method: 'post',
      data: data || {}
    })
  }
//缺陷详情
export function getDefitDetail(id) {
    return request({
      url: `/operation/bjWorkSheet/getDefitDetail/${id}`,
      method: 'get',
    })
  }
//故障详情
export function getFaultDetail(id) {
    return request({
      url: `/operation/bjWorkSheet/getFaultDetail/${id}`,
      method: 'get',
    })
  }
//工单详情
export function getDetails(id) {
    return request({
      url: `/operation/bjWorkSheet/getDetails/${id}`,
      method: 'get',
    })
  }

//特殊巡视 获取指定预案类型的主子模块信息
export function getListByInspType(inspType) {
    return request({
      url: `/operation/inspectContentDet/getListByInspType/${inspType}`,
      method: 'get',
    })
  }

//特殊巡视 北京运维条件查询桩列表
export function queryOperationBjStake(data) {
    return request({
      url: `/property/stake/queryOperationBjStake`,
      method: 'post',
      data: data || {}
    })
  }

//作废任务
export function cancel(id) {
    return request({
      url: `/operation/bjInspectTask/cancel/${id}`,
      method: 'put',
    })
  }
//重新派发运维任务
export function reDispatch(id,data) {
    return request({
      url: `/operation/bjInspectTask/reDispatch/${id}`,
      method: 'put',
      data: data || {}
    })
  }
//派发  不更新任务
export function directDispatch(id) {
    return request({
      url: `/operation/bjInspectTask/directDispatch/${id}`,
      method: 'put',
    })
  }
//撤回任务
export function revert(id) {
    return request({
      url: `/operation/bjInspectTask/revert/${id}`,
      method: 'put',
    })
  }

export function exportExcel_1(data) {
  return request({
    url: '/operation/bjWorkSheet/exportExcel',
    method: 'post',
    data: data || {}
  })
}

export function exportExcel_2(data) {
  return request({
    url: '/operation/bjWorkSheet/faultExportExcel',
    method: 'post',
    data: data || {}
  })
}

export function exportExcel_3(data) {
  return request({
    url: '/operation/bjWorkSheet/factExportExcel',
    method: 'post',
    data: data || {}
  })
}


export function getOrgTreeByUser() {
  return request({
    url: '/system/group/getOrgTreeByUser',
    method: 'get',
  })
}
export function getAllNextUser(orgId) {
  return request({
    url: `/system/group/getAllNextUser/${orgId}`,
    method: 'get',
  })
}


