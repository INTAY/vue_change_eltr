import request from "../request"
const urlPre = "comm";

// 查询渲染列表
export  function cx(data) {
    return request({
      url: urlPre+'/commRtu/queryByPage',
      method: 'post',
      data: data || {}
    })
  }
//新增
export  function add(data) {
    return request({
      url: urlPre+'/commRtu/save',
      method: 'post',
      data: data || {}
    })
  }

//删除
export  function menuDelete(id) {
    return request({
      url: urlPre+`/commRtu/delete/${id}`,
      method: 'delete',
    })
  }
// 修改
export  function xiuGai(data) {
    return request({
      url: urlPre+`/commRtu/update/${data.id}`,
      method: 'put',
      data: data || {}
    })
  }
//批量删除
export  function piliangDelete(data) {
    return request({
      url: urlPre+'/commRtu/deleteBatch',
      method: 'delete',
      data
    })
}

// 通道列表
export function chanList(data) {
  return request({
    url:  urlPre+'/commChanPara/searchList',
    method: 'POST',
    data: data || {}
  })
}

// 规约列表
export function convList(data) {
  return request({
    url:  urlPre+'/commConv/searchList',
    method: 'POST',
    data: data || {}
  })
}


