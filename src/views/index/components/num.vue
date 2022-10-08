<template>
  <el-row :gutter="20" class="iframe">
    <el-col :span="15">
      <div class="left">
        <el-row :gutter="24">
          <el-col :span="4" class="all">
            <div class="line"></div>
            <div><span>{{this.info.cdzsl}}</span>&nbsp;座</div>
            <p>充电站数量</p>
          </el-col>
          <el-col :span="5" class="all">
            <div class="line"></div>
            <div><span>{{this.info.jlzsl}}</span>&nbsp;台</div>
            <p>交流桩数量</p>
          </el-col>
          <el-col :span="5" class="all">
            <div class="line"></div>
            <div><span>{{this.info.zlzsl}}</span>&nbsp;台</div>
            <p>直流桩数量</p>
          </el-col>
          <el-col :span="5" class="all">
            <div class="line"></div>
            <div><span>{{this.info.yxcdzsl}}</span>&nbsp;台</div>
            <p>有序充电桩数量</p>
          </el-col>
          <el-col :span="5" class="all">
            <div><span>{{this.info.cdrl | numberToCurrency}}</span>&nbsp;kW</div>
            <p>充电容量</p>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="9">
      <div class="right">
        <el-row :gutter="24">
          <el-col :span="8" class="all">
            <div class="line"></div>
            <div><span>{{this.info.ddcsl | numberToCurrency}}</span>&nbsp;辆</div>
            <p>电动汽车数量</p>
          </el-col>
          <el-col :span="8" class="all">
            <div class="line"></div>
            <div><span>{{this.info.yhcn | numberToCurrency}}</span>&nbsp;kWh</div>
            <p>用户侧储能</p>
          </el-col>
          <el-col :span="8" class="all">
            <div><span>{{this.info.gfcn}}</span>&nbsp;kW</div>
            <p>光伏装机容量</p>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
    import {
        numberToCurrency
    } from '../../../utils/filters/numberToCurrency'
    import {
        getAssetInfo
    } from "@/api/operation/home";
    import {
        getOrgById
    } from '@/api/operation/statisticAnalysis'
    export default {
        data() {
            return {
                orgId: JSON.parse(sessionStorage.getItem("user")).orgId,
                info: {},
                regionId: ''
            };
        },
        filters: {
            numberToCurrency
        },
        props: [],
        mounted() {
            this.getRegId(this.orgId)
        },
        destroyed() {},
        methods: {
            getRegId() {
                getOrgById(this.orgId).then(res => {
                    if (res.mesg === '处理成功') {
                        this.regionId = res.data.regionId
                        this.getInfo(this.regionId);
                    }
                })
            },
            getInfo(param) {
                getAssetInfo(param).then(res => {
                    if (res.code === '000000') {
                        this.info = res.data
                    }
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    .iframe {
        position: relative; // margin-top: 20px;
        height: 80px;
        .left {
            border: 1px solid #cbd9e6;
            height: 80px;
            background: #f4f7fa;
            .line {
                position: absolute;
                width: 1px;
                height: 50px;
                background: #cbd9e6;
                right: 0;
            }
        }
        .right {
            border: 1px solid #eeddae;
            height: 80px;
            background: #fbf6e8;
            .line {
                position: absolute;
                width: 1px;
                height: 50px;
                background: #eeddae;
                right: 0;
            }
        }
    }

    .all {
        position: relative;
        text-align: center;
        div {
            font-size: 14px;
            margin-top: 15px;
            color: #7e7e7e;
            span {
                font-size: 24px;
                color: #282828;
                font-weight: 600;
            }
        }
        p {
            font-size: 14px;
            margin-top: 6px;
            color: #7e7e7e;
        }
    }
</style>
