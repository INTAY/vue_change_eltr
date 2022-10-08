import request from "../request"
// 查询通讯地址号
export  function getRtuAddr(data) {
  return request({
    url: '/comm/commRtu/queryByPage',
    method: 'post',
    data: data || {}
  })
}

// 查询渲染列表
export  function queryByPage(data) {
  return request({
    url: '/property/assetTrans/queryByPage',
    method: 'post',
    data: data || {}
  })
}
// 设备相关列表
export  function getFact(data) {
  return request({
    url: '/property/assetFact/searchList',
    method: 'post',
    data: data || {}
  })
}

// 获取台区
export function getQueryByPageStage(data) {
  return request({
    url: '/property/assetArea/queryByPage',
    method: 'post',
    data: data || {}
  })
}
// 获取园区
export function getQueryByPageGarden(data) {
  return request({
    url: '/property/zone/queryByPage',
    method: 'post',
    data: data || {}
  })
}
// 获取线路
export function queryAssetLine(params) {
  return request({
    url: "/property/assetLine/queryByPage",
    method: "post",
    data: params || {}
  })
}

// 获取指定id的组织机构树
export function getOrgTree() {
  return request({
    url: `/system/group/getOrgTree`,
    method: 'get'
  })
}


//新增
export function addDatas(data) {
  return request({
    url: '/property/assetTrans/add',
    method: 'post',
    data: data || {}
  })
}
//删除
export  function menuDelete(id) {
  return request({
    url: `/property/assetTrans/${id}`,
    method: 'delete',
  })
}

//批量删除
export  function checkDelete(data) {
  return request({
    url: `/property/assetTrans/batchDelete`,
    method: 'delete',
    data: data || {}
  })
}
//查询配变信息
export function searDatas(data) {
  return request({
    url: '/property/assetTrans/conditions',
    method: 'post',
    data: data || {}
  })
}
//修改
export function modiData(data) {
  return request({
    url: `/property/assetTrans/${data.id}`,
    method: 'put',
    data: data || {}
  })
}
// 详情

export  function getDetails(id) {
  return request({
    url: `/property/assetTrans/${id}`,
    method: 'get'
  })
}
//省市区选择框
export function getRegId() {
  return request({
    url: `/system/region/getRegionTree?id=-1`,
    method: 'get',
  })
}

// 导出数据接口
export function exportTrans(params) {
  return request({
    url: "/property/assetTrans/exportAssetTrans",
    method: "post",
    data: params || {}
  })
}
