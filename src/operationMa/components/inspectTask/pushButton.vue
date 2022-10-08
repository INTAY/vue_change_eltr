<template>
  <div>
    <!-- 新增运维任务弹出层 -->
    <el-dialog
      title="新增运维任务"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="addWin"
      width="1150px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form
              ref="inspectTaskForm"
              :model="inspectTaskForm"
              :rules="rules"
              label-width="120px"
              size="small"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务名称" prop="taskName">
                    <el-input
                      size="mini"
                      v-model="inspectTaskForm.taskName"
                      placeholder="请输入任务名称"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任务类型" prop="taskType">
                    <el-select
                      v-model="inspectTaskForm.taskType"
                      size="mini"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in devOpsTaskTypes"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="审批人" prop="checkManName">
                    <el-input
                      id="checkManNameTxtbox"
                      v-model="inspectTaskForm.checkManName"
                      @focus="showOrgTree"
                    ></el-input>
                        <!-- 组织机构用户树 -->
                    <div class="org-tree-wrap" ref="orgUserTree" v-show="visibleOrgTree">
                      <el-tree
                        ref="tree"
                        :data="usersTree"
                        default-expand-all
                        node-key="id"
                        :expand-on-click-node="false"
                        show-checkbox
                        :check-strictly="true"
                        :props="props"
                        @check-change="handleCheckChange"
                        @node-click="userNodeClick"
                        :highlight-current="true"
                      >
                        <span class="span-ellipsis" slot-scope="{ node }">
                          <span :title="node.label">{{ node.label }}</span>
                        </span>
                      </el-tree>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="组织机构" prop="orgId">
                    <el-select
                      v-model="nodeValue.value"
                      size="mini"
                      placeholder="请选择组织机构树"
                      :disabled="disabledState"
                      clearable
                      ref="nodeSelect"
                    >
                      <el-option
                        :value="nodeValue.value"
                        :key="nodeValue.value"
                        :label="nodeValue.name"
                        style="width: auto;height:auto;overflow: auto;background-color:#fff"
                      >
                        <el-tree
                          :props="props"
                          :data="orgsTree"
                          style="background-color: #fafafa;width:auto"
                          node-key="id"
                          @node-click="handleNodeClick"
                        >
                          <span slot-scope="{ node, data }">
                            <span>
                              <i
                                v-if="node.expanded && node.childNodes.length==0"
                                class="el-icon-document-remove"
                              ></i>
                              <i
                                v-if="node.expanded && node.childNodes.length>0"
                                class="el-icon-folder-opened"
                              ></i>
                              <i
                                v-else-if="data.children!=null && data.children.length==0"
                                class="el-icon-document-remove"
                              ></i>
                              <i v-else class="el-icon-folder"></i>
                              <span>{{node.label}}</span>
                            </span>
                          </span>
                        </el-tree>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="周期" prop="period">
                    <el-select
                      v-model="inspectTaskForm.period"
                      placeholder="请选择"
                      size="mini"
                    >
                      <el-option
                        v-for="item in cycleTimes"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="频次" prop="freq">
                    <el-input
                      size="mini"
                      v-model="inspectTaskForm.freq"
                      placeholder="请输入频次"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="开始执行时间" prop="startDate">
                    <el-date-picker
                      v-model="inspectTaskForm.startDate"
                      format="yyyy-MM-dd HH:mm"
                      type="datetime"
                      size="mini"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束执行时间" prop="endDate">
                    <el-date-picker
                      v-model="inspectTaskForm.endDate"
                      format="yyyy-MM-dd HH:mm"
                      type="datetime"
                      size="mini"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="间隔时间" prop="intervalDays">
                    <el-input
                      size="mini"
                      v-model="inspectTaskForm.intervalDays"
                      placeholder="请输入间隔时间"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              
            </el-form>
          </div>
        </div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维内容
            <el-select
              v-model="devopsSchemesV.name"
              size="mini"
              placeholder="请选择"
              @change="checkClick"
            >
              <el-option
                v-for="item in devopsSchemes"
                :key="item.id"
                :label="item.name"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div class="form-item-content case-info">
            <el-form label-width="120px" size="small">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预案名称：" prop="inspectContentId">
                    <a href="javascript:void(0)" type="primary">
                      <span v-text="devopsSchemesV.name" @click="openDetailWin"></span>
                    </a>
                  </el-form-item>
                </el-col>
              </el-row>
              <br />
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述：">
                    <p class="caseDesc" v-text="devopsSchemesV.description"></p>
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
            <el-select
              size="mini"
              v-model="devicesTargetValue.name"
              placeholder="请选择"
              @change="changeSelect"
            >
              <el-option
                v-for="item in devopsDevicesTarget"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="form-item-content case-info">
            <div class="dev-wrap">
              <!-- 选组织机构 -->
              <div class="single org" v-show="tabIsShow == 1">
                <div class="search-wrap">
                  <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="组织机构名称">
                      <el-input
                        size="mini"
                        placeholder="请输入组织机构名称"
                        v-model="orgName"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="区域">
                      <el-cascader
                        v-model="regionValue"
                        ref="cascader"
                        :options="areas"
                        :props="props"
                        size="mini"
                        clearable
                      ></el-cascader>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        size="mini"
                        type="primary"
                        class="searchColor"
                        @click="queryBtnClick"
                      >查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="item-sel">
                  <div class="left">
                    <div class="title">待选组织机构</div>
                    <div class="cont">
                      <el-table
                        :data="tableData"
                        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                        stripe
                        style="width: 100%"
                        height="300"
                        highlight-current-row
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column :show-overflow-tooltip="true" type="selection" width="45" />
                        <el-table-column :show-overflow-tooltip="true" label="组织机构名称" prop="name" />
                        <el-table-column
                          :show-overflow-tooltip="true"
                          label="所属区域"
                          prop="regionFullName"
                        />
                        <el-table-column
                          :show-overflow-tooltip="true"
                          label="详细地址"
                          prop="addresDesc"
                        />
                      </el-table>
                    </div>
                    <!-- 分页 -->
                    <div class="block">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        style="display: inline-block;width: 180px"
                        :current-page="currentPage"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        class="tablePagination"
                      ></el-pagination>
                      <el-button
                        type="text"
                        icon="el-icon-refresh"
                        size="small"
                        style="float: right;margin-top: -1px;margin-right: 10px"
                        @click="getOperationsByPage"
                      />
                    </div>
                  </div>

                  <div class="middle">
                    <div>
                      <el-button class="move" title="添加" @click="moveRowsClick" />
                    </div>
                  </div>

                  <div class="right">
                    <div class="title">
                      已选组织机构
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        style="height:30px;width:50px;margin-left: 69%;margin-top: 2px"
                        @click="removeRowsClick"
                      />
                    </div>
                    <div class="cont">
                      <el-table
                        :data="tableData1.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
                        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                        highlight-current-row
                        stripe
                        height="300"
                        style="width: 100%"
                        @selection-change="handleSelectionChange1"
                      >
                        <el-table-column :show-overflow-tooltip="true" type="selection" width="45" />
                        <el-table-column :show-overflow-tooltip="true" label="组织机构名称" prop="name" />
                        <el-table-column
                          :show-overflow-tooltip="true"
                          label="所属区域"
                          prop="regionFullName"
                        />
                        <el-table-column
                          :show-overflow-tooltip="true"
                          label="详细地址"
                          prop="addresDesc"
                        />
                      </el-table>
                    </div>
                    <!-- 分页 -->
                    <div class="block">
                      <el-pagination
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        style="display: inline-block;width: 180px"
                        :current-page="currentPage1"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize1"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total1"
                        class="tablePagination"
                      ></el-pagination>
                      <el-button
                        type="text"
                        icon="el-icon-refresh"
                        size="small"
                        style="float: right;margin-top: -1px;margin-right: 10px"
                        @click="getOrgsByPage"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 选站点 -->
              <div class="single station" v-show="tabIsShow == 2">
                <div class="search-wrap">
                  <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="站点名称">
                      <el-input
                        size="mini"
                        placeholder="请输入站点名称"
                        class="inputWidth"
                        v-model="orgName"
                      />
                    </el-form-item>

                    <el-form-item label="站点类型">
                      <el-select
                        size="mini"
                        v-model="siteValue"
                        placeholder="全部"
                        class="selectWidth"
                        clearable
                      >
                        <el-option
                          v-for="item in siteTypes"
                          :key="item.value"
                          :value="item"
                          :label="item.name"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="区域">
                      <el-cascader
                        v-model="regionValue"
                        :options="areas"
                        :props="props"
                        size="mini"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        size="mini"
                        type="primary"
                        class="searchColor"
                        @click="queryBtnClick"
                      >查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="item-sel">
                  <div class="left">
                    <div class="title">待选站点</div>
                    <div class="cont">
                      <el-table
                        :data="tableData"
                        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                        stripe
                        height="300"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column :show-overflow-tooltip="true" type="selection" width="45" />
                        <el-table-column :show-overflow-tooltip="true" label="站点名称" prop="name" />
                        <el-table-column :show-overflow-tooltip="true" label="所属区域" prop="area" />
                        <el-table-column :show-overflow-tooltip="true" label="详细地址" prop="addr" />
                      </el-table>
                    </div>
                    <!-- 分页 -->
                    <div class="block">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        style="display: inline-block;width: 180px"
                        :current-page="currentPage"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        class="tablePagination"
                      ></el-pagination>
                      <el-button
                        type="text"
                        icon="el-icon-refresh"
                        size="small"
                        style="float: right;margin-top: -1px;margin-right: 10px"
                        @click="getOrgsByPage"
                      />
                    </div>
                  </div>

                  <div class="middle">
                    <div>
                      <el-button class="move" title="添加" @click="moveRowsClick" />
                    </div>
                  </div>

                  <div class="right">
                    <div class="title">
                      已选站点
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        style="height:30px;width:50px;margin-left: 69%;margin-top: 2px"
                        @click="removeRowsClick"
                      />
                    </div>
                    <div class="cont">
                      <el-table
                        :data="tableData1"
                        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                        stripe
                        height="300"
                        style="width: 100%"
                        @selection-change="handleSelectionChange1"
                      >
                        <el-table-column type="selection" width="45" align="center" />
                        <el-table-column :show-overflow-tooltip="true" label="站点名称" prop="name" />
                        <el-table-column :show-overflow-tooltip="true" label="所属区域" prop="area" />
                        <el-table-column :show-overflow-tooltip="true" label="详细地址" prop="address" />
                      </el-table>
                    </div>
                    <!-- 分页 -->
                    <div class="block">
                      <el-pagination
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        style="display: inline-block;width: 180px"
                        :current-page="currentPage1"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize1"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total1"
                        class="tablePagination"
                      ></el-pagination>
                      <el-button
                        type="text"
                        icon="el-icon-refresh"
                        size="small"
                        style="float: right;margin-top: -1px;margin-right: 10px"
                        @click="getOrgsByPage"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 选充电桩 -->
              <div class="single charge" v-show="tabIsShow == 3">
                <div class="search-wrap">
                  <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="组织机构">
                      <el-select
                        v-model="nodeData.value"
                        size="mini"
                        class="kz"
                        placeholder="请选择组织机构树"
                        :disabled="disabledState"
                        clearable
                        ref="nodeCSelect"
                      >
                        <el-option
                          :value="nodeData.value"
                          :key="nodeData.value"
                          :label="nodeData.name"
                          style="width: auto;height:auto;overflow: auto;background-color:#fff"
                        >
                          <el-tree
                            :props="props"
                            :data="orgsTree"
                            style="background-color: #fafafa;width:auto"
                            node-key="id"
                            @node-click="handleNodeClick1"
                          >
                            <span slot-scope="{ node, data }">
                              <span>
                                <i
                                  v-if="node.expanded && node.childNodes.length==0"
                                  class="el-icon-document-remove"
                                />
                                <i
                                  v-if="node.expanded && node.childNodes.length>0"
                                  class="el-icon-folder-opened"
                                />
                                <i
                                  v-else-if="data.children!=null && data.children.length==0"
                                  class="el-icon-document-remove"
                                />
                                <i v-else class="el-icon-folder" />
                                <span>{{node.label}}</span>
                              </span>
                            </span>
                          </el-tree>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="区域" style="margin-left: -120px">
                      <el-cascader
                        :options="areas"
                        :props="props"
                        size="mini"
                        clearable
                        @change="handleChange"
                      />
                    </el-form-item>
                    <el-form-item label="站点">
                      <el-select
                        size="mini"
                        v-model="chargeDevicesValue"
                        placeholder="全部"
                        clearable
                        class="selectWidth"
                      >
                        <el-option
                          v-for="item in chargeDevices"
                          :value="item"
                          :key="item.id"
                          :label="item.name"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button size="small" class="searchColor" @click="queryBtnClick">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="item-sel">
                  <div class="left">
                    <div class="title">待选充电桩</div>
                    <div class="cont">
                      <el-table
                        :data="tableData"
                        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                        stripe
                        height="300"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column type="index" width="20" align="center" />
                        <el-table-column type="selection" width="45" align="center" />
                        <el-table-column label="充电桩编号" prop="id" align="center" />
                        <el-table-column label="充电桩类型" prop="kind" align="center" />
                        <el-table-column label="功率(kW)" prop="ratePower" align="center" />
                      </el-table>
                    </div>
                    <div class="block">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        style="display: inline-block;width: 180px"
                        :current-page="currentPage"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        class="tablePagination"
                      ></el-pagination>
                      <el-button
                        type="text"
                        icon="el-icon-refresh"
                        size="small"
                        style="float: right;margin-top: -1px;margin-right: 10px"
                        @click="queryOperationQueryDevPage"
                      />
                    </div>
                  </div>

                  <div class="middle">
                    <div>
                      <button class="move" title="添加" @click="moveRowsClick" />
                    </div>
                  </div>

                  <div class="right">
                    <div class="title">
                      已选站点
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        style="height:30px;width:50px;margin-left: 69%;margin-top: 2px"
                        @click="removeRowsClick"
                      />
                    </div>
                    <div class="cont">
                      <el-table
                        :data="tableData1"
                        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                        stripe
                        height="300"
                        style="width: 100%"
                        @selection-change="handleSelectionChange1"
                      >
                        <el-table-column type="index" width="20" align="center" />
                        <el-table-column type="selection" width="45" align="center" />
                        <el-table-column label="充电桩编号" prop="id" align="center" />
                        <el-table-column label="充电桩类型" prop="type" align="center" />
                        <el-table-column label="功率(kW)" prop="kw" align="center" />
                      </el-table>
                    </div>
                    <!-- 分页 -->
                    <div class="block">
                      <el-pagination
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        style="display: inline-block;width: 180px"
                        :current-page="currentPage1"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize1"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total1"
                        class="tablePagination"
                      ></el-pagination>
                      <el-button
                        type="text"
                        icon="el-icon-refresh"
                        size="small"
                        style="float: right;margin-top: -1px;margin-right: 10px"
                        @click="getOrgsByPage"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button
          type="primary"
          class="btn-long"
          size="small"
          @click="submitAdd('inspectTaskForm')"
        >确认</el-button>
        <el-button size="small" class="btn-long" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <div>
      <!-- 弹出层 查看预案 -->
      <el-dialog
        title="查看预案"
        :modal-append-to-body="false"
        :visible.sync="detailWin"
        class="yw"
        width="900px"
      >
        <div>
          <div class="form-item">
            <div class="form-item-title">
              <span class="line" />基本信息
            </div>
            <div class="form-item-content">
              <el-form ref="form" label-width="120px" size="small">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="预案名称：">{{DevOpsDetail.name}}</el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="组织机构：">{{DevOpsDetail.orgName}}</el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="状态：">{{DevOpsDetail.statusName}}</el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="描述：">{{DevOpsDetail.description}}</el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-title">
              <span class="line" />运维方案
            </div>
            <div class="case-content">
              <el-tree
                :data="cashTreeData"
                :props="props"
                node-key="id"
                :default-expand-all="true"
              />
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDict, DICTDATA } from "@/api/dict";
import { getOrgUserTree } from "@/api/commonApi"

