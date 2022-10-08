/**
 * 运维预案库 接口
 */
import request from "../request"

// 获取运维模块库树
export function getInspectLibTree(id) {
    return request({
        url: `/operation/inspectLib/getInspectLibTree/${id}`,
        method: "GET"
    })
}

// 新增一个运维预案库数据
export function add(data) {
    return request({
        url: '/operation/inspectLib/add',
        method: "POST",
        data: data || {}
    })
}

// 根据id修改运维预案库预案
export function modify(data) {
    return request({
        url: `/operation/inspectLib/update/${data.id}`,
        method: "PUT",
        data: data || {}
    })
}

// 新增一个运维预案配置
export function addDetail(data) {
    return request({
        url: '/operation/inspectLibDetail/add',
        method: "POST",
        data: data || {}
    })
}

// 根据id修改运维预案库预案配置
export function updateDetail(data) {
    return request({
        url: `/operation/inspectLibDetail/update/${data.id}`,
        method: "PUT",
        data: data || {}
    })
}

// 根据条件分页查询叶子节点运维预案库预案信息
export function queryPage(data) {
    return request({
        url: '/operation/inspectLib/queryPage',
        method: "POST",
        data: data || {}
    })
}

// 根据id删除指定的运维预案库预案
export function handleNodeDel(id) {
    return request({
        url: `/operation/inspectLib/${id}`,
        method: "DELETE"
    })
}

// 批量删除运维模块库
export function batchDelete(data) {
    return request({
        url: '/operation/inspectLib/deleteByIds',
        method: "DELETE",
        data: data || {}
    })
}

// 根据id删除指定的运维预案库预案配置
export function removeDetail(id) {
    return request({
        url: `/operation/inspectLibDetail/${id}`,
        method: "DELETE"
    })
}

// 批量删除运维预案库预案配置
export function removeAllDetail(data) {
    return request({
        url: '/operation/inspectLibDetail/deleteByIds',
        method: "DELETE",
        data: data || {}
    })
}



// 配置检查项
  export function updateByLibId(data) {
    return request({
        url: `/operation/inspectLibDetail/updateByLibId`,
        method: "PUT",
        data: data || {}
    })
}

// 根据id获取检查项
export function queryInspectList(id) {
    return request({
        url: `/operation/inspectLibDetail/queryList/${id}`,
        method: "GET"
    })
}


