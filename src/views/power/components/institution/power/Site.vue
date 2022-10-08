<template>
	<div>
    <div class="site_s">
        <!-- <button @click="setCheckedKeys">根据树结构权限选中</button>
        <button @click="toggleSelection">根据表格权限选中</button> -->
        
        <div class="site_head"></div>
        <div class="site_content">
            <div class="right">
                <div class="top">
                    <!--<el-select-tree
                        style="width: 25%;margin-right: 10px;"
                        size="mini"
                        v-if="!sign"
                        :popover-min-width="200"
                        :default-expand-all="false"
                        :data="orgTreeData"
                        :props="orgDefaultProps"
                        :clearable="true"
                        v-model="sear.insn"
                        :checkStrictly="true"
                    />-->
                    <!--<el-cascader
                    	v-if="!sign"
                    	style="margin-right: 10px;"
		                v-model="regId"
		                :options="regData"
		                :props="defaultProps"
		                clearable
		            ></el-cascader>-->
                    <el-input
                    	clearable
                        style="width: 20%;height: 25px;"
                        v-model="sear.name"
                        placeholder="请输入站点名称"
                    ></el-input>
                    <el-button
                        size="mini"
                        class="bouncedBTNSpace bouncedHold bouncedLeftBTNSpace"
                        @click="onSubmit"
                    >查询</el-button>
                    <el-button size="mini" @click="cancel">清空</el-button>
                </div>

                <!--下方是俩表格-->

                <div style="float: left; width: 45%;margin-left: 1%;">
                    <p style="color: #00607f;font-weight: 800;height: 30px;line-height: 30px;margin-top: 5px;">待选站点</p>
                    <el-table
                        :data="tableData"
                        ref="multipleTable"
                        stripe
                        height="250"
                        @selection-change="handleSelectionChange"
                        style="flex: 1;"
                    >
                        <el-table-column type="index" width="45"></el-table-column>

                        <el-table-column type="selection" width="45"></el-table-column>

                        <el-table-column show-overflow-tooltip prop="staName" label="站点名称"></el-table-column>

                        <el-table-column show-overflow-tooltip prop="orgName" label="所属组织机构"></el-table-column>

                        <el-table-column label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">{{ fatType(scope.row.staType)}}</template>
                        </el-table-column>

                        <el-table-column show-overflow-tooltip prop="regName" label="所属区域"></el-table-column>
                    </el-table>

                    <div class="block" style="text-align: center;">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 40, 80, 100]"
                            :page-size="size"
                            layout="total, sizes, pager"
                            :total="total"
                        ></el-pagination>
                    </div>
                </div>
                <div style="float: left;">
                    <img
                    	@click="siteQue"
                        style="width: 50px;height: 50px;margin: 140px 0px 0px 14px ;"
                        src="../../../../../assets/image/58_58.png"
                    />
                </div>

                <div style="float: left; width: 45%;margin-left: 1%;">
                    <p style="color: #00607f;font-weight: 800;height: 30px;line-height: 30px;margin-top: 5px;">
                        已选站点
                        <el-button
                            size="mini"
                            @click="del"
                            class="bouncedDelColor bouncedBottomBTNSpace"
                            style="float: right;"
                        >删除</el-button>
                    </p>
                    <el-table
                        :data="tableData2"
                        ref="multipleTable"
                        stripe
                        height="250"
                        @selection-change="handleSelectionChange2"
                        style="flex: 1;"
                    >
                        <el-table-column type="index" width="45"></el-table-column>

                        <el-table-column type="selection" width="45"></el-table-column>

                        <el-table-column show-overflow-tooltip prop="staName" label="站点名称"></el-table-column>

                        <el-table-column show-overflow-tooltip prop="orgName" label="所属组织机构"></el-table-column>

                        <el-table-column show-overflow-tooltip label="状态">
                            <template slot-scope="scope">{{ fatType(scope.row.staType)}}</template>
                        </el-table-column>

                        <el-table-column show-overflow-tooltip prop="regName" label="所属区域"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
	</div>
</template>

