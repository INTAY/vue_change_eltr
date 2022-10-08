/**
 * 园区管理 接口
 */
import request from "../request"

// 获取充电桩个数、实时功率、今日充电量、本月充电量、本年度充电量
export  function getRealTimeInformationt() {
  return request({
    url: `/operate/multiplestaMonitoring/getRealTimeInformationt`,
    method: 'get',
  })
}
//省市区选择框
export function sxqxzk() {
  return request({
    url: `/system/region/getRegionTree?id=-1`,
    method: 'get',
  })
}
//根据充电站ID获取充电站详情
export function getDetails(id) {
  return request({
    url: `/property/station/getDetails/${id}`,
    method: 'get',
  })
}

// 获取所有信息站点集合
export function queryByConditions(data) {
  return request({
    url: '/property/station/queryByConditions',
    method: 'post',
    data: data || {}
  })
}

// 地图站点聚合
export function mapSiteAggregation(data) {
  return request({
    url: '/operate/multiplestaMonitoring/mapSiteAggregation',
    method: 'post',
    data: data || {}
  })
}

//站点实时状态
export function queryDevRealStatus(staId) {
  return request({
    url: `/operate/panoramicMonitoring/queryDevRealStatus/${staId}`,
    method: 'get',
  })
}
//实时功率表
export function queryPLineTodayByRegId(regId) {
  return request({
    url: `/charge/hisCurveRegion/queryPLineTodayByRegId/${regId}`,
    method: 'get',
  })
}

//实时功率表
export function queryGroupDataByRegId(orgId) {
  return request({
    url: `system/group/${orgId}`,
    method: 'get',
  })
}
