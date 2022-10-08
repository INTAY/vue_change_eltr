/**
 * 园区管理 接口
 */
import request from "../request"

// 获取所有信息站点集合
export function getQueryByPage(data) {
  return request({
    url: '/property/zone/queryByPage',
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
    url: `/property/zone/getDetails/${id}`,
    method: 'get',
  })
}
// 新增
export  function addZone(data) {
  return request({
    url: '/property/zone/addZone',
    method: 'post',
    data: data || {}
  })
}

// 图片上传
export function upPic(data) {
    return request({
      url: "/system/file/upload",
      method: "post",
      data: data || {}
    })
  }


//删除
export  function menuDelete(id) {
  return request({
    url: `/property/zone/deleteZone/${id}`,
    method: 'post'
  })
}
// 批量删除
export function batchDelete(data) {
  return request({
    url: "/property/zone/deleteBatch",
    method: "DELETE",
    data: data
  });
}

// 修改
export  function updateById(data) {
  return request({
    url: `/property/zone/updateZone/${data.id}`,
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
export function exportZone(params) {
  return request({
    url: "/property/zone/exportAssetZone",
    method: "post",
    data: params || {}
  })
}
