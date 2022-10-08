<template>
  <div>
    <el-table :data="tableData" :header-cell-style="{height: '45px'}" stripe class="tableStyle">
      <el-table-column
        v-for="(item,index) in channelType"
        :key="index"
        :type="item.type"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :fit="false"
        class="Detail"
        align="center"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-button @click="Details(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrap-fixed" v-if="page" id="page-wrap-fixed">
      <el-pagination
        :current-page.sync="listInfo.query.current"
        :page-size="listInfo.query.size"
        :total="listInfo.pageTotal"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper, slot"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <span class="el-pagination__jump page-option-wrap">
          <a class="page-option-icon" href="javascript:;" @click="refresh" title="刷新">
            <img src="../../../../static/img/7.png" />
          </a>
          <i class="split-line"></i>
          <a class="page-option-icon" href="javascript:;" @click="exportTable" title="导出">
            <img src="../../../../static/img/8.png" />
          </a>
        </span>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channelType: [
        { type: "index", width: "50" },
        { prop: "channelConfigInfo", label: "通道配置信息" },
        { prop: "Describe", label: "通道描述" },
        { prop: "IP", label: "IP" },
        { prop: "port", label: "端口号", width: "100" },
        { prop: "protocol", label: "协议", width: "100" },
        { prop: "RTStatus", label: "实时状态" },
        { prop: "warningTime", label: "告警开始时间" },
        { prop: "WarmingElapsedTime", label: "告警持续时长(分钟)" }
      ],
      tableData: [
        {
          channelConfigInfo: "NTZ2ZZ",
          Describe: "车联网至本平台",
          IP: "192.168.11",
          port: "80",
          protocol: "HTTPS",
          RTStatus: "正常",
          warningTime: "2016-5-28",
          WarmingElapsedTime: "258"
        },
        {
          channelConfigInfo: "NTZ2ZZ",
          Describe: "车联网至本平台",
          IP: "192.168.11",
          port: "80",
          protocol: "HTTPS",
          RTStatus: "正常",
          warningTime: "2016-5-28",
          WarmingElapsedTime: "258"
        },
        {
          channelConfigInfo: "NTZ2ZZ",
          Describe: "车联网至本平台",
          IP: "192.168.11",
          port: "80",
          protocol: "HTTPS",
          RTStatus: "正常",
          warningTime: "2016-5-28",
          WarmingElapsedTime: "258"
        }
      ],
      page: true,
      listInfo: {
        pageTotal: 0, // 总条数
        pageSizes: [5, 10, 20, 50, 100], // 分页数量列表
        query: {
          // 查询条件
          current: 1, // 当前页
          size: 20 // 每页条数
        }
      },
    };
  },
  methods: {
    Details(val) {
    },
    handleSizeChange() {
      const query = this.listInfo.query;
      query.size = val; // 每页条数
      query.current = 1; // 每页条数切换，重置当前页
    },
    handleCurrentChange() {
      this.listInfo.query.current = val; // 当前页
    },
    refresh() {},
    exportTable() {}
  }
};
</script>

<style lang="scss" scoped>
.tableStyle {
  width: 96%;
  margin: 28px 0 0 18px;
  font-size: 14px;
  tbody tr:hover>td {
    background-color: #f5b8b8;
  }
}
.el-table tr {
  color: red;
}
</style>