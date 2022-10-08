/**
 * 备品备件出库管理 接口
 */
import request from "../request"

// 查询字典参数
export function findByDicId(data) {
  return request({
    url: `/system/pubDicValue/findByParentId/${data}`,
    method: 'GET'
  })
}

// 查询
export function queryByPage(data) {
  return request({
    url: '/operation/spareExportRec/queryPage',
    method: 'POST',
    data: data || {}
  })
}

// 查询待选备品备件列表
export function searcToBeSelect(data) {
  return request({
    url: '/operation/spareStoreRec/searcToBeSelect',
    method: 'POST',
    data: data || {}
  })
}
// 查询可出库备品备件列表
export function querySpareInfoPage(data) {
  return request({
    url: '/operation/spareInfo/querySpareInfoPage',
    method: 'POST',
    data: data || {}
  })
}

//  根据条件分页查询库房信息
export function warehouseQueryByList(params) {
  return request({
    url: "/operation/warehouseInfo/queryList",
    method: "POST",
    data: params || {}
  })
}

// 新增备品备件出库
export function addSpareExportRec(data) {
  return request({
    url: '/operation/spareExportRec/add',
    method: 'POST',
    data: data || {}
  })
}

// 获取指定id组织机构用户树
export function getOrgUserTree (id) {
  return request({
    url: `/system/group/getOrgUserTree/${id}`,
    method: 'GET'
  })
}

// 获取出库申请单详情
export function getSpareExportRec(id) {
  return request({
    url: `/operation/spareExportRec/${id}`,
    method: 'GET'
  })
}

// 审批出库申请单
export function approval(data) {
  return request({
    url: '/operation/spareExportPro/approval',
    method: 'PUT',
    data: data || {}
  })
}

//  作废出库申请单
export function reject(id) {
  return request({
    url: `/operation/spareExportRec/updateVoid/${id}`,
    method: 'PUT'
  })
}



