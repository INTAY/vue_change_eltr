<template>
    <div class="tasks">
        <el-form ref="form" :model="zoneForm" label-width="110px" size="small">
        	<div class="OpsModule">
            	<span style="margin-left: 20px;font-size: 18px;font-weight: 800;margin-right: 20px;"> 特巡对象 </span>
                        <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                            <el-popover placement="bottom" width="400" trigger="hover">
                                <el-table :data="item.children" stripe>
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" label="子模块名称"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
        	<!-- 站点选择 -->
            <el-row style="margin-top: 1px;">
                <el-col :span="4">
                    <div class="title"><i />站点选择</div>
                </el-col>
            </el-row>
            <div style="padding: 0 15px;">
                <el-table
                    :data="stationData"
                    style="width: 100%"
                    :header-cell-style="{ background: '#ededed !important', color: '#000' }"
                    @selection-change="staChange"
                >
                    <el-table-column type="index" width="70" align="center" />
                    <el-table-column show-overflow-tooltip prop="regName" label="区县"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="staName" label="站名称" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="addr" label="站地址"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                </el-table>
            </div>
            
            <!-- 桩选择 -->
            <el-row>
                <el-col :span="4">
                    <div class="title"><i />桩选择</div>
                </el-col>
            </el-row>
            <div style="padding: 0 15px">
                <el-table
                    :data="stationData2"
                    style="width: 100%"
                    stripe
                    :header-cell-style="{ background: '#ededed !important', color: '#000' }"
                    @selection-change="staChange"
                >
                    <el-table-column type="index" width="70" align="center" />
                    <el-table-column show-overflow-tooltip prop="regName" label="区县"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="stationName" label="站名称" width="180"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="addr" label="站地址"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="stakeName" label="桩名称"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="stakeNo" label="桩编号"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="stakeStatus" label="桩状态"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="stakeType" label="桩类型"></el-table-column>
                </el-table>
            </div>
          </div>
          <el-row>
                <el-col :span="4">
                    <div class="title"><i />基础信息</div>
                </el-col>
            </el-row>
            <section class="bg-items" style="line-height: 28px; padding: 10px 15px 10px 5px;margin-top: 8px;">
                <el-row>
                    <el-col :span="24"
                        ><span class="text_info_r">任务名称：</span><span>{{ zoneForm.taskName }}</span></el-col
                    >
                    <el-col :span="8"
                        ><span class="text_info_r">处理部门：</span><span>{{ zoneForm.orgName }}</span></el-col
                    >
                     <el-col :span="8"
                        ><span class="text_info_r">任务制定时间：</span><span>{{ zoneForm.createdTime }}</span></el-col
                    >
                     <el-col :span="8"
                        ><span class="text_info_r">任务截止时间：</span><span>{{ zoneForm.deadline }}</span></el-col
                    >
                     <el-col :span="8"
                        ><span class="text_info_r">持续时间：</span><span>{{ zoneForm.duration }}</span></el-col
                    >
                     <el-col :span="8"
                        ><span class="text_info_r">实际结束时间：</span><span>{{ zoneForm.endDate }}</span></el-col
                    >
                     <el-col :span="8"
                        ><span class="text_info_r">任务状态：</span><span>{{ zoneForm.state }}</span></el-col
                    >
                   
                    <el-col :span="24"
                        ><span class="text_info_r">巡视原因：</span><span>{{ zoneForm.inspectReason }}</span></el-col
                    >
                    </el-row>
                    
                    <el-form-item label="照片："style="margin:-13px 0 0 -2px;">
                        <div v-if="!!cities">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                >全选</el-checkbox
                            >
                            &nbsp;&nbsp;
                            <el-button size="mini" :disabled="!checkedCities.length" @click="handleBatchDownload" class="newButtonColor download_btn">下载</el-button>
                            <div style="margin: 15px 0"></div>
                            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="img in cities" :label="img" :key="img">
                                    <el-image :preview-src-list="cities" style="width: 80px; height: 80px" :src="img"></el-image>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-else>无照片</div>
                    </el-form-item>
                    
                    
			
                
                
            </section>
            
            
            
		 		
		 	
            
        </el-form>
    </div>
</template>

