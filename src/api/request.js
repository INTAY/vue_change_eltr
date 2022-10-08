// 接口请求异常的处理
import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import {Message, Loading} from 'element-ui'
// export const BASE_API = 'http://192.168.0.103:8843';
// export const BASE_URL = 'http://192.168.0.103:8000/file/excel_template';

export const BASE_API = IPCONFIG
export const BASE_URL = IPCONFIG_BASEURL;

var otime =null;
let refreshTokenFlag = false;
let requestList = [];

function executeRequests(index) {
  if (index < requestList.length) {
    requestList[index]().then(() => {
      executeRequests(index + 1)
    })
  } else {
    refreshTokenFlag = false
    requestList.splice(0, requestList.length)
  }
}

let loading 
function startLoading() {    
  loading = Loading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(255, 255, 255, 0.7)'
  })
}
function endLoading() {    
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJzeXNtYW5lciIsInJvbGVJZCI6IjEwMCIsImF1dGhvcml0aWVzIjpbInN5c21hbmVyIl0sIm9yZ0lkIjoiMTAwIiwiY2xpZW50X2lkIjoidGVzdF9jbGllbnQiLCJhcHBSb2xlSWQiOm51bGwsInNjb3BlIjpbInJlYWQiXSwib3JnYW5pemF0aW9uIjoic3lzbWFuZXIiLCJuYW1lIjoi57O757uf566h55CG5ZGYIiwiaWQiOiIxMDAiLCJzdGF0ZSI6MSwiZXhwIjoxNjA4NjQzMDQ2LCJqdGkiOiJSemQ5dF9wZ2FiLTM4WWhuMktaSTRjZTJCZE0iLCJ1c2VybmFtZSI6InN5c21hbmVyIn0.ps1MaBAe-3jJ04zjBg54Qj3n52BBbPn5dXtCIw4U6bU
export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

const service = axios.create({
  baseURL: BASE_API,
  timeout: 10000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    let token = Vue.cookie.get('token');
  	if (token) {
    	config.headers['Authorization'] = "Bearer " + token // 请求头带上token
    }
    showFullScreenLoading()
    return config
  },
  error => {
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)
var otime_s = 0;
var otime_ = setInterval(function(){
				if (otime_s) {
					Message({
		       message: '登录已过期,请重新登陆',
			      type: 'error',
			    });
				}
  		},250)
service.interceptors.response.use(response => {
  tryHideFullScreenLoading()
  if (response.data && response.data.status == '4444') {
  		otime_s = 1;
			setTimeout(function(){
				otime_s = 0;
				router.push('/login')
			},100)
  		
  }
  else if (response.data && response.data.status == '4446'){
  		Message({
	  		message: '您的账户已过期，已有新用户登录',
	      type: 'error',
	    });
	    
	    setTimeout(function(){
	    	router.push('/login')
//	    	window.location.reload(true);
	    },100)
  }
    return response.data
  },
  error => {
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)
//图片验证码地址
service.captchaPath = (params) => {
  return BASE_API + "/authentication/verifiCode/getVerifiCode?uuid=" + params;
}

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
service.adornUrl = (actionName) => {
  return BASE_API + actionName
}

service.uploadUrl = () => {
  return BASE_API + "/system/file/upload";
}

service.modifyUrl = () => {
  return BASE_API + "/system/pic/update";
}

//充电桩
service.importExcelStakeUrl = () => {
  return BASE_API + "/property/stake/importExcel"
};
//充电枪
service.importExcelConnUrl = () => {
  return BASE_API + "/property/connector/importExcel"
};
// 储能电池
service.importExcelBatUrl = () => {
  return BASE_API + "/property/assetEsbat/importExcel"
};
// 储能设备
service.importExcelEsUrl = () => {
  return BASE_API + "/property/assetEs/importExcel"
};
// 园区
service.importExcelZoneUrl = () => {
  return BASE_API + "/property/zone/importExcel"
};
// 线路管理
service.importExcelLineUrl = () => {
  return BASE_API + "/property/assetLine/importExcel"
};
// 光伏
service.importExcelPvUrl = () => {
  return BASE_API + "/property/assetPv/importExcel"
};
// 站点
service.importExcelStationUrl = () => {
  return BASE_API + "/property/station/importExcel"
};
// 台区
service.importExcelAreaUrl = () => {
  return BASE_API + "/property/assetArea/importExcel"
};
// 配变
service.importExcelTransUrl = () => {
  return BASE_API + "/property/assetTrans/importExcel"
};
// 知识库上传
service.knowledgeUploadUrl = () => {
  return BASE_API + "/fileStore/uploadMultipartFileStore?uploadType=1";
}
export default service
