import request from "../request"
const urlPre = "comm/commChanPara";

// 查询渲染列表
export  function cx(data) {
    return request({
      url: urlPre+'/queryByPage',
      method: 'post',
      data: data || {}
    })
  }
//新增
export  function add(data) {
    return request({
      url: urlPre+'/save',
      method: 'post',
      data: data || {}
    })
  }

//删除
export  function menuDelete(id) {
    return request({
      url: urlPre+`/delete/${id}`,
      method: 'delete',
    })
  }
// 修改
export  function xiuGai(data) {
    return request({
      url: urlPre+`/update/${data.id}`,
      method: 'put',
      data: data || {}
    })
  }
//批量删除
export  function piliangDelete(data) {
    return request({
      url: urlPre+'/deleteBatch',
      method: 'delete',
      data
    })
}


