<template>
	<!--运营商-->
	<div class="operator_">
		<!--<button @click="test">负荷聚合商</button>-->
		<el-tag
		  :key="index"
		  v-for="(tag,index) in dynamicTags"
		  closable
		  :disable-transitions="false"
		  @close="handleClose(tag)">
		  {{tag}}
		</el-tag>
		
		<el-cascader-panel
            v-model="areas"
            size="mini"
            :options="regTree"
            clearable
            :props="defaultProps"
            @change="handleChange"
          ></el-cascader-panel>
	</div>
</template>

<script>
	import {packageOrgToMap} from '@/utils/area.js'
export default {
  data() {
    return {
    	regTree:JSON.parse(localStorage.getItem('insData')),
    	areas:[],
    	dynamicTags: [],
    	datas:[],
    	defaultProps: {
    		checkStrictly:true,
	        multiple: true, 
	        value: "id",
	        label: "name"
	      }
    }
  },
  created(){
  	this.areas = [["1247854083193020418", "1247854322763276290"]]
	this.init()
  },
  methods:{
	refeshs(){
		this.areas = [];
	},
  	init(){
  		this.regTree = this.getTreeData(JSON.parse(localStorage.getItem('operator')));
  	},
  	test(){
  		
  	},
  	handleChange(value){
  		this.datas = value.map(item=>{
  			return item[item.length - 1]
  		})
		let data = value.map(item=>{
			return packageOrgToMap(item[item.length-1])
		})
		this.dynamicTags = data
  	},
  	handleClose(tag) {
  		let index_ = this.dynamicTags.indexOf(tag);
        this.datas.splice(index_, 1);
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].children.length; j ++) {
        	data[i].children[j].children = undefined;
        }
      }
      return data;
    },
  }
}
</script>

<style lang="scss">
	.operator_{
		box-sizing: border-box;padding-left: 3px;
		.el-cascader-menu{
			width: 50%;
			height: 300px;
		}
		.el-cascader-node:nth-child(even){
			background: #F7F7F7;
		}
		
		.el-cascader-menu__wrap{
			height: 300px;
		}
		.el-scrollbar__bar.is-horizontal{
			display: none;
		}
		.el-tag{
			margin-right: 5px;
			margin-bottom: 2px;
		}
	}
	
</style>