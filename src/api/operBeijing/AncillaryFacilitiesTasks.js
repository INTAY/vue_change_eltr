// 附属设施任务制定
import request from "../request"


//派发人接口
export function getCurrentOrgUserTree() {
    return request({
      url: `/system/group/getCurrentOrgUserTree`,
      method: 'GET'
    })
  }