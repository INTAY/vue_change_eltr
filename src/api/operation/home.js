/* 首页接口 */
import request from "../request"

export function chargingLoadDay(regId) {
  return request({
    url: `operate/panoramicMonitoring/chargingLoadDay/${regId}`,
    method: 'GET'
  })
}
export function getAssetInfo(regId) {
  return request({
    url: `operate/panoramicMonitoring/getAssetInfo/${regId}`,
    method: 'GET'
  })
}
export function monthChargePower(regId) {
  return request({
    url: `operate/panoramicMonitoring/monthChargePower/${regId}`,
    method: 'GET'
  })
}
export function usageDistribution(regId) {
  return request({
    url: `operate/panoramicMonitoring/usageDistribution/${regId}`,
    method: 'GET'
  })
}

export function usesProportion(regId) {
  return request({
    url: `operate/panoramicMonitoring/usesProportion/${regId}`,
    method: 'GET'
  })
}
export function queryChargRankingTop10(regId) {
  return request({
    url: `largeScreen/equipment/queryChargRankingTop10/${regId}`,
    method: 'GET'
  })
}
export function queryChargStaRankingTop10(regId) {
  return request({
    url: `largeScreen/equipment/queryChargStaRankingTop10/${regId}`,
    method: 'GET'
  })
}
export function queryMapData(regId) {
  return request({
    url: `operate/panoramicMonitoring/queryMapData/${regId}`,
    method: 'GET'
  })
}


