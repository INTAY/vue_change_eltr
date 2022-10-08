/**
 * 前端字典码常量管理
 */

import request, {
  BASE_API
} from "./request"
import da from "element-ui/src/locale/lang/da";
import Vue from "vue";


const DICT_KEY = "dict-"

/**
 * 根据字典码查询字典项方法,异步接口
 *      getDict(DICTDATA.ORG_TYPE).then(res => {
 *        this.orgTypes = res;
 *      });
 * @param {字典码} value
 */
export function getDict(value) {
  if (window.localStorage) {
    var valueStr = window.localStorage.getItem(DICT_KEY + value)
    if (valueStr != null) {
      var jsonObj = JSON.parse(valueStr)
      if (jsonObj != "" || jsonObj != null) {
        return new Promise((resolve, reject) => {
          resolve(jsonObj)
        })
      }
    }
  }

  return new Promise((resolve, reject) => {
    getDictPrivate(value).then(response => {
      if (response.data.length > 0 && window.localStorage) {
        window.localStorage.setItem(DICT_KEY + value, JSON.stringify(response.data))

      }
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 根据字典码查询字典项方法,同步接口
 * @param {字典码} value
 */
export async function getDictSync(value) {
  if (window.localStorage) {
    var valueStr = window.localStorage.getItem(DICT_KEY + value)
    if (valueStr != null) {
      var jsonObj = JSON.parse(valueStr)
      if (jsonObj != "" || jsonObj != null) {
        return jsonObj
      }
    }
  }

  var dictRes = await getDictPrivateSync(value)
  if (dictRes.data.length > 0 && window.localStorage) {
    window.localStorage.setItem(DICT_KEY + value, JSON.stringify(dictRes.data))
  }
  return dictRes.data;
}

// 异步
export function getDictPrivate(value) {
  return request({
    url: `/system/pubDicValue/findByParentId/${value}`,
    method: 'GET'
  })
}

// 同步
export async function getDictPrivateSync(value) {
  return await request({
    url: `/system/pubDicValue/findByParentId/${value}`,
    method: 'GET'
  })
}


/**
 * 所有的字典常量
 */
const DICTDATA = {
  //用户状态
  USER_STATUS: 111,
  //通用状态
  PUB_STATUS: 62,
  // 时间周期
  CYCLE_TIME: 70,
  //组织类型
  ORG_TYPE: 101,
  //业务分类
  SERVICE_TYPE: 103,
  //账户类型
  USER_TYPE: 110,
  //学历
  EDU: 112,
  //资质证书
  QUALITY_TYPE: 113,
  //资质等级
  QUALITY_GRDADE: 116,
  //角色类型
  ROLE_TYPE: 120,
  // 资源类型
  RESOURCE_TYPE: 126,
  //站点类型
  STATION_TYPE: 145,
  //基础设施状态
  INFRASTRUCTURE_STATUS: 200,
  // 设备分类
  DEV_KIND: 201,
  //  设备状态
  UNIT_TYPE: 202,
  // 园区类型
  PARK_TYPE: 210,
  // 站类型
  SITE_TYPE: 220,
  // 能源类型
  ENERGY_TYPE: 221,
  // 能量补给类型
  ENERGY_SUPPLY_TYPE: 223,
  // SIM 卡状态
  SIM_STATUS: 234,
  // 充电桩类型
  STAKE_TYPE: 235,
  // 充电设施
  CHARGE_TYPE: 2015,
  // 建设场所类型
  CONSTRUCTION_TYPE: 224,
  // 充电枪接口类型
  MUZZLE_TYPE: 225,
  // 国际标准
  INTERNATIONAL_STANDARD: 227,
  // 可控等级
  CONTROLLABLE_GRADE: 226,
  // 配变类型
  // DEV_TYPE:230,
  // // 运维工具状态
  MTTOOL_STATUS: 402,
  // 运维预案状态
  INSPECT_CONTENT_STATUS: 403,
  // 运维工具类型
  MTTOOL_TYPE: 2020,

  // 充放电设备
  CHARGE_DISCHARGE_DEVICE: 2040,
  // 储能系统
  ENERGY_STORAGE_SYSTEM: 2014,
  //照明系统
  LIGHTING_SYSTEM: 2012,
  // 光伏发电系统
  PV_SYSTEM: 2013,
  // 配电设备
  PD_DEVICE: 2011,
  // 备品备件状态
  SPARE_STATE: 430,
  // 备品备件采购计划来源
  SPARE_BUY_PLAN_ORIGIN: 431,
  // 通用审批状态
  APPROVE_STATUS: 71,
  // 备件出库审批状态
  SPARE_OUT_APPROVE_STATUS: 434,
  // 备品备件子系统
  SPARE_SYSTEM: 20130,
  // 备品备件单位类型
  SPARE_UNIT_TYPE: 438,
  // 备品备件入库类型
  SPARE_IMPORT_TYPE: 436,
  //  旧件状态
  OLD_PARTS_LIBRARY: 437,
  // 运维设备对象
  DEVOPS_DEVICES_TARGET: 401,
  // 运维任务类型
  DEVOPS_TASK_TYPE: 400,
  // 运维任务状态
  DEVOPS_TASK_STATE: 404,
  // 车联网状态
  VEHICLES_TASK_STATE: 481,
  // 时间周期
  CYCLE_TIME: 70,


  // 停复运来源
  STOP_AFTER_SOURCE: 473,
  // 停运标记
  OFF_STREAM_MARK: 474,

  // 停运原因类型
  OFF_STREAM_TYPE: 475,
  //通信设备状态
  COMM_RTU_STATUS: 500,
  //通道类型
  CHAN_TYPE: 501,
  //规约类型
  CONV_TYPE: 502,
  //通信对象类型
  COMM_OBJ_TYPE: 503,
  //通信设备类型
  COMM_RTU_TYPE: 505,
  // 图片类型
  PICTURE_TYPE: 141,
  // 工单类型
  ORDER_TYPE: 411,
  // 工单状态
  ORDER_STATUS: 412,
  //  工单级别
  ORDER_LEVEL: 410,
  //  工单来源
  ORDER_SOURCE: 416,
  // 停复运类型
  STOP_RESTORE_TYPE: 470,
  // 故障来源
  // 天气
  WEATHER: 146,
  // 空气质量
  AIR_QUALITY: 147,
  // 是否
  WHETHER: 61,
  // 电压等级
  VOLTAGE_GRADE: 231,
  // 电表类型
  AMMETER_TYPE: 233,
  //  设备类型
  DEVICE_TYPE: 2015,
  //  设备状态
  DEVICE_STATUS: 202,
  //  工单处理状态
  ORDER_OPERATE_STATUS: 415,
  // 值的数据类型
  VALUE_DATA_TYPE: 64,
  //  车联网状态
  CAR_INTERNET_STATUS: 481,
  //业务类型
  BUSINSS_TYPE:173,
  // 运维任务状态(北京)
  TASK_TYPE_BJ: 409,
  //  运维任务来源
  TASK_SOURCE: 408,
  //  
  TASK_XS: 71,
  Gl_STATE: 431,
  
};

export {
  DICTDATA
};

// 封装翻译字典数据
export function translatorDict(code, value) {
  let dictArray = [];
  if (localStorage.getItem("dict-" + code) === null) {
    let ajaxHttp = new XMLHttpRequest();
    ajaxHttp.open("GET", BASE_API + "/system/pubDicValue/findByParentId/" + code, false);
    ajaxHttp.setRequestHeader("Authorization", "Bearer  " + Vue.cookie.get('token'));
    ajaxHttp.onreadystatechange = function () {
      if (ajaxHttp.readyState === 4 && ajaxHttp.status === 200) {
        dictArray = JSON.parse(ajaxHttp.responseText).data;
        localStorage.setItem("dict-" + code, JSON.stringify(dictArray));
      }
    };
    ajaxHttp.send(code);
    for (let i = 0; i < dictArray.length; i++) {
      if (dictArray[i].value === value) {
        return dictArray[i].name;
      }
    }
  } else {
    dictArray = JSON.parse(localStorage.getItem("dict-" + code));
    for (let i = 0; i < dictArray.length; i++) {
      if (dictArray[i].value === value) {
        return dictArray[i].name;
      }
    }
  }
}