<template>
	<div class="cust_ser_wrap">
		<sear-form ref="searForm"/>
		<el-table
        :data="tableData"
        stripe
        v-loading="loading"
        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        ref="tableDataRef"
      >
        <el-table-column type="selection" width="55"  align="center"/>
        <el-table-column v-if="colData[0].istrue" label="序号" type="index"/>
        <el-table-column
          v-if="colData[1].istrue"
          label="客户姓名"
          sortable="custom"
          prop="name"
          show-overflow-tooltip
        >
        	<template slot-scope="scope">
	          	<el-link @click="nameDatil(scope.row)">{{scope.row.name}}</el-link>
	        </template>
	    </el-table-column> 
	    
	    <el-table-column v-if="colData[2].istrue" show-overflow-tooltip label="性别" prop="sex" />
	    
        <el-table-column
          v-if="colData[3].istrue"
          label="客户电话"
          sortable="custom"
          prop="tel"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="colData[4].istrue"
          sortable="custom"
          label="手机号归属地"
          prop="tel_region"
        />
        <el-table-column
          v-if="colData[5].istrue"
          sortable="custom"
          label="注册时间"
          prop="reg_time"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="colData[6].istrue"
          label="历史报修数量"
          sortable="custom"
          show-overflow-tooltip
        >
        	<template slot-scope="scope">
	          	<el-link @click="repairDetail(scope.row)">{{scope.row.historyRepairNum}}</el-link>
	        </template>
        </el-table-column>
        
        <el-table-column
          v-if="colData[7].istrue"
          label="历史充电次数"
          sortable="custom"
          show-overflow-tooltip
        >
        	<template slot-scope="scope">
	          	<el-link @click="chargeDetail(scope.row)" >{{scope.row.historyChargeNum}}</el-link>
	        </template>
        </el-table-column>
        <el-table-column v-if="colData[8].istrue" label="客户充电场站TOP5">
	          <template slot-scope="scope">
	          	 <el-button @click="topDetail(scope.row)" size="mini" class="common-btn buleBTN">查看</el-button>
	          </template>
        </el-table-column>
        <el-table-column v-if="colData[9].istrue" show-overflow-tooltip label="品牌" prop="car_brand_name" />
        <el-table-column v-if="colData[10].istrue" show-overflow-tooltip label="车系" prop="car_series_name" />
        <el-table-column v-if="colData[11].istrue" show-overflow-tooltip label="车型" prop="car_model_name" />
        <el-table-column v-if="colData[12].istrue" show-overflow-tooltip label="客户车辆类型" prop="car_type" />
        <el-table-column v-if="colData[13].istrue" show-overflow-tooltip label="客户大类" prop="user_main_type" />
        <el-table-column v-if="colData[14].istrue" show-overflow-tooltip label="客户小类" prop="user_sub_type" />
        <el-table-column v-if="colData[15].istrue" show-overflow-tooltip label="客服电话频次" prop="serv_tel_num" />
        <el-table-column v-if="colData[16].istrue" show-overflow-tooltip label="年龄区间" prop="age_range" />
        <el-table-column v-if="colData[17].istrue" show-overflow-tooltip label="主要充电区域" prop="char_area" />
        <el-table-column v-if="colData[18].istrue" show-overflow-tooltip label="主要充电时间段" prop="char_time_inte" />
        <el-table-column v-if="colData[19].istrue" show-overflow-tooltip label="充电频次" prop="char_rate" />
        <el-table-column v-if="colData[20].istrue" show-overflow-tooltip label="主要充电方式" prop="char_type" />
        <el-table-column v-if="colData[21].istrue" show-overflow-tooltip label="主要充电桩型" prop="pole_type" />

        <el-table-column fixed="right" width="80" label="操作">
          <template slot-scope="scope">
            <el-button class="common-btn" @click="modify(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column width="40" fixed="right">
          <template slot="header">
            <el-popover
              placement="bottom"
              min-width="80"
              trigger="click"
              popper-class="col-setting-popover"
            >
              <el-button
                slot="reference"
                size="small"
                type="text"
                icon="el-icon-setting"
                style="padding:0; border-color:#f1f1f1;"
              ></el-button>
              <div class="col-setting-title">展示列设置</div>
              <el-checkbox-group v-model="colOptions" :min="1" class="col-setting-group">
                <el-checkbox v-for="item in colSelect" :label="item" :key="item">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
		<div class="page-wrap-fixed" id="page-wrap-fixed">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageData.size"
        :total="pageData.total"
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper, slot"
      >
        <span class="el-pagination__jump page-option-wrap">
          <a class="page-option-icon" href="javascript:;" @click="" title="刷新">
            <img src="/static/img/7.png" />
          </a>
          <i class="split-line"></i>
          <a class="page-option-icon" href="javascript:;" @click="" title="导出">
            <img src="/static/img/8.png" />
          </a>
        </span>
      </el-pagination>
    </div>
	    <name ref="name" />
	    <update ref="update" />
	    <his-repair ref="repairs" />
	    <his-charge ref="charge" />
	    <his-top ref="tops" />
	    
	</div>
</template>


