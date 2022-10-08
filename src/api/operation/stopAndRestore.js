/**
 * 备品备件出库管理 接口
 */
import request from "../request"

export function formatDateTime(data) {
  if (data == null) {
    return "";
  }
  let dt = new Date(data);
  return (
    dt.getFullYear() +
    "-" +
    (dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) +
    "-" +
    (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()) +
    " " +
    (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) +
    ":" +
    (dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes())  +
    ":" +
    (dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds())
  );
}

//  根据父id做三级联动查询
export function region(staId) {
    return request({
      url: `/system/region/${staId}`,
      method: 'GET'
    })
  }
  

//  搜索站点
export function queryStationByRegAndName(data) {
    return request({
      url: '/property/station/queryStationAndStakeNum',
      method: 'POST',
      data: data || {}
    })
  }
  
  // 分页查询停复运设备信息
export function proOptDevQueryByPage(data) {
  return request({
    url: '/operation/bjProOptDev/queryPage',
    method: 'POST',
    data: data || {}
  })
}
// 分页条件查找停复运申请信息
  export function queryByPage(data) {
    return request({
      url: '/operation/bjProOptApply/queryPage',
      method: 'POST',
      data: data || {}
    })
  }
  
  // 根据id获取停复运申请信息
export function getProOptApplyBjDetail(id) {
  return request({
    url: `/operation/bjProOptApply/${id}`,
    method: 'GET'
  })
}

  // 根据id获取停复运申请信息
  export function queryByPlanId(planId) {
    return request({
      url: `/operation/bjProOptDev/queryByPlanId/${planId}`,
      method: 'GET'
    })
  }
  
  // 新增停复运申请信息
export function addProOptApplyBj(data) {
  return request({
    url: '/operation/bjProOptApply/add',
    method: 'POST',
    data: data || {}
  })
}

// 搜索站点 
export  function queryStations(data) {
  return request({
    url: '/property/station/queryByPage',
    method: 'post',
    data: data || {}
  })
}
// 获取站点下的桩信息
export  function queryChargeList(data) {
  return request({
    url: '/property/stake/queryByPage',
    method: 'post',
    data: data || {}
  })
}

// 通过申请单号获取操纵日志
export  function getInfos(data) {
  return request({
    url: '/system/busProcLog/getInfos',
    method: 'get',
    data: data || {}
  })
}
