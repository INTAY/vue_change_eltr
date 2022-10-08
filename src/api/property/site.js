/**
 * 站点管理 接口
 */
import request from "../request"

// 站点信息
export function getQueryByPage(data) {
  return request({
    url: '/property/station/queryByPage',
    method: 'post',
    data: data || {}
  })
}
// 条件查找生产厂家信息列表
export function getQueryByPage2(data) {
  return request({
    url: '/property/assetFact/searchList',
    method: 'post',
    data: data || {}
  })
}
// 条件查找生产厂家信息列表
export function getQueryByPage3(data) {
  return request({
    url: '/property/station/queryStations',
    method: 'post',
    data: data || {}
  })
}
//省市区三联
export function sxq(id) {
  return request({
    url: `/system/region/${id}`,
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

// 获取指定id的组织机构树
export function getOrgTree() {
  return request({
    url: `/system/group/getOrgTree`,
    method: 'get'
  })
}

 // 获取点击站点详情

 export  function getDetails(id) {
  return request({
    url: `/property/station/getDetails/${id}`,
    method: 'get'
  })
}
// 新增
export  function addStation(data) {
  return request({
    url: '/property/station/addStation',
    method: 'post',
    data: data || {}
  })
}

//删除
export  function menuDelete(id) {
  return request({
    url: `/property/station/deleteStation/${id}`,
    method: 'delete',
  })
}
// 批量删除
export function batchDelete(data) {
  return request({
    url: "/property/station/deleteBatch",
    method: "DELETE",
    data: data
  });
}

// 修改
export  function modification(data) {
  return request({
    url: `/property/station/updateStation/${data.id}`,
    method: 'put',
    data: data || {}
  })
}

// 导入
export  function dr(data) {
  return request({
    url: '/property/',
    method: 'post',
    params: data || {}
  })
}

// 通过条件获取站点结合
export  function queryByConditions(data) {
  return request({
    url: '/property/station/queryByConditions',
    method: 'post',
    data: data || {}
  })
}

export  function getStationNameByRegId(regId) {
  return request({
    url: '/property/station/getStationsNameByRegId?regId='+regId,
    method: 'post',
  })
}
// 导出数据接口
export function exportStation(params) {
  return request({
    url: "/property/station/exportAssetStation",
    method: "post",
    data: params || {}
  })
}
