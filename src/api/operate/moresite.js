
import request from "../request"
//充电桩状态
export function queryData(data) {
    return request({
      url: `/operate/multiplestaMonitoring/queryByPage`,
      method: 'post',
      data: data || {}
    })
  }



//当日充电电量、当日充电金额、当日充电次数、当日故障数、当日工单数
export function getRealTimeInformationtByStaId(data) {
return request({
    url: `/operate/multiplestaMonitoring/getRealTimeInformationtByStaId`,
	    method: 'post',
		data: data || {}
	})
}

//年   404
export function getRealTimeInformationt(staId) {
  return request({
    url: `/operate/multiplestaMonitoring/getRealTimeInformationt`,
    method: 'get',
  })
}
