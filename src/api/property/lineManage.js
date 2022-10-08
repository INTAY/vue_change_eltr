import request from "../request"

// 列表
export function queryList(params) {
  return request({
    url: "/property/assetLine/queryByPage",
    method: "post",
    data: params || {}
  })
}

// 新增
export function addInfo(params) {
  return request({
    url: "/property/assetLine/add",
    method: "post",
    data: params || {}
  })
}

// 修改
export function modifyInfo(params) {
  return request({
    url: "/property/assetLine/" + params.id,
    method: "PUT",
    data: params || {}
  })
}

// 删除
export function deleteInfoById(id) {
  return request({
    url: "/property/assetLine/" + id,
    method: "delete",
  })
}

// 批量删除
export function batchDeleteInfo(params) {
  return request({
    url: "/property/assetLine/batchDelete",
    method: "delete",
    data: params || {}
  })
}

// 获取详情
export function queryDetailById(id) {
  return request({
    url: "/property/assetLine/" + id,
    method: "GET",
  })
}

// 获取详情
export function exportAssetLine(params) {
  return request({
    url: "/property/assetLine/exportAssetLine",
    method: "POST",
    data: params || {}
  })
}
// 导出数据接口
export function exportLine(params) {
  return request({
    url: "/property/assetLine/exportAssetLine",
    method: "post",
    data: params || {}
  })
}
