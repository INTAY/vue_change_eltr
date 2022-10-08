import request from "../request"
const urlPre = "comm";

// 查询渲染列表
export  function cx(data) {
    return request({
      url: urlPre+'/commConv/queryByPage',
      method: 'post',
      data: data || {}
    })
  }
//新增
export  function add(data) {
    return request({
      url: urlPre+'/commConv/save',
      method: 'post',
      data: data || {}
    })
  }

//删除
export  function menuDelete(id) {
    return request({
      url: urlPre+`/commConv/delete/${id}`,
      method: 'delete',
    })
  }
// 修改
export  function xiuGai(data) {
    return request({
      url: urlPre+`/commConv/update/${data.id}`,
      method: 'put',
      data: data || {}
    })
  }
//批量删除
export  function piliangDelete(data) {
    return request({
      url: urlPre+'/commConv/deleteBatch',
      method: 'delete',
      data
    })
}


