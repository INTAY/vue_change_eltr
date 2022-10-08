import request from "./request"

// 根据当前登录人获取组织机构树
export function getOrgTreeByUser() {
  return request({
    url: `/system/group/getOrgTreeByUser`,
    method: 'GET'
  })
}

// 获取所有组织机构树
export function getOrgTree() {
  return request({
    url: `/system/group/getOrgTree`,
    method: 'GET'
  })
}

// 获取省市区区域数据树
export function getRegionTree() {
  return request({
    url: `/system/region/getRegionTree?id=-1`,
    method: 'get',
  })
}

// 获取指定id组织机构用户树 -1即取全部
export function getOrgUserTree (id) {
  return request({
    url: `/system/group/getOrgUserTree/${id}`,
    method: 'GET'
  })
}

//权限过滤的数据
export function getPowerOrgTree() {
  return request({
    url: "/system/group/getPowerOrgTree",
    method: 'get',
  })
};

//获取当前用户运维单位树
export function getOperationTree() {
  return request({
    url: "/system/group/getOperationTree",
    method: 'get',
  })
};
//获取当前用户运维单位树
export function getOperationTreeTaske(taskType) {
  return request({
    url: `/system/group/getOperationTree/${taskType}`,
    method: 'get',
  })
};
