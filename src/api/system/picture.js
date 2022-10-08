import request from "../request";
import fi from "element-ui/src/locale/lang/fi";

let BASE_API = 'http://39.98.156.143:8843'

// 查询渲染列表
export function queryData(params) {
  return request({
    url: '/system/pic/queryByPage',
    method: 'post',
    data: params || {}
  })
}

//新增
export function saveFile(data) {
  return request({
    url: '/system/pic/saveFile',
    method: 'post',
    data: data || {}
  })
}

// 图片上传
export function upPic(data) {
  return request({
    url: "/system/file/upload",
    method: "post",
    data: data || {}
  })
}

//获取某张图片
export function getObjectPic(fileid) {
  return request({
    url: `/system/file/${fileid}`,
    method: 'put',
  })
}

// 修改
export function modifyPic(data) {
  return request({
    url: `/system/pic/update`,
    method: 'post',
    data: data || {},
  })
}

// 删除
export function deleBatch(data) {
  return request({
    url: `/system/pic/deleteBatch`,
    method: 'delete',
    data: data || {}
  })
}

// 获取图片路径
export function getObjectPicPath(id) {
  return request({
    url: '/system/file/getFilePath?id=' + id,
    method: "get",
  })
}
