import request from "../request"

// 查询渲染列表
export function cx(data) {
  return request({
    url: '/property/assetFact/conditions',
    method: 'post',
    data: data || {}
  })
}

// 通过条件查询生产厂家列表
export function queryFactorys(parmas) {
  return request({
    url: '/property/assetFact/searchList',
    method: 'post',
    data: parmas || {}
  })
}

//新增
export function add(data) {
  return request({
    url: '/property/assetFact/add',
    method: 'post',
    data: data || {}
  })
}

//删除
export function menuDelete(id) {
  return request({
    url: `/property/assetFact/${id}`,
    method: 'delete',
  })
}

// 修改
export function xiuGai(data) {
  return request({
    url: `/property/assetFact/${data.id}`,
    method: 'put',
    data: data || {}
  })
}

//批量删除
export function piliangDelete(data) {
  return request({
    url: '/property/assetFact/batchDeleteAssetFact',
    method: 'delete',
    data
  })
}

// 获取区域
export function getRegObjectById(id) {
  return request({
    url: "/system/region/getRegionByRegId/" + id,
    method: "GET",
  })
}

// 根据Id获取生产厂家

export function getFactoryById(id) {
  return request({
    url: "/property/assetFact/" + id,
    method: "GET"
  })
}

