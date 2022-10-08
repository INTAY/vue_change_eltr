/**
 * 台区管理 接口
 */
import request from "../request"

// 获取所有信息站点集合
export function getQueryByPage(data) {
  return request({
    url: '/property/assetArea/queryByPage',
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
// 获取点击站点详情

export  function getDetails(id) {
  return request({
    url: `/property/assetArea/getDetails/${id}`,
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


// 新增
export  function addArea(data) {
  return request({
    url: '/property/assetArea/addArea',
    method: 'post',
    data: data || {}
  })
}

//删除
export  function menuDelete(id) {
  return request({
    url: `/property/assetArea/deleteArea/${id}`,
    method: 'post'
  })
}
// 批量删除
export function batchDelete(data) {
  return request({
    url: "/property/assetArea/deleteBatch",
    method: "DELETE",
    data: data
  });
}

// 修改
export  function updateById(data) {
  return request({
    url: `/property/assetArea/updateArea/${data.id}`,
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
//导出
export  function exportExcel(data) {
  return request({
    url: '/property/station/export',
    method: 'post',
    data: data || {}
  })
}

// 导出数据接口
export function exportArea(params) {
  return request({
    url: "/property/assetArea/exportAssetArea",
    method: "post",
    data: params || {}
  })
}
