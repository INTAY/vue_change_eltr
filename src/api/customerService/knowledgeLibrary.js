// 知识库
import request from "../request"

//  获取知识库类别树
export function getTree() {
    return request({
        url: `/system/knowType/getTree`,
        method: 'GET'
    })
}
//  获取知识库x详情
export function knowDetail(id) {
    return request({
        url: `/system/knowDetail/${id}`,
        method: 'GET'
    })
}
//  修改知识库详情
export function modifyKnowDetail(data) {
    return request({
        url: `/system/knowDetail/${data.id}`,
        data: data || {},
        method: 'PUT'
    })
}

//  删除知识库详情信息
export function delKnowDetail(id) {
    return request({
        url: `/system/knowDetail/${id}`,
        method: 'DELETE'
    })
}
//  新增知识库详情信息
export function add(data) {
    return request({
        url: `/system/knowDetail/add`,
        data: data || {},
        method: 'POST'
    })
}

//  批量删除知识库详情信息
export function batchDelete(data) {
    return request({
        url: `/system/knowDetail/batchDelete`,
        data: data,
        method: 'DELETE'
    })
}

//  分页查询知识库详情
export function queryByPage(data) {
    return request({
        url: `/system/knowDetail/queryByPage`,
        data: data || {},
        method: 'POST'
    })
}

//  获取知识库类别
export function getKnowType(id) {
    return request({
        url: `/system/knowType/${id}`,
        method: 'GET'
    })
}
//  修改知识库类别
export function modKnowType(data) {
    return request({
        url: `/system/knowType/${data.id}`,
        data: data || {},
        method: 'PUT'
    })
}
export function delKnowType(id) {
    return request({
        url: `/system/knowType/${id}`,
        method: 'DELETE'
    })
}
export function addKnowType(data) {
    return request({
        url: `/system/knowType/add`,
        data: data || {},
        method: 'POST'
    })
}
//  获取知识库日志
export function getEditRec(id) {
    return request({
        url: `/system/knowDetail/getEditRec/${id}`,
        method: 'GEt',
    })
}

//  文件上传， form中的文件字段名必须为file
export function uploadFile() {
    return request({
        url: `/filestore/fileStore/uploadMultipartFileStore?uploadType=1`,
        method: 'POST'
    })
    
}


