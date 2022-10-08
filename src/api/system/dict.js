import request from "../request"

export let dictArray = [];


//树状图
export function treelb() {
  return request({
    url: "/system/pubDicValue/getPubDicTree",
    method: 'get',
  })
};




// 根据父字典码获取所有子级字典
export function findByParentId(data) {
  return request({
    url: "/system/pubDicValue/findByParentId/" + data.value,
    method: 'GET',
  })
}

//根据树状图ID渲染列表
export function treefa(id) {
  return request({
    url: `/system/pubDicvalue/findByDicId/${id}`,
    method: 'get',
  })
}

// 查询渲染列表
export function cx(data) {
  return request({
    url: '/system/pubDicValue/queryPage',
    method: 'post',
    data: data || {}
  })
}

//新增
export function add(data) {
  return request({
    url: '/system/pubDicValue/add',
    method: 'post',
    data: data || {}
  })
}

//删除
export function remove(id) {
  return request({
    url: `/system/pubDicValue/delete/${id}`,
    method: 'DELETE',
  })
}

// 修改
export function xiuGai(data) {
  return request({
    url: `/system/pubDicValue/update/${data.id}`,
    method: 'PUT',
    data: data || {}
  })
}

//批量删除
export function piliangDelete(data) {
  return request({
    url: '/system/pubDicValue/deleteIds',
    method: 'delete',
    data
  })
}

// 通过Id获取数据
export function getPicValue(data) {
  return request({
    url: '/system/pubDicValue/' + data.value,
    method: "get"
  })
}
