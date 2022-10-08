
import request from "../request"
//充电桩状态
export function getChargePointStatus(staId) {
  return request({
    url: `/operate/staMonitoring/getChargePointStatus/${staId}`,
    method: 'get',
  })
}
//充电桩实时状态
export function getChargePointStatusInfo(staId) {
return request({
    url: `/operate/staMonitoring/getChargePointStatusInfo/${staId}`,
    method: 'get',
})
}
//获取站点下充电桩的电压、电流、功率、充电电量、费用、开始时间、状态、工单数、故障数
export function d2(staId) {
return request({
    url: `/operate/pileMonitoring/getRealTimeInformationtByStaId/${staId}`,
    method: 'get',
})
}
//当日充电电力
export function getChargingToday(staId) {
  return request({
    url: `/operate/staMonitoring/getChargingToday/${staId}`,
    method: 'get',
  })
}
//故障信息列表
export function getFaultInfo(staId) {
  return request({
    url: `/operate/staMonitoring/getFaultInfo/${staId}`,
    method: 'get',
  })
}
//当日充电电量、当日充电金额、当日充电次数、当日故障数、当日工单数
export function getRealTimeInformationtByStaId(staId) {
  return request({
    url: `/operate/staMonitoring/getRealTimeInformationtByStaId/${staId}`,
    method: 'get',
  })
}
//充电桩信息
export function getStaInfo(staId) {
return request({
    url: `/operate/staMonitoring/getStaInfo/${staId}`,
    method: 'get',
})
}
//充电桩信息(新)getdevInfo
export function getdevInfo(devId) {
  return request({
    url: `/operate/pileMonitoring/getdevInfo/${devId}`,
    method: 'get',
  })
}
//工单信息
export function getWorkSheetInfo(staId) {
  return request({
    url: `/operate/staMonitoring/getWorkSheetInfo/${staId}`,
    method: 'get',
  })
}

//根据充电枪ID获取充电桩详细情况
export function getSetDetails(id) {
  return request({
    url: `/property/connector/${id}`,
    method: 'get',
  })
}
//根据充电枪ID获取充电桩详细情况
export function getSiteDetails(id) {
  return request({
    url: `/property/stake/${id}`,
    method: 'get',
  })
}
//当日充电量、当日充电金额、当日充电次数和当时充电平均时长
export function getRealTime(devId) {
  return request({
    url: `/operate/pileMonitoring/getRealTimeInformationt/${devId}`,
    method: 'get',
  })
}
//实时数据
export function getRealData(devId) {
  return request({
    url: `/operate/pileMonitoring/getRealTimeInfoCharing/${devId}`,
    method: 'get',
  })
}
//实时充电电压电流
export function getRealVoltage(devId) {
  return request({
    url: `/operate/pileMonitoring/getRealTimeVoltageCurrent/${devId}`,
    method: 'get',
  })
}
//充电记录
export function getRechargeRecord(devId) {
  return request({
    url: `/operate/pileMonitoring/getStaList/${devId}`,
    method: 'get',
  })
}
//工单信息
export function getWorkInfo(devId) {
  return request({
    url: `/operate/pileMonitoring/getWorkSheet/${devId}`,
    method: 'get',
  })
}
//故障信息
export function getSiteFaultInfo(devId) {
  return request({
    url: `/operate/pileMonitoring/getFaultInfo/${devId}`,
    method: 'get',
  })
}