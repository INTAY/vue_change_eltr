<template>
  <div class="paddingLeft">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
      stripe
      style="width: 100%">
      <el-table-column type="index" width="50" align="center"></el-table-column>

      <el-table-column label="任务名称" prop="name" align="center"></el-table-column>

      <el-table-column label="任务类型" prop="type" align="center"></el-table-column>

      <el-table-column label="状态" prop="status" align="center"></el-table-column>

      <el-table-column label="周期" prop="week" align="center"></el-table-column>

      <el-table-column label="运维内容" prop="cont" align="left"></el-table-column>

      <el-table-column label="任务制定时间" prop="startTime" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button class="table-link" @click="openDetailWin(scope.row)" type="text" size="small">详情</el-button>
          <el-button class="table-link" @click="dialogFormVisible = true" type="text" size="small">修改</el-button>
          <el-button class="table-link" @click="dialogSendVisible = true" type="text" size="small">下发</el-button>
          <el-button class="table-link" @click="dialogVerifyVisible = true" type="text" size="small">审核</el-button>
          <el-button class="table-link" @click="abolish" type="text" size="small">作废</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出层 详情 -->
    <el-dialog title="查看运维任务" :modal-append-to-body="false" :visible.sync="dialogDetailVisible" class="yw"
               width="800px">
      <div>
        <div class="form-item">
          <div class="form-item-title"><span class="line"></span>基本信息</div>
          <div class="form-item-content">
            <el-form ref="form" label-width="120px" size="small">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务名称：">站点普通周期保养</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任务类型：">周期保养</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="组织机构：">机构A</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="审核人：">张琳</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="周期：">每年</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="频次：">1</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="间隔时间："></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开始执行时间："></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束执行时间："></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维内容
            <el-select disabled v-model="caseVal" class="kz" placeholder="请选择">
              <el-option v-for="item in caseList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-item-content case-info">
            <el-form label-width="120px" size="small" class="xy">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预案名称：">
                    <el-link type="primary">普通计划巡检预案1</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述：">
                    <p class="caseDesc">该预案适用于普通计划巡视，一般包括场站环境巡视、安防监控巡视、配电设施巡视、消防安全巡视等。</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <!-- 运维设备 -->
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维设备
            <el-select disabled v-model="devSelTypeVal" class="kz" placeholder="请选择">
              <el-option v-for="item in devSelTypeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="dev-wrap">
            <el-table
              :data="tableDataOrg"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%">
              <el-table-column type="index" width="20" align="center"></el-table-column>
              <el-table-column label="组织机构名称" prop="name" align="center"></el-table-column>
              <el-table-column label="所属区域" prop="area" align="center"></el-table-column>
              <el-table-column label="详细地址" prop="address" align="left"></el-table-column>
            </el-table>
          </div>
        </div>

      </div>
    </el-dialog>
    <!-- 修改运维任务 -->
    <el-dialog title="修改运维任务" :modal-append-to-body="false" :visible.sync="dialogFormVisible" class="yw"
               width="800px">
      <div>
        <div class="form-item">
          <div class="form-item-title"><span class="line"></span>基本信息</div>
          <div class="form-item-content">
            <el-form ref="form" label-width="120px" size="small">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务名称：">站点普通周期保养</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任务类型：">周期保养</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="组织机构：">机构A</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="审核人：">张琳</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="周期：">每年</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="频次：">1</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="间隔时间："></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开始执行时间："></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束执行时间："></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维内容
            <el-select disabled v-model="caseVal" class="kz" placeholder="请选择">
              <el-option v-for="item in caseList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-item-content case-info">
            <el-form label-width="120px" size="small" class="xy">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预案名称：">
                    <el-link type="primary">普通计划巡检预案1</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述：">
                    <p class="caseDesc">该预案适用于普通计划巡视，一般包括场站环境巡视、安防监控巡视、配电设施巡视、消防安全巡视等。</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <!-- 运维设备 -->
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维设备
            <el-select disabled v-model="devSelTypeVal" class="kz" placeholder="请选择">
              <el-option v-for="item in devSelTypeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="dev-wrap">
            <el-table
              :data="tableDataOrg"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%">
              <el-table-column type="index" width="20" align="center"></el-table-column>
              <el-table-column label="组织机构名称" prop="name" align="center"></el-table-column>
              <el-table-column label="所属区域" prop="area" align="center"></el-table-column>
              <el-table-column label="详细地址" prop="address" align="left"></el-table-column>
            </el-table>
          </div>
        </div>

      </div>
    </el-dialog>
    <!-- 弹出层 下发 -->
    <el-dialog title="下发运维任务" :modal-append-to-body="false" :visible.sync="dialogSendVisible" class="yw" width="800px">
      <div>
        <div class="form-item">
          <div class="form-item-title"><span class="line"></span>基本信息</div>
          <div class="form-item-content">
            <el-form ref="form" label-width="120px" size="small">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务名称：">站点普通周期保养</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任务类型：">周期保养</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="组织机构：">机构A</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="审核人：">张琳</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="周期：">每年</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="频次：">1</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="间隔时间："></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开始执行时间："></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束执行时间："></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维内容
            <el-select disabled v-model="caseVal" class="kz" placeholder="请选择">
              <el-option v-for="item in caseList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-item-content case-info">
            <el-form label-width="120px" size="small" class="xy">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预案名称：">
                    <el-link type="primary">普通计划巡检预案1</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述：">
                    <p class="caseDesc">该预案适用于普通计划巡视，一般包括场站环境巡视、安防监控巡视、配电设施巡视、消防安全巡视等。</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <!-- 运维设备 -->
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维设备
            <el-select disabled v-model="devSelTypeVal" class="kz" placeholder="请选择">
              <el-option v-for="item in devSelTypeList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="dev-wrap">
            <el-table
              :data="tableDataOrg"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%">
              <el-table-column type="index" width="20" align="center"></el-table-column>
              <el-table-column label="组织机构名称" prop="name" align="center"></el-table-column>
              <el-table-column label="所属区域" prop="area" align="center"></el-table-column>
              <el-table-column label="详细地址" prop="address" align="left"></el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 生成工单 -->
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>生成工单
          </div>
          <div class="dev-wrap">
            <el-table
              :data="tableDataOrder"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%">
              <el-table-column type="index" width="20" align="center"></el-table-column>
              <el-table-column label="工单编号" width="80" prop="id" align="center"></el-table-column>
              <el-table-column label="运维班组" prop="group" align="center"></el-table-column>
              <el-table-column label="负责站点" prop="station" align="left"></el-table-column>
            </el-table>
          </div>
        </div>

      </div>
    </el-dialog>
    <!-- 弹出层 审核 -->
    <el-dialog title="审核运维任务" :modal-append-to-body="false" :visible.sync="dialogVerifyVisible" class="yw"
               width="800px">
      <div>
        <div class="form-item">
          <div class="form-item-title"><span class="line"></span>基本信息</div>
          <div class="form-item-content">
            <el-form ref="form" label-width="120px" size="small">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务名称：">站点普通周期保养</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任务类型：">周期保养</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="组织机构：">机构A</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="审核人：">张琳</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="周期：">每年</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="频次：">1</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="间隔时间："></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开始执行时间："></el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束执行时间："></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维内容
            <el-select disabled v-model="caseVal" class="kz" placeholder="请选择">
              <el-option v-for="item in caseList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="form-item-content case-info">
            <el-form label-width="120px" size="small" class="xy">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预案名称：">
                    <el-link type="primary">普通计划巡检预案1</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述：">
                    <p class="caseDesc">该预案适用于普通计划巡视，一般包括场站环境巡视、安防监控巡视、配电设施巡视、消防安全巡视等。</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>说明
          </div>
          <div class="dev-wrap">
            <el-input type="textarea" :rows="2" placeholder="请输入内容"></el-input>
          </div>
        </div>

      </div>

      <div class="dialog-footer">
        <el-button type="primary" class="btn-long" size="small">通过</el-button>
        <el-button size="small" class="btn-long">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getInspectTask} from "../../../../api/operation/pushButton";

  export default {
    data() {
      return {
        isStop: false,
        isStart: false,
        dialogDetailVisible: false,
        dialogFormVisible: false,
        dialogSendVisible: false,
        dialogVerifyVisible: false,
        caseVal: "1",
        devSelTypeVal: "1",
        // 运维任务详情
        inspectTask: {},
        tableDataOrder: [
          {"id": 1, "group": "朝阳运维班组", "station": "仰山公园充电站、酒仙桥国家电网充电站"}
        ],
        devSelTypeList: [
          {value: "1", label: "选组织机构"},
          {value: "2", label: "选充电站"},
          {value: "3", label: "选充电桩"}
        ],
        caseList: [
          {value: "1", label: "普通计划巡检预案1"},
          {value: "2", label: "普通计划巡检预案2"},
          {value: "3", label: "普通计划巡检预案3"}
        ],
        tableDataOrg: [
          {id: "1", name: "朝阳供电公司", area: "北京市朝阳区", address: "百子湾西里303号交通支队北侧院"},
          {id: "2", name: "海淀供电公司", area: "北京市海淀区", address: "四季青常青路6号"}
        ],
        tableData: [
          {
            name: "计划巡视1",
            type: "计划巡视",
            organization: "运维中心",
            week: "每年",
            cont: "充电站巡视",
            status: "待审核",
            startTime: '2018-10-01'
          },
          {
            name: "特殊巡视1",
            type: "特殊巡视",
            organization: "运维中心",
            week: "每季度",
            cont: "除尘、线路检修",
            status: "已审核未下发",
            startTime: '2018-10-01'
          },
          {
            name: "第3次周期保养1",
            type: "计划巡视",
            organization: "运维中心",
            week: "每月",
            cont: "除杂物",
            status: "已下发",
            startTime: '2018-10-01'
          },
          {
            name: "第1次巡视检查",
            type: "巡视检查",
            organization: "运维中心",
            status: "已保存",
            startTime: '2018-10-01'
          }
        ]
      };
    },
    methods: {
      // 详情接口
      openDetailWin(row) {
        this.dialogDetailVisible = true;
        let id = row.id;
        getInspectTask(id).then(res => {
          this.inspectTask = res.data
        })
      },

      // 作废
      abolish() {
        this.$confirm('确定要作废吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
        }).catch(() => {

        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .paddingLeft { //全局布局
    padding: 0 20px;
  }

  .table-link {
    border: 0 !important;
  }
  .el-button {
    color: #00607F;
    border: 1px solid #8FACB5;
  }

  .el-button:hover {
    color: #00607F;
    border: 1px solid #8FACB5;
    background-color: #FFF;
  }

  .el-button--primary {
    background-color: #00607F;
    border-color: #00607F;
    color: #FFF;
  }

  .el-button--primary:hover {
    background-color: #00607F;
    border-color: #00607F;
    color: #FFF;
  }

  .el-button--small.btn-long {
    padding: 9px 40px;
  }

  .el-button--small.btn-middle {
    padding: 9px 20px;
  }

  .el-button--mini, .el-button--small {
    border-radius: 2px;
  }

  .caseDesc {
    margin: 0;
  }

  .case-info {
    padding: 5px !important;
  }

  .case-info .el-form-item--mini.el-form-item, .case-info .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }

  .form-item {
    margin-bottom: 10px;

    .form-item-content {
      background-color: #fcfcfc;
      border: 1px solid #eee;
      padding: 15px 15px 0;
    }

    .form-item-title {
      font-size: 16px;
      line-height: 30px;
      color: #434343;
      margin-bottom: 5px;

      .line {
        display: inline-block;
        vertical-align: middle;
        width: 4px;
        height: 14px;
        margin-right: 10px;
        background-color: #24b3ca;
        border-radius: 4px;
      }
    }
  }

</style>
