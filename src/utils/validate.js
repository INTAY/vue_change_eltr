export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function findTreeId(array, id) {
    let stack = [];
    let going = true;
    let walker = (array, id) => {
        array.forEach(item => {
            if (!going) return;
            stack.push(item['id']);
            if (item['id'] === id) {
                going = false;
            } else if (item['children']) {
                walker(item['children'], id);
            } else {
                stack.pop();
            }
        });
        if (going) stack.pop();
    }
    walker(array, id);
    if(stack.length&&stack){
    	return stack;
    }else{
    	return ['-1']
    }
    
}

export function filPath(str){
	if (str) {
		if (str.includes('_')) {
			return str.substring(0,str.indexOf('_'))
		} else {
			return str
		}
	}
}

//转路径
export function tranformStr(str){
    var strArr=str.split('');
    for(var i=1;i<strArr.length;i++){
        if(strArr[i]=='-' || strArr[i]=='_'){
            //删除'-'
            strArr.splice(i,1);
            //转大写
            if(i<strArr.length){
                strArr[i]=strArr[i].toUpperCase();
            }
        }
    }
    return strArr.join('');
}

//路由的
export function recursionData(menuTree){
  var routes = []
  // 一级肯定是模块
	for(let i = 0; i < menuTree.length; i ++){
    var firstRoute = {}

    if(menuTree[i].name && menuTree[i].name!='' && menuTree[i].name!=null){
      firstRoute.path = '/' + menuTree[i].name
    }else{
      firstRoute.path = '/' + menuTree[i].id
    }

    firstRoute.component = 'Layout'
    firstRoute.meta = menuTree[i].meta
    firstRoute.name = menuTree[i].id

    var firstChildrenRoute = []

    var firstChildrenData = menuTree[i].children
    // 二级可能是页面也可能是模块
		for( let j = 0; j < firstChildrenData.length; j ++ ){
      // 定义二级路由
      var secondRoute = {}
      if(firstChildrenData[j].type === 2){
        // 是页面
        if(firstChildrenData[j].path === "" || firstChildrenData[j].path === null && /\S/.test(firstChildrenData[j].path)){
          continue
        }

        secondRoute.component = firstChildrenData[j].path

        var secondRoutePaths = firstChildrenData[j].path.split('/')
        secondRoute.path = secondRoutePaths[secondRoutePaths.length-1]
        secondRoute.meta = firstChildrenData[j].meta
        secondRoute.name = firstChildrenData[j].path.replace(/^\//, '-')
        secondRoute.children = []
        firstChildrenRoute.push(secondRoute)
        // 到此结束
      }else if(firstChildrenData[j].type === 1){
        // 是模块 存在三级路由
        // 定义三级路由
        var secondChildrenRoute = []
        var secondChildrenData = firstChildrenData[j].children

        for (let k = 0; k < secondChildrenData.length; k ++) {
          var threeRoute = {}

          if(secondChildrenData[k].type!==2){
            continue
          }
          if(secondChildrenData[k].path === "" || secondChildrenData[k].path === null && /\S/.test(secondChildrenData[k].path)){
            continue
          }

          threeRoute.component = secondChildrenData[k].path

          var threeRoutePaths = secondChildrenData[k].path.split('/')
          threeRoute.path = threeRoutePaths[threeRoutePaths.length-1]
          threeRoute.meta = secondChildrenData[k].meta
          threeRoute.name = secondChildrenData[k].path.replace(/^\//, '-')
          threeRoute.children = []

          secondChildrenRoute.push(threeRoute)
        }

        if(secondChildrenRoute.length > 0){
          // 二级模块 path 拼接 此处存在bug
          var pathStr = secondChildrenRoute[0].component
          var sumpaths = pathStr.split("/")
          var threeCpmponentStr = ""
          var senondModelPath = ""
          var noendnum = sumpaths.length - 1
          for(var p = 0; p < noendnum; p++){
            if(p===0){
              threeCpmponentStr = sumpaths[p]
            }else{
              threeCpmponentStr = threeCpmponentStr + "/" + sumpaths[p]
            }

            if(p === noendnum-1){
              senondModelPath = sumpaths[p]
            }
          }

          secondRoute.component = threeCpmponentStr //firstChildrenData[j].path
          secondRoute.path = senondModelPath //firstChildrenData[j].name
          secondRoute.meta = firstChildrenData[j].meta
          secondRoute.name = threeCpmponentStr.replace(/^\//, '-')
          secondRoute.children = secondChildrenRoute

          firstChildrenRoute.push(secondRoute)
        }else{
        }
      }
    }

    firstRoute.children = firstChildrenRoute

    routes.push(firstRoute)
  }
  return routes
}
