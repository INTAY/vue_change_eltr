import request from "../request"

// 列表
export function queryList(params) {
  return request({
    url: "/property/assetEsbat/queryByPage",
    method: "POST",
    data: params || {}
  })
}

// 新增
export function addInfo(params) {
  return request({
    url: "/property/assetEsbat/add",
    method: "POST",
    data: params || {}
  })
}

// 修改
export function modifyInfo(params) {
  return request({
    url: "/property/assetEsbat/" + params.id,
    method: "PUT",
    data: params || {}
  })
}

// 删除
export function deletInfoById(id) {
  return request({
    url: "/property/assetEsbat/" + id,
    method: "delete",
  })
}

// 批量删除
export function batchDeleteInfo(params) {
  return request({
    url: "/property/assetEsbat/batchDelete",
    method: "delete",
    data: params || {}
  })
}

// 获取详情
export function queryInfo(id) {
  return request({
    url: "/property/assetEsbat/" + id,
    method: "GET",
  })
}

// 导出数据接口
export function exportEsBat(params) {
  return request({
    url: "/property/assetEsbat/exportAssetEs",
    method: "post",
    data: params || {}
  })
}

