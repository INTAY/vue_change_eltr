/**
 * 备品备件库 接口
 */
import request from "../request"

// 新增
export function add(data) {
  return request({
    url: '/operation/spareStoreRec/batchAdd',
    method: 'POST',
    data: data || {}
  })
}


// 分页查询
export function queryPage(data) {
  return request({
    url: '/operation/spareInfo/queryPage',
    method: 'POST',
    data: data || {}
  })
}

// 查询字典参数
export function findByDicId(data) {
  return request({
    url: `/system/pubDicValue/findByParentId/${data}`,
    method: 'GET'
  })
}

// 根据类型查厂家
export function searchFactByType(data) {
  return request({
    url: '/property/assetFact/searchList',
    method: 'POST',
    data: data || {}
  })
}

// 根据类型、厂家，查型号
export function searchModel(data) {
  return request({
    url: '/property/assetModel/searchList',
    method: 'POST',
    data: data || {}
  })
}

// 获取相关出库申请单
export function getRelated(id) {
  return request({
    url: `operation/spareStoreRec/getRelated/${id}`,
    method: 'GET'
  })
}

// 查询备品备件入库记录
export function conditions(data) {
  return request({
    url: 'operation/spareStoreRec/conditions',
    method: 'POST',
    data: data || {}
  })
}

// 获取指定备品信息信息
export function getSpareInfo(id) {
  return request({
    url: `operation/spareInfo/${id}`,
    method: 'GET'
  })
}

// 根据id报废备品信息
export function scrapSpare(param) {
  return request({
    url: `operation/spareInfo/scrapSpare/${param.id}`,
    method: 'PUT',
    data: param || {}
  })
}






