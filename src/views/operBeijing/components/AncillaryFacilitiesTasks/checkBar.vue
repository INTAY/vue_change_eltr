<template>
    <div>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="区县">
                <el-select size="mini" class="inputWidth" v-model="formInline.regId" @change="queryByCondition(formInline.regId)" clearable>
                    <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="站点名称" class="a">
                <el-select size="mini" filterable class="inputWidth" v-model="formInline.stationId" clearable>
                    <el-option v-for="item in staMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button size="mini" class="newButtonColor SearchBTN" @click="search">查询</el-button>
                <el-button size="mini" class="otherBTN SearchBTN" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getDict, DICTDATA } from '@/api/dict';
import { queryStationByRegAndName, region } from '@/api/operBeijing/stopAndRestore';
import { queryStationAndStakeNum } from '@/api/operation/planTasks';
export default {
    data() {
        return {
            formInline:{},
            staMap: [], //站
            regionMap: [], //区域
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.regionMap = [];
            //  获取区域信息(区县)
            region(sessionStorage.getItem("regId")).then((res) => {
                if (res.code == '000000') {
                    this.regionMap = res.data;
                    this.staMap = [];
                }
            });
        },
        // 根据区域查站点
        queryByCondition(arg) {
            this.staMap = [];
            let params = { regId: arg, stationName: '' };
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data;
                }
            });
        },
        /**
         * 查询
         */
        search() {
            let params = {
                regId: this.formInline.regId
            };
            queryStationAndStakeNum(params).then((res) => {
                if (res.code === '000000') {
                    console.log("res",res);
                }
            });
        },
        /**
         * 清空查询条件
         */
        clear() {
            this.formInline = {};
        }
    }
}
</script>