import request from "../request"


// 查询列表
export function queryInfoList(params) {
  return request({
    url: "/property/connector/queryByPage",
    method: "POST",
    data: params || {}
  })
}

// 获取详情接口
export function queryDetail(id) {
  return request({
    url: "/property/connector/" + id,
    method: "GET",
  })
}

// 新增接口
export function addInfo(params) {
  return request({
    url: "/property/connector/add",
    method: "POST",
    data: params || {}
  })
}

// 删除接口
export function deleteById(id) {
  return request({
    url: "/property/connector/" + id,
    method: "delete",
  })
}

// 批量删除接口
export function bDelete(params) {
  return request({
    url: "/property/connector/batchDelete",
    method: "delete",
    data: params || {}
  })
}

// 修改数据接口
export function modifyInfo(params) {
  return request({
    url: "/property/connector/" + params.id,
    method: "put",
    data: params || {}
  })
}

// 导出数据接口
export function exportConn(params) {
  return request({
    url: "/property/connector/exportAssetCon",
    method: "post",
    data: params || {}
  })
}
