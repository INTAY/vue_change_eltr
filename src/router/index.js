import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/components/layout'
import {
  Message
} from 'element-ui'
import {
  getRouters
} from '@/api/menu'
import {
  getButPermissions
} from "@/api/power/user";
import {
  recursionData,
  filPath
} from '@/utils/validate.js'
import vstore from '@/store'

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}


var getRouter
Vue.use(Router);


//修改VueRouter的bug
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



//默认路由
export const constantRoutes = [{
    path: '*',
    component: (resolve) => require(['@/views/error/404'], resolve),
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/Login/Login.vue'], resolve)
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
  },
  {
    path: '*',
    redirect: '/404'
  }
]


var router = new Router({

  routes: constantRoutes
})




//过滤函数
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

//拦截
router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.path != '/login') {
    if (sessionStorage.getItem("isLogin")) {
      if (!getRouter) {
        if (!localStorage.getItem('router')) {
          getRouters().then(res => {
            if (res.data.length > 0) {
              getRouter = recursionData((res.data).sort(function (a, b) {
                return a.orderNum - b.orderNum
              })) //后台拿到路由

              //          if (res.data[0].name == "" || !res.data[0].path || res.data[0].children[0].name == ""|| !res.data[0].children[0].path) {
              //          	getRouter.unshift({
              //				  path: '/',
              //				  redirect: '/index/index',
              //				})
              //          }else{
              let dataRou = JSON.parse(JSON.stringify(getRouter));
              getRouter.unshift({
                path: '/',
                redirect: dataRou[0].path + '/' + dataRou[0].children[0].path
              })
              //          }
              vstore._mutations.setRourer[0](getRouter);
              sessionStorage.setItem("router", JSON.stringify(getRouter))
              saveObjArr('router', getRouter)
              routerGo(to, next)
              getButPermissions().then(res => {
                vstore._mutations.SET_PERMISSIONS[0](res.data)
              })
            } else {
              Message({
                message: '没有请求到菜单',
                type: 'error',
                duration: 3 * 1000
              });
              next({
                path: '/login'
              })
              getRouter = null;
            }
          })

        } else {
          getRouter = getObjArr('router')
          vstore._mutations.setRourer[0](getRouter);
          sessionStorage.setItem("router", JSON.stringify(getRouter))
          routerGo(to, next)
        }
      } else {
        next()
      }
    } else {
      next({
        path: '/login'
      })
      getRouter = null;
    }
  } else {
    next()
    getRouter = null;
  }


})


function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter)
  router.addRoutes(getRouter)
  next({
    ...to,
    replace: true
  })
}

export function saveObjArr(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

export function getObjArr(name) {
  return JSON.parse(localStorage.getItem(name));
}

export function updetaMenu() {
  getRouters().then(res => {
    getRouter = recursionData((res.data).sort(function (a, b) {
      return a.orderNum - b.orderNum
    }))
    vstore._mutations.setRourer[0](getRouter);
    sessionStorage.setItem("router", JSON.stringify(getRouter))
    saveObjArr('router', getRouter)
    getRouter = filterAsyncRouter(getRouter)
    router.addRoutes(getRouter)
  })
}



export default router;