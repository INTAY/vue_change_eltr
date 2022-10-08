import request from "../request"

//省市区三联
export function sxq(id) {
  return request({
    url: `/system/region/${id}`,
    method: 'get',
  })
}
//省市区选择框
export function sxqxzk() {
  return request({
    url: `/system/region/getRegionTree?id=-1`,
    method: 'get',
  })
}
// 查询渲染列表
export function cx(data) {
    return request({
      url: '/system/group/queryByPage',
      method: 'post',
      data: data || {}
    })
  }
//新增
export function add(data) {
  return request({
    url: '/system/group/add',
    method: 'post',
    data: data || {}
  })
}

//删除用户
export function menuDelete(id) {
  return request({
    url: `/system/group/${id}`,
    method: 'delete',
  })
}

//批量删除
export function piliangDelete(data) {
  return request({
    url: '/system/group/batchDelete',
    method: 'delete',
    data
  })
}

//修改用户
export function xiuGai(data) {
  return request({
    url: `/system/group/${data.id}`,
    method: 'put',
    data: data || {}
  })
}
//菜单树
//获取
export function treecx(data) {
  return request({
    url: '/system/group/getOrgTree',
    method: 'get',
    data: data || {}
  })
}




//获取机构数据权限
export function getPower(orgId,roelId) {
  return request({
    url: `/system/orgObjRela?orgId=`+orgId,
    method: 'get'
  })
}

//修改组织机构数据权限
export function updatePower(data) {
  return request({
    url: `/system/orgObjRela/configurePermissions`,
    method: 'post',
    data: data || {}
  })
}

export function getRegionTreeByOrgId(data) {
  return request({
    url: `system/region/getRegionTreeByOrgId?orgId=${data}`,
    method: 'get',
  })
}

