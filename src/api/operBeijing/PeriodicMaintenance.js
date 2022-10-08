import request from "../request"

// 查询字典参数
export function findByDicId(data) {
  return request({
    url: `/system/pubDicValue/findByParentId/${data}`,
    method: 'GET'
  })
}

// 分页查询 页面列表
export function InspectTaskBjQueryByPage(data) {
    return request({
      url: '/operation/bjInspectTask/queryByPage',
      method: 'POST',
      data: data || {}
    })
  }

//  获取任务详情
export function getDetails(id) {
  return request({
    url: `/operation/bjInspectTask/${id}`,
    method: "GET",
  })
}

// 运维任务条件查询充电桩列表
export function operationQueryDevList(staId) {
  return request({
    url: `/property/stake/operationQueryStake/${staId}`,
    method: 'GET',
  })
}