<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline"  label-width="100px">
      <div class="yi">
        <el-form-item label="区县" class="a">
          <el-select @change="changeModelClick" size="mini" v-model="formInline.devType" value-key="value" class="xzk">
            <el-option v-for="item in devType" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="站点" class="a ab">
          <el-select @change="changeModelClick" size="mini" v-model="formInline.devType" value-key="value" class="xzk">
            <el-option v-for="item in devType" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充电桩编号">
          <el-input size="mini" v-model="formInline.devName" placeholder="请输入配变名称"></el-input>
        </el-form-item>
        <el-form-item label="充电枪编号" class="a">
          <el-input size="mini" v-model="formInline.devName" placeholder="请输入配变名称"></el-input>
        </el-form-item>
        <el-form-item label="工作状态" class="a">
          <el-select @change="changeFactory" size="mini" v-model="formInline.factId" value-key="value" placeholder="全部" class="xzk">
            <el-option v-for="item in factorys" :key="item.id" :label="item.factName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计时间" class="a">
          <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="接收健康" class="a">
          <el-select size="mini" v-model="formInline.state" placeholder="全部" class="xzk">
            <el-option value>全部</el-option>
            <el-option v-for="item in unitDate" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推送健康" class="a">
          <el-select size="mini" v-model="formInline.state" placeholder="全部" class="xzk">
            <el-option value>全部</el-option>
            <el-option v-for="item in unitDate" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-button  @click="onSubmit" class="newButtonColor ">查询</el-button>
        <el-button @click="empty">清空</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
    import {
        getOrgTree
    } from "@/api/property/garden";
    import {
        queryFactorys
    } from "@/api/system/production";
    import {
        queryModelList,
        cx
    } from "@/api/system/type";
    import treeSelect from "@/components/treeSelect/treeSelect";
    export default {
        props: {
            queryParam: this.formInline
        },
        data() {
            return {
                paramsFact: {
                    kind: 2011,
                    factType: ""
                },
                paramsModel: {
                    factId: ""
                },
                factorys: [],
                modelTypes: [], //生产厂家

                formInline: {
                    devType: "",
                    devType1: ""
                },
                orgTreeData: [],
                isClearable: true, // 可清空（可选）
                isAccordion: true, // 可收起（可选）
                orgDefaultProps: {
                    value: "id",
                    label: "name",
                    children: "children"
                },
                regTreeData: [],
                defaultProps: {
                    checkStrictly: true,
                    children: "children",
                    value: "id",
                    label: "name"
                },
                devType: [], // 设备类型 2011
                unitDate: [], // 设备状态
                submitDate: {
                    devClass: 2011
                } //查询数据
            };
        },
        components: {
            treeSelect
        },
        created() {
            this.cx();
        },
        methods: {
            setData() {
                this.regTreeData = this.$parent.$parent.regTreeData;
                this.devType = this.$parent.$parent.devType;
                this.unitDate = this.$parent.$parent.unitDate;
                this.orgTreeData = this.$parent.$parent.$refs.erji.orgTreeData;
            },
            getValue(value) {
                this.formInline.orgId = value;
            },
            // 获取厂家
            cx(data) {
                cx(this.submitDate)
                    .then(res => {
                        this.factorys = res.data.records;
                        this.modelTypes = res.data.records;
                    })
                    .catch(err => {
                        this.$message.error("获取厂家数据失败");
                    });
            },
            onSubmit() {
                this.$parent.queryParam = this.formInline;
                this.$parent.getDataInit();
            },
            empty() {
                this.formInline = {};
                this.$refs.treeSelect.valueTitle = "";
            },
            // 选中组织机构树
            handleNodeClick(item) {
                this.formInline.orgId = item.id;
                this.formInline.orgName = item.name;
                this.visibleOrgTree = false;
            },
            showOrgTree() {
                this.visibleOrgTree = true;
                // 获取组织机构树接口调用
                this.getOrgTree();
            },
            getOrgTree() {
                if (this.orgTreeData && this.orgTreeData.length < 1) {
                    getOrgTree().then(res => {
                        this.orgTreeData = res.data;
                        //
                    });
                }
            },
            //省市区三联框点击后触发
            handleChange(value) {
                this.formInline.regId = value[value.length - 1]; //取地区里最后一个值发给后端
            },
            /**
             * 根据分类、类型，获取厂家下拉框数据
             */
            changeModelClick(value) {
                
                this.paramsFact.factType = value;
                queryFactorys(this.paramsFact).then(res => {
                    
                    this.factorys = res.data;
                });
            },
            changeFactory(value) {
                this.paramsModel.factId = value;
                queryModelList(this.paramsModel).then(res => {
                    
                    this.modelTypes = res.data;
                });
            },
        }
    };
</script>
<style lang="scss" scoped>
    /deep/ .ab .el-input--medium .el-input__icon {
        line-height: 30px;
    }

    /deep/ .el-form--inline .el-form-item__label {
        display: inline;
    }

    form.el-form.demo-form-inline.el-form--inline {
        height: 100%;
    }

    .t {
        background: #fcfcfc !important;
    }

    .btk {
        width: 120px !important;
    }

    .xzk {
        width: 160px !important;
    }

    .zkk {
        width: 120px;
    }

    .xan {
        color: white !important;
        background: #006080 !important;
        width: 60px;
        height: 30px;
        margin-left: 20px;
    }

    .zxan {
        color: #006080 !important;
        height: 30px;
    }

    .a {
        padding-left: 10px;
    }

    /deep/.el-input__inner {
        height: 30px !important;
    }

    /deep/ .el-select-tree .el-input.is-active .el-input__inner {
        border-color: #00607f !important;
    }
</style>
