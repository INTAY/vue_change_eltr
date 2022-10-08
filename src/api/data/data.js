import request from '@/api/request'
//获取单个
export const getData = (params) => {
	return request({
	    url: '/system/pub-doc/'+params,
	    method: 'get'
	})
}
//获取全部
export const getDatas = (params) => {
	return request({
	    url: '/system/pub-doc/all',
	    method: 'get'
	})
}
//增加
export function addDatas(data) {
  return request({
    url: '/system/pub-doc/add',
    method: 'post',
    data: data || {}
  })
}
//删除
export const delData = (params) => {
	return request({
	    url: '/system/pub-doc/delete/'+params,
	    method: 'delete'
	})
}
//批量删除
export  function delDatas(data) {
  return request({
    url: `/system/pub-doc/deleteBatch`,
    method: 'delete',
    data: data || {}
  })
}
//查询
export function searDatas(data) {
  return request({
    url: '/system/pub-doc/queryByPage',
    method: 'post',
    data: data || {}
  })
}
//修改
export function modiData(data) {
  return request({
    url: `/system/pub-doc/update/${data.id}`,
    method: 'put',
    data: data || {}
  })
}