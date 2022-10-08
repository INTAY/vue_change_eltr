/* 旧件库接口 */
import request from "../request"


//  条件查找设备型号列表信息
export function searchEquipment(data) {
  return request({
    url: `/property/assetModel/searchList`,
    data: data || {},
    method: 'POST'
  })
}

//  条件查找生产厂家信息列表
export function searchFactory(data) {
  return request({
    url: `/property/assetFact/searchList`,
    data: data || {},
    method: 'POST'
  })
}

// 获取旧件信息
export function spareUsed(id) {
  return request({
    url: `/operation/spareUsed/${id}`,
    method: 'GET'
  })
}
//  新增旧件信息
export function addParts() {
  return request({
    url: `/operation/spareUsed/add`,
    method: 'POST'
  })
}

//  批量报废旧件信息
export function batchScrapSpare(data) {
  return request({
    url: `/operation/spareUsed/batchScrapSpare`,
    method: 'PUT',
    data: data || {}
  })
}

//  批量确认旧件已修好
export function batchUpdateOk(data) {
  return request({
    url: `/operation/spareUsed/batchUpdateOk`,
    method: 'PUT',
    data: data || {}
  })
}

//  条件查找旧件信息列表
export function queryList(data) {
  return request({
    url: `/operation/spareUsed/queryList`,
    method: 'POST',
    data: data || {}
  })
}

//  分页条件查找旧件信息
export function queryPage(data) {
  return request({
    url: `/operation/spareUsed/queryPage`,
    method: 'POST',
    data: data || {}
  })
}
//  报废旧件信息
export function scrapSpare(id,data) {
  return request({
    url: `/operation/spareUsed/scrapSpare/${id}`,
    method: 'PUT',
    data: data || {}
  })
}
//  确认旧件已修好
export function updateOk(id) {
  return request({
    url: `/operation/spareUsed/updateOk/${id}`,
    method: 'PUT'
  })
}
