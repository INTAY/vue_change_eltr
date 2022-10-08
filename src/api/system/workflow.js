import request from "../request"

// 查询流程配置列表
export function getEcommissionPage(data) {
  return request({
    url: '/system/busConfig/queryList',
    method: 'post',
    data: data || {}
  })
}

//新增流程配置
export function busConfigAdd(data) {
  return request({
    url: '/system/busConfig/add',
    method: "POST",
    data: data || {}
  })
}
//流程配置详情
export function busConfigParticulars(data) {
  return request({
    url: `/system//busConfig/${data.busType}/${data.applyOrgId}`,
    method: "GET"
  })
}
//删除流程配置
export function busConfigDel(data) {
  return request({
    url: `/system//busConfig/${data.busType}/${data.applyOrgId}`,
    method: "DELETE"
  })
}

//获取部门ID下用户
export function queryByDeptData(deptId) {
  return request({
    url: `/system/user/queryByDept?deptId=${deptId}`,
    method: "GET",
  })
}
//获取组织机构ID下部门
export function getDepartment(id) {
  return request({
    url: `/system/group/getDepartment?id=${id}`,
    method: "GET",
  })
}
