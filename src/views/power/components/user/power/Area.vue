<template>
	<div class="area_">
		<!--<button @click="test">1111111111111</button>-->
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
	 import {getRegNameByCode} from '@/utils/area'
	 import {findTreeId} from '@/utils/validate'
export default {
  data() {
    return {
    	regTree:JSON.parse(localStorage.getItem('regTree')),
    	areas:[],
    	dynamicTagsOld: [],
    	dynamicTags: [],
    	defaultProps: {
	        multiple:true,
	        checkStrictly: true,
	        value: "id",
	        label: "name"
	     },
	     maps:[],
    }
  },
  created(){
  	this.init()
	this.refeshs()
  },
  methods:{
  	test(){
  		this.areas = [
		"110000","120000","130400"
		];
		let data = [];
		for(let i = 0; i < this.areas.length; i ++){
			data.push(findTreeId(this.regTree,this.areas[i]))
  		}
		this.areas = data;
		let datas = this.areas.map(item=>{
			return getRegNameByCode(item[item.length-1])
		})
		this.dynamicTags = datas
  	},
	refeshs(){
		this.dynamicTags = [];
		this.areas = [];
		
		this.areas = this.$parent.$parent.$parent.$parent.areaData;
		let data = [];
		for(let i = 0; i < this.areas.length; i ++){
			data.push(findTreeId(this.regTree,this.areas[i]))
  		}
		this.areas = data;
		let datas = this.areas.map(item=>{
			return getRegNameByCode(item[item.length-1])
		})
		this.dynamicTags = datas
	},
  	init(){
  		this.regTree = this.getTreeData(JSON.parse(localStorage.getItem('regTree')));
  	},
  	handleChange(value){
		let arr1 = [];
		let arr2 = [];
		for(let i = 0; i < value.length; i ++){
			if (value[i].length == 1) {
				arr1.push(value[i][0])
			} else if (value[i].length == 2) {
				if (arr1.find((n)=>n == value[i][0])) {
					
				}else{
					arr1.push(value[i][1])
				}
			} else if (value[i].length == 3) {
				let sign = true;
				for(let j = 0;j < arr1.length; j ++){
					if (value[i][0] == arr1[j] || value[i][1] == arr1[j]) {
						sign = false;
					}else{
						sign = true
					}
				}
				if (sign) {
					arr1.push(value[i][2])
				}
			}
		}
		this.maps = arr1;
		let data = arr1.map(item=>{
			return getRegNameByCode(item)
		})
		this.dynamicTags = data
  	},
  	handleClose(tag) {
  		let index_ = this.dynamicTags.indexOf(tag);
        this.dynamicTags.splice(index_, 1);
        this.maps.splice(index_, 1);
    },
  	getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
  }
}
</script>

<style lang="scss">
	.area_{
		box-sizing: border-box;padding-left: 3px;
		.el-cascader-menu{
			width: 33%;
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