<script>
import { getQueryByPage3 } from '@/api/property/site';
import { getRegionTreeByOrgId } from '@/api/power/institution';
import elTable from '@/components/pagetable';
export default {
    data() {
        return {
            orgTreeData: JSON.parse(localStorage.getItem('insData')),
            regData: [],
            regId:[],
            sear: {
            	
            },
            orgDefaultProps: {
                label: 'name',
                children: 'children',
                value: 'id',
                checkStrictly: true,
                expandTrigger: 'hover'
            },
            defaultProps: {
                checkStrictly: true,
                children: 'children',
                value: 'id',
                label: 'name'
            },
            serviceType:null,
            num: [],
            tableData: [],
            tableData2: [],
            newTableData2: [],
            watchTag: [],
            currentPage: 1,
            total: 0,
            size: 10,
            newArr:[],
            delArr: [],
            sign:1,
            params:{
            	
            },
        };
    },
    props: ['details'], //组件未加载出方法时 使一次
    created() {
    	if (JSON.parse(sessionStorage.getItem('user')).serviceType == '10') {
    		this.getRegTree()
    		this.sign = 0;
    	}else{
    		this.sign = 1;
    	}
    },
    mounted() {},
    watch: {
        tableData2() {
        	this.watchTag = this.tableData2.map((item) => {
                return item.id;
            });
        }
    },
    methods: {
        //查询
        onSubmit() {
        	if (JSON.parse(sessionStorage.getItem('user')).serviceType == '10') {
	    		this.sign = 0;
	    		this.getRegTree()
	    		if (this.regId && this.regId.length) {
	    			this.sear.regId = this.regId[this.regId.length-1]
	    		}else{
	    			this.sear.regId = ""
	    		}
	    		this.params = {
	            	serviceType:this.serviceType,
	                regId: this.sear.regId,
	                staName: this.sear.name,
	                size: this.size,
	                current: this.currentPage
	            };
	    	}else{
	    		this.sign = 1;
	    		this.params = {
	            	serviceType:this.serviceType,
	                orgId: this.sear.insn,
	                staName: this.sear.name,
	                size: this.size,
	                current: this.currentPage
	            };
	    	}
            this.quesear(this.params);
        },
		siteQue(){
			this.tableData2=JSON.parse(JSON.stringify(this.newArr));
		},
		getRegTree(){
			let datas = JSON.parse(sessionStorage.getItem('user')).orgId;
			getRegionTreeByOrgId(datas).then(res=>{
				this.regData = res.data
			})
		},
        init() {
//          const PARAMS = {
//              size: this.size,
//              current: this.currentPage
//          };
//          this.quesear(PARAMS);
//          this.options = JSON.parse(localStorage.getItem('operator'));
//          this.tableData2 = [];
        },
        del() {
        	if (this.tableData2.length == this.delArr.length) {
        		this.tableData2 = [];
        	}else{
        		for (let i = 0; i < this.tableData2.length; i++) {
	                for (let j = 0; j < this.delArr.length; j++) {
	                    if (this.tableData2[i].id == this.delArr[j]) {
	                        this.tableData2.splice(i, 1);
	                        j--;
	                    }
	                }
	            }
        	}
            this.newArr=JSON.parse(JSON.stringify(this.tableData2));
        },
        handleSelectionChange(data) {
            let datas = JSON.parse(JSON.stringify(data));
            for (let i = 0; i < datas.length; i ++) {
            	if (this.newArr.filter(item=>{return item.id != datas[i].id})) {
            		this.newArr.push(datas[i])
            	}
            }
            this.newTableData2.map(item=>{
            	this.newArr.unshift(item)
            })
            let arr2 = this.newArr.filter((x, index,self)=>{
			  let arrids = []
			  let arrnames = []
			  this.newArr.forEach((item,i) => {
			    arrids.push(item.id)
			  })
			  let judgeOne = arrids.indexOf(x.id) === index
			  return judgeOne
			})
            this.newArr = arr2;
        },
        handleSelectionChange2(data) {
            this.delArr = data.map((item) => {
                return item.id;
            });
        },

        //分页的
        handleSizeChange(val) {
            this.size = val;
            this.params.size = val;
            this.quesear(this.params);
        },
        handleCurrentChange(val) {
            this.current = val;
            this.params.current = val;
            this.quesear(this.params);
        },
        quesear(PARAMS) {
            getQueryByPage3(PARAMS).then((res) => {
                this.tableData = res.data.records;
                this.total = res.data.total;
            });
        },
        cancel() {
            this.sear = {};
            this.params.regId = "";
            this.params.orgId = "";
            this.params.staName = "";
        },
        fatType(data) {
            if (data == '1') {
                return '使用中';
            } else if (data == '2') {
                return '未使用';
            } else if (data == '3') {
                return '检修';
            } else if (data == '4') {
                return '停用';
            }
        }
    }
};
</script>

<style lang="scss">
.site_s {
    .el-tabs__item .is-active {
        color: white;
    }
    .site_head {
        box-sizing: border-box;
    }
    .site_content {
        display: flex;
        height: 380px;

        .right {
            flex: 1;
            .top {
            	border-bottom:1px solid gainsboro;
            	padding: 12px 5px 12px 10px;
            	background: whitesmoke;
                .el-input__inner {
                    height: 30px;
                    line-height: 30px;
                }
            }
            .cell {
                text-align: center;
            }
        }
    }

    .el-tag {
        margin-right: 5px;
    }
}
</style>
