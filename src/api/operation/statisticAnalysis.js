/* 统计分析接口 */
import request from "../request"

//  根据orgid或者区域id
export function getOrgById(id) {
  return request({
    url: `system/group/${id}`,
    method: 'GET'
  })
}
// 查询设施统计
export function getFacilitiesStatistics(regId) {
  return request({
    url: `statisticalAnalysis/chargingFacilitiesStatistics/getFacilitiesStatistics/${regId}`,
    method: 'GET'
  })
}

// 查询充电桩地区分布
export function getFacilitiesRegionalDistribution(regId) {
  return request({
    url: `statisticalAnalysis/chargingFacilitiesStatistics/getFacilitiesRegionalDistribution/${regId}`,
    method: 'GET'
  })
}

// 查询充电桩运营商分布
export function getFacilitiesOperatorsDistribution(regId) {
  return request({
    url: `statisticalAnalysis/chargingFacilitiesStatistics/getFacilitiesOperatorsDistribution/${regId}`,
    method: 'GET'
  })
}

// 充电设施功率利用率
export function queryChargingFacilitiesPowerUtilization(regId) {
  return request({
    url: `statisticalAnalysis/utilizationStatistics/queryChargingFacilitiesPowerUtilization/${regId}`,
    method: 'GET'
  })
}

// 充电设施时间利用率
export function queryChargingFacilitiesTimeUtilization(regId) {
  return request({
    url: `statisticalAnalysis/utilizationStatistics/queryChargingFacilitiesTimeUtilization/${regId}`,
    method: 'GET'
  })
}

// 充电设施率
export function queryChargingFacilityRate(regId) {
  return request({
    url: `statisticalAnalysis/utilizationStatistics/queryChargingFacilityRate/${regId}`,
    method: 'GET'
  })
}

// 地区故障率
export function queryRegionalFaultStatistics(regId) {
  return request({
    url: `statisticalAnalysis/failureRateStatistics/queryRegionalFaultStatistics/${regId}`,
    method: 'GET'
  })
}

// 型号故障率
export function queryModelFaultStatistics(regId) {
  return request({
    url: `statisticalAnalysis/failureRateStatistics/queryModelFaultStatistics/${regId}`,
    method: 'GET'
  })
}

// 厂家故障率
export function queryManufacturerFaultStatistics(regId) {
  return request({
    url: `statisticalAnalysis/failureRateStatistics/queryManufacturerFaultStatistics/${regId}`,
    method: 'GET'
  })
}

// 站点增长率
export function queryStaGrowthRateLine(regId) {
  return request({
    url: `statisticalAnalysis/constructionScaleStatistics/queryStaGrowthRateLine/${regId}`,
    method: 'GET'
  })
}

// 站点增长列表
export function queryStaGrowthRateList(regId) {
  return request({
    url: `statisticalAnalysis/constructionScaleStatistics/queryStaGrowthRateList/${regId}`,
    method: 'GET'
  })
}

// 充电功率
export function getChargePowerStatistics(regId) {
  return request({
    url: `statisticalAnalysis/operationStatistics/getChargePowerStatistics/${regId}`,
    method: 'GET'
  })
}

//  充电量 / 充电次数
export function getChargeQuantityTimeStatistics(regId) {
  return request({
    url: `statisticalAnalysis/operationStatistics/getChargeQuantityTimeStatistics/${regId}`,
    method: 'GET'
  })
}

// 充电信息
export function getChargingInfo(regId) {
  return request({
    url: `statisticalAnalysis/operationStatistics/getChargingInfo/${regId}`,
    method: 'GET'
  })
}

// 负载率、损耗率统计
export function getLoadLossStatistics(regId) {
  return request({
    url: `statisticalAnalysis/operationStatistics/getLoadLossStatistics/${regId}`,
    method: 'GET'
  })
}

//  充电量统计页面 充电量统计折线图近五年
export function queryChargingCapacity(regId) {
  return request({
    url: `statisticalAnalysis/chargeStatistics/queryChargingCapacity/${regId}`,
    method: 'GET'
  })
}

//  充电量统计页面 充电量table列表

export function queryChargingCapacityList(data) {
  return request({
    url: `statisticalAnalysis/chargeStatistics/queryChargingCapacityList`,
    method: 'POST',
    data: data || {}
  })
}

//  充电量统计页面 热力图 充电量热力图


export function queryHeatChart(data) {
  return request({
    url: `charge/staCharStaDay/queryHeatChart`,
    method: 'POST',
    data: data || {}
  })
}

