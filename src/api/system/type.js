import request from "../request"

// 查询渲染列表
export function cx(data) {
  return request({
    url: '/property/assetModel/conditions',
    method: 'post',
    data: data || {}
  })
}
// 获取型号列表
export function queryModelList(data) {
  return request({
    url: '/property/assetModel/searchList',
    method: 'post',
    data: data || {}
  })
}
//获取设备型号查询
export function getModelById(id) {
  return request({
    url: "/property/assetModel/" + id,
    method: "GET"
  })
}

//新增
export function add(data) {
  return request({
    url: '/property/assetModel/add',
    method: 'post',
    data: data || {}
  })
}

//删除
export function menuDelete(id) {
  return request({
    url: `/property/assetModel/${id}`,
    method: 'delete',
  })
}

// 修改
export function xiuGai(data) {
  return request({
    url: `/property/assetModel/${data.id}`,
    method: 'put',
    data: data || {}
  })
}

//批量删除
export function piliangDelete(data) {
  return request({
    url: '/property/assetModel/batchDeleteAssetModel',
    method: 'delete',
    data
  })
}

//配置信息里面的接口
// 配置查询
export function pzcx(id) {
  return request({
    url: `/property/assetModelPara/assetModelParaList?modelId=${id}`,
    method: 'post',
  })
}

//配置新增
export function pzadd(data) {
  return request({
    url: `/property/assetModelPara/add/${data.modelId}`,
    method: 'post',
    data: data || {}
  })
}

//配置删除
export function pzmenuDelete(id) {
  return request({
    url: `/property/assetModelPara/${id}`,
    method: 'delete',
  })
}

//配置修改
export function pzxiuGai(data) {
  return request({
    url: `/property/assetModelPara/${data.id}`,
    method: 'put',
    data: data || {}
  })
}

// 获取厂家列表
export function getFactorys(data) {
  return request({
    url: "/property/assetFact/searchList",
    method: "post",
    data: data || {}
  })
}

// 根据id 获取厂家信息
export function getFactory(id) {
  return request({
    url: "/property/assetFact/" + id,
    method: "GET",
  })
}

export function getObjectPic(data) {
  return request({
    url: '/system/file/getFilePath?id=' + data.picId,
    method: "get",
  })
}
