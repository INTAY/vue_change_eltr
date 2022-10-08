 
import request from "../request"

export function overall(data) {
  return request({
    url: '/hlht/statistics/overall',
    method: 'POST',
    data: data || {}
  })
}
//  订单传输监测
export function orderMonitor(data) {
  return request({
    url: '/hlht/order/orderMonitor',
    method: 'POST',
    data: data || {}
  })
}
//  获取订单详情
export function orderDetail(id) {
  return request({
    url: `/hlht/order/${id}`,
    method: 'GET'
  })
}
//订单推送列表
export function queryOrderPushPage(data) {
  return request({
    url: '/hlht/order/queryOrderPushPage',
    method: 'POST',
    data: data || {}
  })
}
//状态变化推送及时率指标统计
export function statusChangeTimelyRate(data) {
  return request({
    url: '/hlht/statistics/statusChangeTimelyRate',
    method: 'POST',
    data: data || {}
  })
}
//状态变化推送及时率详情
export function statusChangeTimelyRateDetail(data) {
  return request({
    url: `/hlht/statistics/statusChangeTimelyRateDetail`,
    method: 'POST',
    data: data || {}
  })
}
//状态固定推送及时率指标统计
export function statusFixTimelyRate(data) {
  return request({
    url: '/hlht/statistics/statusFixTimelyRate',
    method: 'POST',
    data: data || {}
  })
}
//状态固定推送及时率详情
export function statusFixTimelyRateDetail(data) {
  return request({
    url: `/hlht/statistics/statusFixTimelyRateDetail`,
    method: 'POST',
    data: data || {}
  })
}


//获取订单修改信息 (修改)
export function editInfo(staId) {
  return request({
    url: `/hlht/order/editInfo/${staId}`,
    method: 'GET'
  })
}
//  获取补推记录 (预览)
export function editRec(staId) {
  return request({
    url: `/hlht/editRec/${staId}`,
    method: 'GET'
  })
}

//  新增补推记录
export function editRecAdd(data) {
  return request({
    url: '/hlht/editRec/add',
    method: 'POST',
    data: data || {}
  })
}


//  获取订单推送信息
export function pushInfo(staId) {
  return request({
    url: `/hlht/order/pushInfo/${staId}`,
    method: 'GET'
  })
}

//  获取订单接收信息
export function receiveInfo(staId) {
  return request({
    url: `/hlht/order/receiveInfo/${staId}`,
    method: 'GET'
  })
}

//  根据父id做三级联动查询
export function region(staId) {
  return request({
    url: `/system/region/${staId}`,
    method: 'GET'
  })
}

//  搜索站点
export function queryStationByRegAndName(data) {
  return request({
    url: '/hlht/asset/queryStationByRegAndName',
    method: 'POST',
    data: data || {}
  })
}

//  状态传输监测
export function stateMonitor(data) {
  return request({
    url: '/hlht/state/stateMonitor',
    method: 'POST',
    data: data || {}
  })
}

//  状态推送记录
export function queryPushList(data) {
  return request({
    url: '/hlht/state/queryPushList',
    method: 'POST',
    data: data || {}
  })
}

//  状态接收记录
export function queryReceiveList(data) {
  return request({
    url: '/hlht/state/queryReceiveList',
    method: 'POST',
    data: data || {}
  })
}

//  获取枪的订单记录和状态数据
export function getOrderListAndState(data) {
  return request({
    url: '/hlht/order/getOrderListAndState',
    method: 'POST',
    data: data || {}
  })
}
//  获取枪的固定推送及时数
export function getFixTimelyNum(data) {
  return request({
    url: '/hlht/statistics/getFixTimelyNum',
    method: 'POST',
    data: data || {}
  })
}



//  订单传输监测列表导出
export function exportMonitorData(data) {
  return request({
    url: '/hlht/order/exportMonitorData',
    method: 'POST',
    data: data || {}
  })
}

//  状态传输监测列表导出
export function exportStateMonitor(data) {
  return request({
    url: '/hlht/state/exportStateMonitor',
    method: 'POST',
    data: data || {}
  })
}

//  订单推送列表导出
export function exportPushData(data) {
  return request({
    url: '/hlht/order/exportPushData',
    method: 'POST',
    data: data || {}
  })
}


export let chargeType = [
  { value: 160, label: '账号在线充电消费' },
  { value: 161, label: '二维码充电消费' },
  { value: 162, label: '充电卡消费' },
  { value: 163, label: '即插即充' },
]
export let pushHealth = [
  { value: 0, label: '不及时' },
  { value: 1, label: '及时' },
  { value: 2, label: '延迟或不稳定' },
]
// 推送结果
export let pushResult = [
  { value: 1, label: '首推成功' },
  { value: 6, label: '补推成功' },
  { value: 0 , label: '待推送' },
  { value: 2, label: '推送失败' },
]
//  推送状态
export const PUSHSTATEMAP = [
  { value: 0, label: '待推送' },
  { value: 2, label: '首次推送失败' },
  { value: 6, label: '补推成功' },
  { value: 7, label: '推送失败' },
]


export let justResult = [
  { value: 0, label: '失败' },
  { value: 1, label: '成功' }
]
export let healthMap = [
  { value: 0, label: '不及时' },
  { value: 1, label: '及时' },
]

export let isYes = [
  { value: 0, label: '否' },
  { value: 1, label: '是' }
]
export let jidu = [
  { value: 1, label: '第一季度' },
  { value: 2, label: '第二季度' },
  { value: 3, label: '第三季度' },
  { value: 4, label: '第四季度' },
]
export let repushResultMap = [
  { value: 0, label: '失败' },
  { value: 1, label: '成功' },
]
export let pustMapList = [
  { value: 1, label: '首推成功' },
  { value: 6, label: '补推成功' },
  { value: 0, label: '待推送' },
  { value: 2, label: '推送失败' },
]
export function getQuartorStartDate(year, quarter) {
  let startMonth = 1;
  if (quarter == 1) {
    startMonth = 1;
  } else if (quarter == 2) {
    startMonth = 4;
  } else if (quarter == 3) {
    startMonth = 7;
  } else if (quarter == 4) {
    startMonth = 10;
  }
  let endMonth = startMonth + 2;
  if (quarter == 0) {
    endMonth = 12
  }
  const startDate = year + "-" + formatDate(startMonth) + '-01';
  const endDate = year + '-' + formatDate(endMonth) + '-' + new Date(year, endMonth, 0).getDate()
  this.formInline.getTime = [startDate, endDate]
}
//格式化月和日为MM、dd
export function formatDate(value){
  if (value < 10) {
    value = "0" + value;
  }
  return value;
}









