<template>
	<!--运营商-->
	<div class="operator_">
		<div>
			<p style="margin: 5px 12px;">运营商配置</p>
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
		
		<div>
			<p style="margin: 5px 12px;">地区</p>
			<el-tag
			  :key="index"
			  v-for="(tag,index) in dynamicTags2"
			  closable
			  :disable-transitions="false"
			  @close="handleClose2(tag)">
			  {{tag}}
			</el-tag>
			<el-cascader-panel
	            v-model="areas2"
	            size="mini"
	            :options="regTree2"
	            clearable
	            :props="defaultProps2"
	            @change="handleChange2"
	          ></el-cascader-panel>
		</div>
		
	</div>
</template>

<script>
	import {packageOrgToMap} from '@/utils/area.js'
	import { getUserPower } from '@/api/power/user';
	import {getRegNameByCode} from '@/utils/area'
  	import {findTreeId} from '@/utils/validate'
export default {
  data() {
    return {
    	regTree2:JSON.parse(localStorage.getItem('regTree')),
    	areas2:[],
    	dynamicTagsOld2: [],
    	dynamicTags2: [],
    	defaultProps2: {
	        multiple:true,
	        checkStrictly: true,
	        value: "id",
	        label: "name"
	     },
	     maps:[],
	     maps2:[],
	     ids:'',
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
//	this.areas = [["1247854083193020418", "1247854322763276290"]]
	this.init()
  },
  methods:{
  	test(){
  		console.log(this.datas)
  		console.log(this.maps2)
  	},
	refeshs(){
		this.areas = [];
	},
	refeshs(){
		this.dynamicTags = [];
		this.areas = [];
		this.dynamicTags2 = [];
		this.areas2 = [];
		getUserPower(this.ids).then((res) => {
        	if (res.code == "000000") {
        		if (res.data&&res.data.length) {
        			for(let i = 0; i < res.data.length; i ++){
        				if (res.data[i].objType == '1') {
        					this.areas = res.data[i].objList.map(item=>{
								return findTreeId(this.regTree,item)
							});
							this.dynamicTags = res.data[i].objList.map(item=>{
								return this.orgNameFormat(item)
							});
        				}else{
        					this.areas2 = res.data[i].objList.map(item=>{
								return findTreeId(this.regTree2,item)
							});
							this.dynamicTags2 = res.data[i].objList.map(item=>{
								return getRegNameByCode(item)
							});
        				}
        			}
        		}
        	}else{
        		this.$message.error(res.data);
        	}
        });
		
//		let data = [];
//		for(let i = 0; i < this.areas.length; i ++){
//			data.push(findTreeId(this.regTree,this.areas[i]))
//		}
//		this.areas2 = data;
//		let datas = this.areas.map(item=>{
//			return getRegNameByCode(item[item.length-1])
//		})
//		this.dynamicTags2 = datas
		
//		let data = value.map(item=>{
//			return findTreeId(this.regTree,item.id)
//		})
		
	},
  	init(){
		this.regTree = JSON.parse(localStorage.getItem('insData'));
		this.regTree2 = JSON.parse(localStorage.getItem('regTree'));
  	},
  	handleChange(value){
		this.datas = value.map(item=>{
			return item[item.length - 1]
		})
		let data = value.map(item=>{
			return this.orgNameFormat(item[item.length -1 ])
		})
		this.dynamicTags = data;
  	},
  	handleClose(tag) {
  		let index_ = this.dynamicTags.indexOf(tag);
        this.datas.splice(index_, 1);
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
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
    
    handleChange2(value){
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
		this.maps2 = arr1;
		let data = arr1.map(item=>{
			return getRegNameByCode(item)
		})
		this.dynamicTags2 = data
  	},
  	handleClose2(tag) {
  		let index_ = this.dynamicTags2.indexOf(tag);
        this.dynamicTags2.splice(index_, 1);
        this.maps2.splice(index_, 1);
    },
    searchTree(tree, id) {
        var stark = [];
        stark = stark.concat(tree);
        while (stark.length) {
            var temp = stark.shift();
            if (temp.children) {
                stark = stark.concat(temp.children);
            }
            if (temp.id === id) {
                return temp;
            }
        }
        return null;
    },
    orgNameFormat(cellValue) {
        var org = this.searchTree(this.regTree, cellValue);
        return org ? org.name : '';
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