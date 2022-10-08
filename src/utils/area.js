import {city} from "../api/data/area";
import da from "element-ui/src/locale/lang/da";

export let regName = "";
export let regCode = "";


// 获取区域全名
export function getRegNameByCode(code) {
  for (let i = 0; i < city.length; i++) {
    if (Number(city[i].code) === Number(code)) {
      regCode = city[i].name;
      return regCode
    }
    for (let j = 0; j < city[i].children.length; j++) {
      if (Number(city[i].children[j].code) === Number(code)) {
        regCode = city[i].name + '/' + city[i].children[j].name;
        return regCode;
      }
      for (let n = 0; n < city[i].children[j].children.length; n++) {
        if (Number(city[i].children[j].children[n].code) === Number(code)) {
          if (city[i].children[j].name.indexOf("市辖区") !== -1) {
            regCode = city[i].name + '/' + city[i].children[j].children[n].name;
            return regCode;
          }
          if (city[i].children[j].name.indexOf("市辖区") === -1) {
            regCode = city[i].name + '/' + city[i].children[j].name + '/' + city[i].children[j].children[n].name;
            return regCode;
          }
        }
      }
    }
  }

}

export function getRegNameByCode2(code) {
		let regCode = [];
	  for (let i = 0; i < city.length; i++) {
	    if (Number(city[i].code) === Number(code)) {
	      regCode.push(city[i].code)
	      return regCode
	    }
	    for (let j = 0; j < city[i].children.length; j++) {
	      if (Number(city[i].children[j].code) === Number(code)) {
	        regCode.push(city[i].code)
	        regCode.push(city[i].children[j].code);
	        return regCode;
	      }
	      for (let n = 0; n < city[i].children[j].children.length; n++) {
	        if (Number(city[i].children[j].children[n].code) === Number(code)) {
	          if (city[i].children[j].name.indexOf("市辖区") !== -1) {
	            regCode.push(city[i].code);
	            regCode.push(code);
	            return regCode;
	          }
	          if (city[i].children[j].name.indexOf("市辖区") === -1) {
	          	regCode.push(city[i].code);
	            regCode.push(city[i].children[j].code);
	            regCode.push(city[i].children[j].children[n].code);
	            return regCode;
	          }
	        }
	      }
	    }
	  }
	  
	
	}
// 封装到map中，直接取
export function packageDataToMap(code) {
  let mapData = new Map();
  for (let i = 0; i < city.length; i++) {
    mapData.set(city[i].code, city[i].name);
    for (let j = 0; j < city[i].children.length; j++) {
      mapData.set(city[i].children[j].code, city[i].name + city[i].children[j].name);
      for (let n = 0; n < city[i].children[j].children.length; n++) {
        if (city[i].children[j].name.indexOf("市辖区") !== -1) {
          mapData.set(city[i].children[j].children[n].code, city[i].name + city[i].children[j].children[n].name);
        }
        if (city[i].children[j].name.indexOf("市辖区") === -1) {
          mapData.set(city[i].children[j].children[n].code, city[i].name + city[i].children[j].name + city[i].children[j].children[n].name);
        }
      }
    }
  }
  if (mapData.get(code) !== undefined) {
    regName = mapData.get(code);
  } else {
    regName = "";
  }
}

// 组织机构翻译数据
export let orgName = "";
export let map = new Map();

export function packageOrgToMap(orgCode) {
  let array = [];
  array = JSON.parse(localStorage.getItem("insData"));
  if (array.length !== 0) {
    recursion(array);

  }
  if (map.get(orgCode) !== undefined) {
    return map.get(orgCode);
  } else {
    return null;
  }
}

// 递归方法
export function recursion(data) {
  for (let i in data) {
    map.set(data[i].id, data[i].name);
    if (data[i].children.length !== 0) {
      recursion(data[i].children)
    }
  }
}

/**
 * 区域下拉级联选择器所需要的区域数据
 */
export async function getAreaSelectData() {
  let data = [];
  let localData = localStorage.getItem('regTree');

  if (!localData) {
    const res = await getRegionTree();
    data = res.data.children;
    localStorage.setItem(regTree, JSON.stringify(data));
  } else {
    data = JSON.parse(localData);
  }
  
  return data;
}