<script>
import { getDetails } from '@/api/operation/planTasks';
import FunLib from '@/utils/mulDownloadPic';
export default {
    data() {
        return {
            type: [],
            orgTreeData: [],
            gardenData: [],
            regTreeData: [], //区域数据
            state: [], // 基础设施状态 200
            formInline: {},
            dialogFormVisible: false,
            zoneForm: {},
            stationData: [],
            stationData2: [],
            stationForm: {},
            modelList: [], //  主模块
            childrenModelList: [], //  子模块
            seen: false,
            current: 0,
            modelName: '',
            modelNameMap: [],
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            alreadySelectList: [],
            selectStationVisible: false,
            infoData: [
                {
                    id: '1',
                    label: '1'
                }
            ],
            activeSwitch: 'tasks',
            checkAll: false,
	        checkedCities: [],
	        cities: [],
	        isIndeterminate: false
        };
    },
    created() {
    	
    },
    methods: {
    	handleBatchDownload() { 
            this.$message({
                message: '正在下载，请稍等...',
                type: 'info'
            });
            // console.log(this.urlArr, '<图片标识>');
            let fliesArr = [];
            //  把所有下载的图片都组装起来放到fliesArr
            for (let i = 0; i < this.cities.length; i++) {
                fliesArr.push({
                    url: this.cities[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
        },
    	handleCheckAllChange(val) {
	        this.checkedCities = val ? this.cities : [];
	        this.isIndeterminate = false;
	      },
	      handleCheckedCitiesChange(value) {
	        let checkedCount = value.length;
	        this.checkAll = checkedCount === this.cities.length;
	        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
	      },
        mouseEnter(index, id) {
            this.seen = true;
            this.current = index;
            this.childrenModelList = [];
            this.modelList.forEach((item) => {
                item.children.forEach((i) => {
                    if (i.parentId == id) {
                        this.childrenModelList.push(i);
                    }
                });
            });
        },
        mouseleave() {
            this.seen = false;
            this.current = null;
        },
        staChange() {},
        getData(id) {
            getDetails(id).then((res) => {
            	this.$parent.$parent.checks = res.data.inspectContentDetVos.map(item=>item.id)
                if (res.code === '000000') {
                	this.zoneForm = res.data;
                	this.cities = res.data.docUrls;
                    this.stationData2=res.data.inspectTaskStakeVos;
                    this.stationData = [
                        {
                            regName: res.data.regName,
                            staName: res.data.staName,
                            addr: res.data.addr,
                            totalStakeNum: res.data.totalStakeNum,
                            zlStakeNum: res.data.zlStakeNum,
                            jlStakeNum: res.data.jlStakeNum
                        }
                    ];
                    this.modelList = res.data.inspectContentDetVos;
                }else{
                	this.zoneForm = null
                	this.stationData2 = null
                	this.stationData = null
                	this.modelList = null
                	this.cities = null
                }
            }).catch(error=>{
            	this.zoneForm = {}
            	this.stationData2 = null
            	this.stationData = null
            	this.modelList = null
            	this.cities = null
            	this.$message({
	                message: '数据源有误',
	                type: 'error'
	            });
            	
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.text_info_r{
	display: inline-block;width: 100px;text-align: right;margin-right: 10px;color: darkgrey;
}
/deep/.el-form-item--small .el-form-item__label {
    line-height: 32px;
    color: darkgrey;
}
/deep/.el-col-4 {
    height: 32px;
    position: relative;
    top: -8px;
}
.title {
    margin: 20px;
    i {
        width: 4px;
        height: 14px;
        display: inline-block;
        background: #24b3ca;
        margin-right: 10px;
        margin-top: 3px;
        float: left;
        border-radius: 5px;
    }
}
.staSlect {
    width: 100px;
    background: #1396c2;
    color: white;
    border-radius: 5px;
    margin-left: -20px;
}
.staDel {
    width: 100px;
    background: white;
    color: rgb(211, 47, 46);
    border-radius: 3px;
    float: right;
    border: 1px solid rgb(211, 47, 46);
    margin-right: 20px;
}
//  主模块鼠标移入移出样式
.main-model {
    display: flex;
    .item-model {
        width: 200px;
        background: rgb(226, 243, 250);
        border: 1px solid rgb(190, 229, 224);
        margin-left: 10px;
        color: #006080;
        text-align: center;
    }
    .item-table {
        position: absolute;
        left: 20%;
        // top: 10vh;
        z-index: 5;
        background: white;
        padding: 20px;
    }
}
.bg-items {
    background: rgb(248, 248, 248);
}
//运维模块
.OpsModule {
	margin-top: 8px;
    padding: 15px 10px 30px 10px ;
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 5px;
    background-color: #f8f8f8;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin-right: 20px;
        //按钮的半透明颜色
        .btnClass {
        	padding: 6px 30px;
            color: #187fa2;
            border-radius: 3px;
            border: 1px solid #b9e2f9;
            background-color: #e2f3fa;
        }
        .btnClass:hover {
            color: #187fa2;
            border-radius: 3px;
            border: 1px solid #7ec0db;
            background-color: #c2e5f3;
        }
    }
}
</style>