//  历史充电电量、次数、金额5年(regId)
export function queryChargHisLineYear(data) {
  return request({
    url: `charge/staCharRegDay/queryChargHisLineYear`,
    method: 'POST',
    data: data || {}
  })
}
//  按地区
export function getAssetStakeByRegion(regId) {
  return request({
    url: `property/stake/getAssetStakeByRegion/${regId}`,
    method: 'GET'
  })
}
//  按组织机构
export function getAssetStakeByOrg(regId) {
  return request({
    url: `property/stake/getAssetStakeByOrg/${regId}`,
    method: 'GET'
  })
}


//  故障按地区统计
export function getFaultByRegion(data) {
  return request({
    url: `operation/alarmRec/getFaultByRegion`,
    method: 'POST',
    data: data || {}
  })
}
//  故障按设备厂家统计
export function getStakeModelFaultByRegion(data) {
  return request({
    url: `operation/alarmRec/getStakeModelFaultByRegion`,
    method: 'POST',
    data: data || {}
  })
}
// 故障按设备型号统计
export function getStakeFactFaultByRegion(data) {
  return request({
    url: `operation/alarmRec/getStakeFactFaultByRegion`,
    method: 'POST',
    data: data || {}
  })
}

//  增长率， 同比
export function rateOfRiseWithYear(id,date) {
  return request({
    url: `property/station/rateOfRiseWithYear?regId=${id}&yDate=${date}`,
    method: 'POST'
  })
}
// ===================建设规模统计================

//  根据省Id和年份获取充电站分布数量 饼图
export function getStationInfosOrgAndReg(id, date) {
  return request({
    url: `property/station/getStationInfosOrgAndReg?regId=${id}&yDate=${date}`,
    method: 'POST'
  })
}

//  根据省Id和年份获取充电站的地区热点分布， 地图
export function getStationInfos(id, date) {
  return request({
    url: `property/station/getStationInfos?regId=${id}&yDate=${date}`,
    method: 'POST'
  })
}


//  根据地区获取充电桩id集合 充电枪接口树 饼图
export function selectIdsByRegIdAndyDate(id, date) {
  return request({
    url: `property/stake/selectIdsByRegIdAndyDate?regId=${id}&yDate=${date}`,
    method: 'POST'
  })
}

//  根据区域、 组织机构 进行分组数据 饼图
export function selectStakesByRegAndOrgId(id, date) {
  return request({
    url: `property/stake/selectStakesByRegAndOrgId?regId=${id}&yDate=${date}`,
    method: 'POST'
  })
}

//  计算额定功率 根据区域、 组织机构 饼图
export function sumRateByRegIdAndyDate(id, date) {
  return request({
    url: `property/stake/sumRateByRegIdAndyDate?regId=${id}&yDate=${date}`,
    method: 'POST'
  })
}


//  根据省Id和年份获取充电站分布折线增长率 折线
export function countStakeLineByReg(id, data) {
  return request({
    url: `property/station/countStakeLineByReg?regId=${id}`,
    method: 'POST',
    data: data
  })
}


//  =================  运营统计 =======================
//  根据条件查询站点功率、 充电电量、 充电次数折线图(staId)
export function queryPByStaId(data) {
  return request({
    url: `charge/staCharStaDay/queryPByStaId`,
    method: 'POST',
    data: data
  })
}

//  /region/getAllNextReg/{regId}  获取地区
export function getAllNextReg(regId) {
  return request({
    url: `system/region/getAllNextReg/${regId}`,
    method: 'GET'
  })
}

//  /group/operationGroup  运维任务通过条件查询组织机构
export function operationGroup(data) {
  return request({
    url: `system/group/operationGroup`,
    method: 'POST',
    data: data
  })
}


//  ==================利用率统计===========
//  charge/staCharRegDay/queryChargLine
export function queryChargLine(data) {
  return request({
    url: `charge/staCharRegDay/queryChargLine`,
    method: 'POST',
    data: data
  })
}

//  charge/staCharRegDay/queryChargLineGroupByRegId
export function queryChargLineGroupByRegId(data) {
  return request({
    url: `charge/staCharRegDay/queryChargLineGroupByRegId`,
    method: 'POST',
    data: data
  })
}

export function queryChargInfoStaId(data) {
  return request({
    url: `charge/staCharStaDay/queryChargInfoStaId`,
    method: 'POST',
    data: data
  })
}


//  查询充电设施数量和功率
export function getAssetStakeNumberAndPower(regId) {
  return request({
    url: `property/stake/getAssetStakeNumberAndPower/${regId}`,
    method: 'GET'
  })
}


//  统计充电桩直交流充电桩数数据, 额定功率数据
export function getAllTotalDataByRegion(regId) {
  return request({
    url: `property/stake/getAllTotalDataByRegion?regId=${regId}`,
    method: 'GET'
  })
}

