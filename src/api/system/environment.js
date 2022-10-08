import request from "../request"

// 查询渲染列表
export function cx(data) {
  return request({
    url: '/system/pubweather/query',
    method: 'post',
    data: data || {}
  })
}

//新增
export function add(data) {
  return request({
    url: '/system/pubweather/add',
    method: 'post',
    data: data || {}
  })
}

//删除
export function menuDelete(id) {
  return request({
    url: `/system/pubweather/${id}`,
    method: 'delete',
  })
}

// 修改
export function xiuGai(data) {
  return request({
    url: `/system/pubweather/${data.id}`,
    method: 'put',
    data: data || {}
  })
}

//批量删除
export function piliangDelete(data) {
  return request({
    url: '/system/pubweather/deleteByIds',
    method: 'delete',
    data
  })
}

// 导入
export function dr(data) {
  return request({
    url: '/system/pubweather/excleRead',
    method: 'post',
    params: data || {}
  })
}

//导出
export function dc(data) {
  return request({
    url: '/system/pubweather/exportPubWeather',
    method: 'post',
    data: data || {}
  })
}

// 获取组织机构站点树

export function getOrgStationTree(id) {
  return request({
    url: "/system/group/getOrgStationTree?id=" + id,
    method: "GET"
  })
}
