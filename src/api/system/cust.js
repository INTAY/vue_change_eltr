/* 客户管理接口 */
import request from "../request"

//  分页查询库
export function queryByPage(params) {
  return request({
    url: "/system/customer/queryByPage",
    method: "POST",
    data: params || {}
  })
}

//获取
export function getInfo(id) {
  return request({
    url: `/system/customer/${id}`,
    method: "GET",
})
}

export function modify(params,id) {
  return request({
    url: `/system/customer/${id}`,
    method: "PUT",
    data: params || {}
  })
}

//获取历史详情
export function getHis(params) {
  return request({
    url: `/system/customer/queryChargePage`,
    method: "POST",
    data: params || {}
})
}
//历史报修详情
export function getRep(params) {
  return request({
    url: `/system/customer/queryRepairPage`,
    method: "POST",
    data: params || {}
})
}
//充电场站TOP5
export function getTop(params) {
  return request({
    url: `/system/customer/queryTopStation`,
    method: "POST",
    data: params || {}
})
}

//// 删除
//export function remove(id) {
//return request({
//  url: `/report/rptConf/delete/${id}`,
//  method: 'DELETE'
//})
//}
//
//// 批量删除
//export function batchDelete(data) {
//return request({
//  url: '/report/rptConf/batchDelete',
//  method: 'DELETE',
//  data: data
//})
//}