import {
  getOrgTree,
  getOrgById,
  queryList,
  getAreas,
  queryDevOpsOrgByPage,
  getOperationQueryPage,
  queryOperationQueryDevPage,
  getStateList,
  addDevOpsTask,
  getDetail
} from "@/api/operation/pushButton";

export default {
  data() {
    return {
      // 新增运维任务弹出层是否显示
      addWin: false,
      // 下拉框的禁用状态值
      disabledState: false,
      detailWin: false,
      DevOpsDetail: {},
      cashTreeData: [],
      orgName: "",
      regionValue: "",
      inspectTaskForm: {
        checkManId: "",
        checkManName: "",
        checkManOrgId: "",
        endDate: "",
        freq: "",
        inspectContentId: "",
        inspectObjForms: [],
        intervalDays: "",
        orgId: "",
        period: "",
        startDate: "",
        taskName: "",
        taskType: ""
      },
      // 新增参数校验
      rules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" }
        ],
        taskType: [
          { required: true, message: "请选择任务类型", trigger: "blur" }
        ],
        checkManId: [
          { required: true, message: "请选择审核人", trigger: "blur" }
        ],
        orgId: [{ required: true, message: "请选择组织机构", trigger: "blur" }],
        period: [{ required: true, message: "请选择周期", trigger: "blur" }],
        freq: [{ required: true, message: "请输入频次", trigger: "blur" }],
        inspectContentId: [
          { required: true, message: "请选择运维内容", trigger: "blur" }
        ],
        intervalDays: [
          {
            required: true,
            message: "根据频次和执行时间长度进行计算填写",
            trigger: "blur"
          }
        ],
        startDate: [
          { required: true, message: "请选取开始时间", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选取结束时间", trigger: "blur" }
        ]
      },
      // 显示不同的页面
      tabIsShow: 1,
      // 运维任务
      devOpsTaskTypes: [],
      // 时间周期
      cycleTimes: [],
      cycleTimesValue: "",
      props: {
        label: "name",
        children: "children"
      },
      // 组织结构树
      orgsTree: [],
      // 组织结构用户数
      usersTree: [],
      nodeValue: {
        value: "",
        name: "",
        lable: ""
      },
      nodeData: {
        value: "",
        name: "",
        lable: ""
      },
      // 审核人
      nodeUsersValue: {
        value: "",
        name: "",
        lable: ""
      },
      // 运维方案列表
      devopsSchemes: [],
      devopsSchemesV: {},
      // 运维对象
      devopsDevicesTarget: [],
      // 运维对象值
      devicesTargetValue: {
        value: 1,
        name: "组织机构"
      },
      queryParams: {},
      //分页相关属性
      currentPage: 1,
      pageSize: 20,
      total: 40,
      // 分页
      currentPage1: 1,
      pageSize1: 10,
      total1: 0,
      // 查询参数
      // table表格数据
      tableData: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      // 区域数据
      areas: [],
      props: {
        children: "children",
        label: "name",
        value: "id"
      },
      // 站点类型
      siteTypes: [],
      siteValue: "",
      chargeDevices: [],
      chargeDevicesValue: "",
      // 查询参数
      params: {},
      nodesArray: [],
      visibleOrgTree: false
    };
  },
  created() {},
  methods: {
    // 弹框弹出按钮功能代码
    openAddWin() {
      this.orgsTree = [];
      this.devopsSchemesV = {};
      this.inspectTaskForm = {};
      this.devicesTargetValue.name = "组织机构";
      this.devicesTargetValue.value = 1;
      this.addWin = true;
      this.getDevOpsTypes();
      let roleId = sessionStorage.getItem("roleId");
      let orgId = sessionStorage.getItem("orgId");
      let id = orgId.replace(/\"/g, "");
      if (roleId.indexOf("101") != -1) {
        getOrgTree().then(res => {
          for (let i = 0; i < res.data.length; i++) {
            this.orgsTree.push(res.data[i]);
          }
        });
      }
      if (roleId.indexOf("101") == -1) {
        getOrgById(id).then(res => {
          this.nodeValue.value = res.data.id;
          this.nodeValue.name = res.data.name;
        });
        this.disabledState = true;
      }
    
      // 获取运维列表
      queryList(this.queryParams).then(res => {
        this.devopsSchemes = res.data;
      });
      this.getCycleTime();
      this.getDevOpsDevicesTarget();
      this.getOrgsByPage();
      this.queryRegTree(-1);
    },
    // 获取运维任务类型
    getDevOpsTypes() {
      getDict(DICTDATA.DEVOPS_TASK_TYPE).then(res => {
        this.devOpsTaskTypes = res;
      });
    },
    // 获取周期
    getCycleTime() {
      getDict(DICTDATA.CYCLE_TIME).then(res => {
        this.cycleTimes = res;
      });
    },
    // 获取运维设备对象
    getDevOpsDevicesTarget() {
      getDict(DICTDATA.DEVOPS_DEVICES_TARGET).then(res => {
        this.devopsDevicesTarget = res;
      });
    },
    /**
     * 选择组织机构文本框聚焦
     */
    showOrgTree() {
      this.visibleOrgTree = true;
      // 获取组织机构用户树接口调用
      this.getOrgTree();
    },
    /**
     * 获取组织机构用户树接口调用
     * 该接口的参数未确定，目前无参，获取所有组织机构，后面考虑数据权限时再确定参数
     */
    getOrgTree() {
      if (this.usersTree && this.usersTree.length < 1) {
        getOrgUserTree("-1").then(res => {
          this.usersTree = [res.data];
        });
      }
    },
    /**
     * 组织机构树
     */
    handleNodeClick(node) {

    },
    handleNodeClick1(node) {
      this.nodeData.value = node.id;
      this.nodeData.name = node.name;
      let id = "";
      id = node.regionId;
      this.queryRegTree(id);
      this.$refs.nodeCSelect.blur();
    },
    // 多级联动选择器选中事件
    handleChange(value) {
      this.params.regId = value[value.length - 1];
      getStateList(this.params).then(res => {
        this.chargeDevices = res.data.records;
      });
    },
    // 审核人树节点点击事件
    userNodeClick(node) {
      this.nodeUsersValue.value = node.id;
      this.nodeUsersValue.name = node.name;
      // 赋值
      this.inspectTaskForm.checkManId = node.id;
      this.inspectTaskForm.checkManName = node.name;
      this.inspectTaskForm.checkManOrgId = node.pid;
      this.$refs.nodeUSelect.blur();
    },
    // 运维预案下拉框点击事件
    checkClick(value) {
      this.devopsSchemesV.name = value.name;
      this.devopsSchemesV.description = value.description;
      this.inspectTaskForm.inspectContentId = value.id;
      let id = this.inspectTaskForm.inspectContentId;
      getDetail(id)
        .then(res => {
          this.DevOpsDetail = res.data;
          this.cashTreeData = res.data.inspectContentDetVo.children;
        })
        .catch(res => {
          this.$message({
            message: res.data,
            type: "error"
          });
        });
    },
    // 点击运维方案的名称显示详情
    openDetailWin() {
      this.detailWin = true;
    },
    // 运维设备下拉框点击事件，切换tab
    changeSelect(value) {
      this.tabIsShow = value;
      if (this.tabIsShow === 1) {
        this.tableData = [];
        this.tableData1 = [];
        this.getOrgsByPage();
      }
      if (this.tabIsShow === 2) {
        // 获取站点类型
        getDict(DICTDATA.SITE_TYPE).then(res => {
          this.siteTypes = res;
        });
        this.tableData = [];
        this.tableData1 = [];
        // 加载站点table表格数据
        this.getOperationsByPage();
      }
      if (this.tabIsShow === 3) {
        this.tableData = [];
        this.tableData1 = [];
        this.queryOperationQueryDevPage(this.params);
      }
    },
    //地区数据查询，翻译使用
    queryRegTree(id) {
      return new Promise((resolve, reject) => {
        getAreas(id).then(res => {
          this.areas = this.getTreeData(res.data.children);
          resolve();
        });
      });
    },
    // 递归算法
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    // 查询按钮接口
    queryBtnClick() {
      if (this.tabIsShow === 1) {
        this.params.regionId = this.regionValue[this.regionValue.length - 1];
        this.params.name = this.orgName;
        queryDevOpsOrgByPage(this.params).then(res => {
          this.tableData = res.data.records;
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        });
      }
      if (this.tabIsShow === 2) {
        this.params.regId = this.regionValue[this.regionValue.length - 1];
        this.params.name = this.orgName;
        this.params.type = this.siteValue.value;
        getOperationQueryPage(this.params).then(res => {
          this.tableData = res.data.records;
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
        });
      }
      if (this.tabIsShow === 3) {
        this.params.staId = this.chargeDevicesValue.staId;
        this.queryOperationQueryDevPage(this.params);
      }
    },
    // 获取组织结构表格数据
    getOrgsByPage(params) {
      queryDevOpsOrgByPage(params).then(res => {
        this.tableData = res.data.records;
        this.currentPage = res.data.current;
        this.pageSize = res.data.size;
        this.total = res.data.total;
      });
    },
    // 获取站点表格数据
    getOperationsByPage(params) {
      getOperationQueryPage(params).then(res => {
        this.tableData = res.data.records;
        this.currentPage = res.data.current;
        this.pageSize = res.data.size;
        this.total = res.data.total;
      });
    },
    // 获取充电桩数据
    queryOperationQueryDevPage(params) {
      queryOperationQueryDevPage(params).then(res => {
        for (let i = 0; i < res.data.records.length; i++) {
          if (res.data.records[i].kind === 1) {
            res.data.records[i].kind = "充电桩";
          }
          if (res.data.records[i].kind === 2) {
            res.data.records[i].kind = "充电枪";
          }
        }
        this.tableData = res.data.records;
        this.currentPage = res.data.current;
        this.pageSize = res.data.size;
        this.total = res.data.total;
      });
    },
    handleCheckChange(data, checked, node) {
      if (checked == true) {
        this.inspectTaskForm.checkManName = data.name;
        this.inspectTaskForm.checkManId = data.id;
        this.$refs.tree.setCheckedNodes([data]);
        this.visibleOrgTree = false;

        // 校验表单
        this.$refs["form"].validateField("checkManName");
      }
    },
    // 分页点击事件
    handleSizeChange(val) {
      if (this.tabIsShow === 1) {
        this.pageSize = val;
        this.params.size = this.pageSize;
        this.params.current = 1;
        this.getOrgsByPage(this.params); //点击选择每页显示多少数据就会发送size，让页面显示多少条，并且默认第一个页面
      }
      if (this.tabIsShow === 2) {
        this.pageSize = val;
        this.params.size = this.pageSize;
        this.params.current = 1;
        this.getOperationsByPage(this.params);
      }
      if (this.tabIsShow === 3) {
        this.pageSize = val;
        this.params.size = this.pageSize;
        this.params.current = 1;
        this.queryOperationQueryDevPage(this.params);
      }
    },
    handleCurrentChange(val) {
      if (this.tabIsShow === 1) {
        this.params.size = this.pageSize;
        this.params.current = val;
        this.getOrgsByPage(this.params); //点击第几页就会发送要显示的页数过去
      }
      if (this.tabIsShow === 2) {
        this.params.size = this.pageSize;
        this.params.current = val;
        this.getOperationsByPage(this.params);
      }
      if (this.tabIsShow === 3) {
        this.params.size = this.pageSize;
        this.params.current = val;
        this.queryOperationQueryDevPage(this.params);
      }
    },
    //待选table的选中事件
    handleSelectionChange(values) {
      this.tableData2 = values;
      this.total1 = this.tableData1.length;
    },
    //已选table的选中事件
    handleSelectionChange1(values) {
      this.tableData3 = values;
    },
    // 移动按钮接口
    moveRowsClick() {
      this.tableData1 = this.tableData2;
      this.total1 = this.tableData1.length;
    },
    // 删除按钮接口
    removeRowsClick() {
      if (this.tableData3.length == this.tableData1.length) {
        this.tableData1 = [];
      }
      if (this.tableData3.length < this.tableData1.length) {
        //临时数组存放
        let tempArray1 = []; //临时数组1
        let tempArray2 = []; //临时数组2
        for (let j = 0; j < this.tableData3.length; j++) {
          tempArray1[this.tableData3[j].id] = true;
        }
        for (let i = 0; i < this.tableData1.length; i++) {
          if (!tempArray1[this.tableData1[i].id]) {
            tempArray2.push(this.tableData1[i]); //过滤array1 中与array2 相同的元素；
          }
        }
        this.tableData1 = tempArray2;
      }
      this.total1 = this.tableData1.length;
    },
    // 分页点击事件
    handleSizeChange1(val) {
      this.pageSize1 = val;
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
    },
    // 保存按钮
    submitAdd(formName) {
      this.inspectTaskForm.inspectObjForms = [];
      if (this.tabIsShow === 1) {
        if (this.tableData1.length === 0) {
          this.$message.error("请选择至少一条组织机构数据！");
          return false;
        }
      }
      if (this.tabIsShow === 2) {
        if (this.tableData1.length === 0) {
          this.$message.error("请选择至少一条站点数据！");
          return false;
        }
      }
      if (this.tabIsShow === 3) {
        if (this.tableData1.length === 0) {
          this.$message.error("请选择至少一条充电桩数据！");
          return false;
        }
      }
      if (this.inspectTaskForm.inspectContentId === undefined) {
        this.$message.error("请选择运维内容！");
        return false;
      }
      for (let i = 0; i < this.tableData1.length; i++) {
        let deviceForm = {};
        deviceForm.objId = this.tableData1[i].id;
        deviceForm.objType = this.tabIsShow;
        this.inspectTaskForm.inspectObjForms.push(deviceForm);
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          addDevOpsTask(this.inspectTaskForm)
            .then(res => {
              this.$message({
                message: res.data,
                type: "success"
              });
            })
            .catch(res => {
              this.$message({
                message: res.mesg,
                type: "error"
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.org-tree-wrap {
  height: 200px;
  overflow-y: auto;
  overflow-x: auto;
  position: absolute;
  left: 0;
  top: 33px;
  right: 0;
  z-index: 2;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
}

.s {
  padding: 15px 40px;

  .push {
    color: white;
    background: #006080;
    width: 120px;
  }
}

.kz {
  width: 200px;
  margin-right: 120px;
}

.el-button--small.btn-long {
  padding: 9px 40px;
}

.el-button--small.btn-middle {
  padding: 9px 20px;
}

.el-button--primary {
  background-color: #00607f;
  border-color: #00607f;
  color: #fff;
}

.el-button--primary:hover {
  background-color: #00607f;
  border-color: #00607f;
  color: #fff;
}

.case-info {
  padding: 5px !important;
}

.case-info .el-form-item--mini.el-form-item,
.case-info .el-form-item--small.el-form-item {
  margin-bottom: 0;
}

.form-item {
  margin-bottom: 10px;

  .form-item-content {
    background-color: #fcfcfc;
    border: 1px solid #eee;
    padding: 15px 15px 0;
  }

  .item-sel .left[data-v-9dd3591a] {
    width: 510px;
    float: left;
    border: 1px solid #eaeaea;
    border-radius: 4px;
  }

  .item-sel .right[data-v-9dd3591a] {
    width: 509px;
    float: left;
    border: 1px solid #eaeaea;
    border-radius: 4px;
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

.caseDesc {
  margin: 0;
}

.item-sel {
  overflow: hidden;

  .left {
    width: 490px;
    float: left;
    border: 1px solid #eaeaea;
    border-radius: 4px;

    .title {
      background-color: #f1f1f1;
      color: #00607f;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      font-weight: bold;
    }

    .cont {
      height: 300px;
      padding: 10px;
      overflow-y: auto;
    }
  }

  .middle {
    width: 75px;
    height: 300px;
    float: left;
    text-align: center;
    padding-top: 60px;
  }

  .right {
    width: 490px;
    float: left;
    border: 1px solid #eaeaea;
    border-radius: 4px;

    .title {
      background-color: #f1f1f1;
      color: #00607f;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      font-weight: bold;
    }

    .cont {
      height: 300px;
      padding: 10px;
      overflow-y: auto;
    }
  }
}

.move {
  width: 45px;
  height: 45px;
  background: #24b3ca url(../../../../assets/image/arrow-right.png) no-repeat
    center center;
  background-size: 26px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.block {
  background-color: #f7f7f7;
}

.searchColor {
  color: white !important;
  background: #006080 !important;
  width: 50px;
  height: 25px;
}
</style>
