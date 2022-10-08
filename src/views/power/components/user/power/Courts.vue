<template>
	<div class="site_">
		<div class="site_head">
			<el-tag
			  :key="index"
			  v-for="(tag,index) in dynamicTags"
			  closable
			  :disable-transitions="false"
			  @close="handleClose(tag)">
			  {{tag}}
			</el-tag>
		</div>
		<div class="site_content">
			
			<div class="right">
				<div class="top">
					区域
					<el-cascader
						style="width: 200px;"
			            v-model="areas"
			            size="mini"
			            :options="regTree"
			            clearable
			            :props="defaultProps"
			            @change="handleChange"
			          ></el-cascader>
					
					<button @click="onSubmit">查询</button>
				</div>
				<el-table
			    :data="tableData"
			    stripe
			    height="300"
			    @selection-change="handleSelectionChange"
			    style="width: 100%">
			    
			    <el-table-column
			      type="selection"
			      width="50" align="center">
			    </el-table-column>
			    
			    <el-table-column
			      label="序号"
			      type="index"
			      width="55">
			    </el-table-column>
			    
			    
			    <el-table-column
			      prop="areaName"
			      label="台区名称">
			    </el-table-column>
			    
			    <el-table-column
			      prop="orgId"
			      label="所属组织机构">
			    </el-table-column>
			    
			    <el-table-column
			      label="所属区域">
			      <template slot-scope="scope">{{ scope.row.regName}}</template>
			    </el-table-column>
			  </el-table>
			  
			  <div class="block" style="text-align: center;">
			    <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[15, 40, 80, 100]"
			      :page-size="size"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			  </div>
			  

			</div>
		</div>
		
		
		
	</div>
</template>

<script>
	import { getQueryByPage } from "@/api/property/stage";
export default {
  data() {
    return {
    	regTree:JSON.parse(localStorage.getItem('regTree')),
    	areas:[],
    	sear:"",
    	dynamicTags: [],
    	tagsID:[],
    	defaultProps: {
	        checkStrictly: true,
	        value: "id",
	        label: "name"
	      },
    	tableData: [],
    	currentPage:1,
    	total:100,
    	size:15,
    	}
  },
  created(){
	this.init()
  },
  methods:{
	refesh(){
		this.dynamicTags = [];
		this.areas = [];
	},
	handleChange(value){
		
	},
	onSubmit(){
		this.sear = this.areas[this.areas.length-1]
		//建议改区域name 不id查
		const PARAMS = {
			regId:this.sear
		}
		 getQueryByPage(PARAMS).then(res => {
	        this.tableData = res.data.records;
	      });
	},
  	init(){
  		this.options = this.getTreeData(JSON.parse(localStorage.getItem('regTree')));
  		getQueryByPage({size:this.size}).then(res=>{
			this.tableData = res.data.records
			this.total = res.data.total
			
		})
  	},
  	handleSelectionChange(value){
  		//处理
  		this.tagsID = value.map(item=>{
			return item.id
		})
  		let data = value.map(item=>{
			return item.areaName
		})
		this.dynamicTags = data
  	},
  	handleClose(tag) {
  		let index_ = this.dynamicTags.indexOf(tag);
        this.tagsID.splice(index_, 1);
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
    

// //分页的
   	handleSizeChange(val) {
    	const PARAMS = {
	        size: val,
	        current: this.currentPage
	      }
		getQueryByPage(PARAMS).then(res => {
        	this.tableData = res.data.records;
      	});
	},
	handleCurrentChange(val) {
	    const PARAMS = {
	        size: this.size,
	        current: val
	      }
		getQueryByPage(PARAMS).then(res => {
        	this.tableData = res.data.records;
      	});
	}
  	
    
    
  }
}
</script>

<style lang="scss">
	.site_{
		.site_head{
			box-sizing: border-box;
			padding: 2px 5px;
			border-bottom: 1px solid gainsboro;
		}
		.site_content{
			display: flex;
			/*height: 310px;*/
			
			.right{
				flex: 1;
				.top{
					padding: 5px 10px;
				}
				.cell{
					text-align: center;
				}
				button{
					padding: 7px 18px;
					color: #fff;
					border: 0;
				    background-color: #00607f;
				    border-color: #00607f;
				    border-radius: 2px;
				    cursor: pointer;
				    outline: none; 
				}
			}
		}
		
		
		.el-tag{
			margin-right: 5px;
		}
	}
	
</style>