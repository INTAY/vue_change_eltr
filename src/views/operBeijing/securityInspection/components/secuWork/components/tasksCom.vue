<template>
    <div class="tasks">
        <el-form ref="form" :model="zoneForm" label-width="110px" size="small">
        	<!-- 站点选择 -->
            <el-row>
                <el-col :span="4">
                    <div class="title"><i />站点选择</div>
                </el-col>
            </el-row>
            <div style="padding: 0 20px">
                <el-table
                    :data="stationData"
                    style="width: 100%"
                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                    @selection-change="staChange"
                >
                    <el-table-column type="index" width="70" align="center" />
                    <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                    <el-table-column prop="staName" label="站名称" width="180"></el-table-column>
                    <el-table-column prop="addr" label="站地址"></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                </el-table>
            </div>
            <div class="title"><i />基础信息</div>
            <section class="bg-items" style="line-height: 30px">
                <el-row>
                    <el-col :span="8"
                        ><span class="text_info_r">任务名称：</span><span>{{ zoneForm.taskName }}</span></el-col
                    >
                    <el-col :span="8"
                        ><span class="text_info_r">处理部门：</span><span>{{ zoneForm.orgName }}</span></el-col
                    >
                    <el-col :span="8"
                        ><span class="text_info_r">频率：</span><span>{{ zoneForm.checkManName }}</span></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="8"
                        ><span class="text_info_r">任务制定时间：</span><span>{{ zoneForm.state }}</span></el-col
                    >
                    <el-col :span="8"
                        ><span class="text_info_r">周期：</span><span>{{ zoneForm.state }}</span></el-col
                    >
                    <el-col :span="8"
                        ><span class="text_info_r">审批人：</span
                        ><span>{{ zoneForm.state }}</span></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="6"
                        ><span class="text_info_r">任务状态：</span><span>{{ zoneForm.state }}</span></el-col
                    >
                </el-row>
            </section>
            <!-- 运维模块 -->
            
            <div class="title"><i />运维模块</div>
            <div class="OpsModule">
                <el-form ref="form" :model="zoneForm" label-width="80px" size="mini">
                    <el-form-item label="模块名称：">
                        <span>{{ zoneForm.inspName }}</span>
                    </el-form-item>
                    <el-form-item label="主模块：">
                        <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                            <el-popover placement="bottom" width="400" trigger="hover">
                                <el-table :data="item.children" stripe>
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" label="子模块名称"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            
            <!-- 桩选择 -->
            <el-row>
                <el-col :span="4">
                    <div class="title"><i />巡视原因</div>
                </el-col>
            </el-row>
            <div style="padding: 0 40px">
                {{zoneForm.inspectReason}}
            </div>
            <!-- 桩选择 -->
            <el-row>
                <el-col :span="4">
                    <div class="title"><i />桩选择</div>
                </el-col>
            </el-row>
            <div style="padding: 0 20px">
                <el-table
                    :data="stationData2"
                    style="width: 100%"
                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                    @selection-change="staChange"
                >
                    <el-table-column type="index" width="70" align="center" />
                    <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                    <el-table-column prop="staName" label="站名称" width="180"></el-table-column>
                    <el-table-column prop="addr" label="站地址"></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                </el-table>
            </div>
            
            <div class="title"><i />反馈照片
            	<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-left: 10px;">全选</el-checkbox>
		 		<el-button size="mini" class="newButtonColor SearchBTN" @click="" style="margin-left: 10px;">下载</el-button>
		 	</div>
		 		
		 	<div class="title" >
			 	<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
				    <el-checkbox v-for="img in cities" :label="img" :key="img">{{img}}</el-checkbox>
				</el-checkbox-group>
			</div>
            
            
        </el-form>
    </div>
</template>

<script>
import { getDetails } from '@/api/operation/planTasks';
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
	        checkedCities: ['img1',],
	        cities: ['img1', 'img2', 'img3',],
	        isIndeterminate: true
        };
    },
    created() {
    	
    },
    methods: {
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
                if (res.code === '000000') {
                    this.zoneForm = {
                        taskName: res.data.taskName,
                        orgName: res.data.orgName,
                        checkManName: res.data.checkManName,
                        state: res.data.state,
                        inspName: res.data.inspName,
                        inspectReason:res.data.inspectReason,
                    };
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
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.text_info_r{
	display: inline-block;width: 100px;text-align: right;margin-right: 10px;color: darkgrey;
}
.tasks {
    /*border: 1px solid #cecece;*/
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
    padding: 10px 20px;
    background: rgb(248, 248, 248);
}
//运维模块
.OpsModule {
    padding: 30px;
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 29px;
    background-color: #f8f8f8;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;

        margin-right: 20px;
        //按钮的半透明颜色
        .btnClass {
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