<script>
	import pagetable from "@/components/pagetable"
	import name from "./components/custSer/name"
	import update from "./components/custSer/update"
	import hisRepair from "./components/custSer/hisRepair"
	import hisCharge from "./components/custSer/hisCharge"
	import hisTop from "./components/custSer/hisTop"
	import searForm from "./components/custSer/searForm"
	import {
	  queryByPage,
	  getInfo,
	  getHis,
	  getRep,
	  getTop,
	} from "@/api/system/cust";
	export default {
		components: {
			pagetable,name,update,hisRepair,hisCharge,hisTop,searForm
		},
		data() {
			return {
				tableData:[],
				SelectionArray:[],//批量删除
		      	pageData: {
			        total: 0,
			        current: 1,
			        size: 20,
			      },
		      	forminlines:{},
		      	colData: [
		      	{title: "编号", istrue: true },
		      	{title: "客户姓名", istrue: true },
		      	{title: "客户性别", istrue: true },
		      	{title: "客户电话", istrue: true },
		      	{title: "手机号归属地", istrue: true },
		      	{title: "注册时间", istrue: true },
		      	{title: "历史报修数量", istrue: true },
		      	{title: "历史充电次数", istrue: true },
		      	{title: "客户充电站Top5", istrue: true },
		      	{title: "品牌", istrue: true },
		      	{title: "车系", istrue: true },
		      	{title: "车型", istrue: true },
		      	{title: "客户车辆类型", istrue: true },
		      	{title: "客户大类", istrue: true },
		      	{title: "客户小类", istrue: true },
		      	{title: "客服电话频次", istrue: true },
		      	{title: "年龄区间", istrue: true },
		      	{title: "主要充电区域", istrue: true },
		      	{title: "主要充电时间段", istrue: true },
		      	{title: "充电频次", istrue: true },
		      	{title: "主要充电方式", istrue: true },
		      	{title: "主要充电桩型", istrue: true },
		      	],
		      	sortDatas:{sortCol:"name",sortType:'-1'},
		      colOptions: [],
		      colSelect: [],
			};
		},
		watch: {
		    colOptions(valArr) {
		      var arr = this.colSelect.filter((i) => valArr.indexOf(i) < 0);
		      this.colData.filter((i) => {
		        if (arr.indexOf(i.title) != -1) {
		          i.istrue = false;
		          this.$nextTick(() => {
		            this.$refs.tableDataRef.doLayout();
		          });
		        } else {
		          i.istrue = true;
		          this.$nextTick(() => {
		            this.$refs.tableDataRef.doLayout();
		          });
		        }
		      });
		    },
		  },
		created() {
			this.queryList();
		    let _this = this;
		    for (let i = 0; i < _this.colData.length; i++) {
		      _this.colSelect.push(_this.colData[i].title);
		      if (_this.colSelect.length > 9) {
		        continue;
		      }
		      _this.colOptions.push(_this.colData[i].title);
		    }
		},
		mounted(){
			
		},
		methods: {
			sortChange(column) {
			  this.sortDatas.sortCol = column.prop;
		      if (column.order === "ascending") {
		        this.sortDatas.sortType = 1;
		      }
		      else if(column.order == null){
//		      	this.sortDatas={sortCol:"name",sortType:'0'};
		      }
		      else {
		        this.sortDatas.sortType = '-1';
		      }
		      this.queryList();
		    },
			queryList(params) {
		      this.loading = true;
		      let params_ = Object.assign(this.sortDatas,params,this.forminlines);
		      queryByPage(params_).then((res) => {
		        this.loading = false;
		        this.tableData = res.data.records;
		        this.pageData = {
		          total: res.data.total,
		          current: res.data.current,
		          pageSize: res.data.size,
		        };
		      });
		    },
			//客户信息
			nameDatil(data){
				let Names = this.$refs.name;
				getInfo(data.id).then(res=>{
					console.log(res.data)
					if (res.code !== "000000") {
		                this.$message({
		                  message: res.mesg,
		                  type: "warning"
		                });
		              } else {
		                Names.dialogFormVisible = true;
						Names.data = res.data;
		              }
				})
			},
			//报修
			repairDetail(data){
				let Repairs = this.$refs.repairs;
				Repairs.dialogFormVisible = true;
				Repairs.init()
			},
			//充电
			chargeDetail(data){
				let Charges = this.$refs.charge;
				Charges.dialogFormVisible = true;
				Charges.init()
			},
			//Top5排行
			topDetail(data){
				let Tops = this.$refs.tops;
				Tops.dialogFormVisible = true;
				Tops.init()
			},
			add(){
				if(!this.disabld){
					let dialogAdd = this.$refs.dialogAdd;
			      	dialogAdd.form = {};
			      	dialogAdd.form.busiTyp = this.busiTyp;
			      	dialogAdd.form.parTypeId = this.parTypeId;
			      	dialogAdd.info = '新增'
			      	dialogAdd.dialogFormVisible = true;
				}else{
					this.$message.warning('请选择业务报表');
				}
			},
			//客户信息修改，
			modify(data){
				let dialogAdd = this.$refs.update;
				getInfo(data.id).then(res=>{
					console.log(res.data)
					if (res.code !== "000000") {
		                this.$message({
		                  message: res.mesg,
		                  type: "warning"
		                });
		              } else {
		                dialogAdd.dialogFormVisible = true;
		                dialogAdd.ids = data.id;
						dialogAdd.form = res.data;
		              }
				})
				console.log(data)
			},
			//查询
			handleSelectionChange(val){
		      this.SelectionArray = val;
		    },
		     // 分页点击事件
		    handleSizeChange(val) {
		    	console.log(val)
		    	this.pageData.size = val;
      			this.queryList(this.pageData);
		   },
		    handleCurrentChange(val) {
		    	this.pageData.current = val;
      			this.queryList(this.pageData);
		    },
		    handleRefresh(){
		    	this.pageSize = 1;
		    	this.currentPage = 20;
		    	this.queryList()
		    },
			exportFn(){
				
			},
			
		}

	};
</script>

<style lang="scss">
	.cust_ser_wrap .el-table{margin-top: 2px;}
	.cust_ser_wrap .el-link--inner{
		color: blue;
	}
	.cust_ser_wrap .el-link--inner:hover {
	    color: #1396c2;
	}
</style>
