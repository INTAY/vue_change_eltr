import request from "../request"

// 获取未处理的待办事项数量
export  function getEcommission() {
    return request({
      url: '/system/busTask/getUnDealListAndCount',
      method: 'get',
    })
  }

// 代办事项查询
export function getEcommissionPage(data) {
    return request({
      url: '/system/busTask/queryPage',
      method: 'post',
      data: data || {}
    })
  }