import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import operate from './modules/operate'
import ops from './modules/Ops' //周期保养
import {localPub} from '@/api/localPul';
Vue.use(Vuex)
export default new Vuex.Store({
	//数据
  state: {
  	tab:[],
	stdID:'',
	stakeID:'',
  	route:[],
  	areaData:[],
  	regTree:[],
  	insData:[],
  	router:[],
  	paths:{
  		// name:"总览",
  		// icon:"el-icon-location"
  	},
  	v_showData:[],
  	v_num:8,
  	perss:0,
  	resTree:[],
  },
  //类似于组件中的计算属性
  getters:{
	permissions: state => state.user.permissions,
  },
  //同步方法操作
  mutations: {
  	set_regTree(state,data){
  		state.regTree = data
  	},
  	set_insData(state,data){
  		state.insData = data
  	},
  	set_stdID(state,data){
  		state.stdID = data
  	},
  	set_stakeID(state,data){
  		state.stakeID = data
  	},
  	set_perss(state){
  		state.perss++;
  	},
  	set_v_showData(state,data){
		  state.v_showData = data
  	},
  	set_v_num(state,data){
  		state.v_num = data
  	},
  	set_v_resTree(state,data){
  		state.resTree = data
  	},
  	setRourer(state,data){
		  state.router = data
  	},
  	addRoutes(state,data){
  		state.route = data
  	},
  	setPath(state,path){
  		state.paths = path
  	},
  	addTab(state,data){
  		setTimeout(function(){
  			localPub();
  		},200)
  		//尾曾
  		if (data != []) {
  			state.tab.push(data)
			//对象去重
			let arr2 = state.tab.filter((x, index,self)=>{
			  let arrids = []
			  let arrnames = []
			  state.tab.forEach((item,i) => {
			    arrids.push(item.path)
			    arrnames.push(item.name)
			  })
			  let judgeOne = arrids.indexOf(x.path) === index
			  return judgeOne /*|| judgeTwo*/
			})
			state.tab = arr2
  		}
  	},
  	add_v_showData(state,data){
  		//尾曾
  		if (data != []) {
  			state.v_showData.push(data)
		  }
  	},
  	stateLock(state,index){
  		state.tab[index].lock = !state.tab[index].lock
  	},
  	stateDel(state,index){
  		state.tab.splice(index,1)
  	},
  	stateColseAll(state,data){
  		state.tab = data;
  	}
  },
  //异步
  actions: {},
  //分块管理
  modules: {
	  user,
	  operate,
	  ops,
  },
  //持久化
  plugins: [createPersistedState()]
})
