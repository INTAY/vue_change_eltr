import request from "../request"


// 查询list列表数据
export function queryList(params) {
  return request({
    url: "/property/assetEs/queryByPage",
    method: "post",
    data: params || {},
  })
}
// 新增接口
export function addInfo(params) {
  return request({
    url: "/property/assetEs/add",
    method: "post",
    data: params || {},
  })
}
// 修改接口
export function updateInfo(params) {
  return request({
    url: "/property/assetEs/"+params.id,
    method: "put",
    data: params || {},
  })
}
// 删除接口
export function deleteInfo(id) {
  return request({
    url: "/property/assetEs/"+id,
    method: "delete",
  })
}
// 批量删除接口
export function batchDelete(params) {
  return request({
    url: "/property/assetEs/batchDelete",
    method: "delete",
    data:params||{},
  })
}

// 导出数据接口
export function exportEs(params) {
  return request({
    url: "/property/assetEs/exportAssetEs",
    method: "post",
    data: params || {}
  })
}

