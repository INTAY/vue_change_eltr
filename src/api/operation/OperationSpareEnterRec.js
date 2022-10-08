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

// 分页查询 页面列表
export function queryByPage(data) {
  return request({
    url: '/operation/spareImportRec/queryPage',
    method: 'POST',
    data: data || {}
  })
}
// 详情页面备品备件列表
export function spareInfoQueryByPage(data) {
  return request({
    url: '/operation/spareInfo/queryPage',
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
//  根据条件分页查询旧件信息
export function spareUsedQueryByList(params) {
  return request({
    url: "/operation/spareUsed/queryList",
    method: "POST",
    data: params || {}
  })
}

// 根据条件查询采购计划信息列表
export function queryListBuyPlan(params) {
  return request({
    url: "/operation/spareBuyPlan/queryList",
    method: "POST",
    data: params || {}
  })
}
// 根据id获取采购内容
export function getPlanDetail(planId) {
  return request({
    url: `/operation/spareBuyPlanDetail/queryByPlanId/${planId}`,
    method: 'GET'
  })
}

// 新增
export function addSpareImportRec(data) {
  return request({
    url: '/operation/spareImportRec/batchAdd',
    method: 'POST',
    data: data || {}
  })
}

// 获取指定id组织机构用户树
export function getOrgUserTree(id) {
  return request({
    url: `/system/group/getOrgUserTree/${id}`,
    method: 'GET'
  })
}

// 获取入库申请单详情
export function getDetails(id) {
  return request({
    url: `/operation/spareImportRec/${id}`,
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
