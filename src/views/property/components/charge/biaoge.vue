<template>
  <div>
    <div id="table-wrap">
      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
        style="width: auto"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        ref="tableDataRef"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          v-if="colData[0].istrue"
          label="编号"
          prop="id"
          sortable="custom"
          show-tooltip-when-overflow
        />
        <el-table-column
          v-if="colData[1].istrue"
          label="设施名称"
          prop="devName"
          show-overflow-tooltip
          sortable="custom"
        />
        <el-table-column
          v-if="colData[2].istrue"
          label="所属充电站"
          prop="staName"
          show-overflow-tooltip
          sortable="custom"
        />
        <!-- <el-table-column
          v-if="colData[3].istrue"
          label="设备类型"
          prop="devType"
          sortable="custom"
          :formatter="deviceFormart"
        /> -->
        <el-table-column
          v-if="colData[3].istrue"
          label="组织机构"
          prop="orgName"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="colData[4].istrue"
          label="行政区域"
          prop="regId"
          :formatter="regFormat"
          show-overflow-tooltip
          sortable="custom"
        />
        <el-table-column
          v-if="colData[5].istrue"
          label="状态"
          prop="state"
          sortable="custom"
          :formatter="statusFormat"
        />
        <!-- <el-table-column
          v-if="colData[6].istrue"
          label="上级设备"
          prop
          sortable="custom"
        /> -->
        <el-table-column
          v-if="colData[6].istrue"
          label="生产厂家"
          prop="factName"
          sortable="custom"
        />
        <el-table-column
          v-if="colData[7].istrue"
          label="设备型号"
          prop="modelName"
          sortable="custom"
        />
        <el-table-column
          v-if="colData[8].istrue"
          label="额定功率"
          prop="ratePower"
          sortable="custom"
        />
        <el-table-column
          v-if="colData[9].istrue"
          label="出厂日期"
          :formatter="dateFormat"
          prop="mfdTime"
          sortable="custom"
        />
        <el-table-column
          v-if="colData[10].istrue"
          label="投运日期"
          :formatter="dateFormat"
          prop="optTime"
          sortable="custom"
        />
        <el-table-column
          v-if="colData[11].istrue"
          label="资产编号"
          prop="assetNo"
          sortable="custom"
        />
        <el-table-column
          v-if="colData[12].istrue"
          label="第三方资产编号"
          prop="sourceId"
          sortable="custom"
        />

        <el-table-column fixed="right" width="180" label="操作">
          <template slot-scope="scope">
            <el-button @click="openDetail(scope.row)" class="common-btn"
              >详情
            </el-button>
            <el-button class="common-btn" @click="openModifyWin(scope.row)"
              >修改
            </el-button>
            <el-button class="delete-btn" @click="handleDelete(scope.row)"
              >删除
            </el-button>
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
                style="padding: 0; border-color: #f1f1f1"
              ></el-button>
              <div class="col-setting-title">展示列设置</div>
              <el-checkbox-group
                v-model="colOptions"
                :min="1"
                class="col-setting-group"
              >
                <el-checkbox v-for="item in colSelect" :label="item" :key="item"
                  >{{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div class="page-wrap-fixed" id="page-wrap-fixed">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper, slot"
      >
        <span class="el-pagination__jump page-option-wrap">
          <a
           class="el-icon-refresh page-option-icon"
            href="javascript:;"
            @click="refresh"
            title="刷新"
          >
            <!-- <img src="/static/img/7.png" /> -->
          </a>
          <i class="split-line"></i>
          <a
            class="el-icon-upload2 page-option-icon"
            href="javascript:;"
            @click="exportAssetStake"
            title="导出"
          >
            <!-- <img src="/static/img/8.png" /> -->
          </a>
        </span>
      </el-pagination>
    </div>

    <div>
      <div></div>
      <!-- 详情 -->
      <div>
        <el-dialog
          title="详情"
          :visible.sync="detailWin"
          class="xqyy"
          top="15vh"
          style="left: 170px"
          width="1200px"
          :modal-append-to-body="false"
        >
          <div class="xqye">
            <div class="tu">
              <el-card shadow="never" :body-style="{ padding: '0px' }">
                <img
                  :src="imageUrl"
                  alt
                  style="height: 180px; width: 180px; text-align: center"
                />
              </el-card>
            </div>
            <el-form
              :inline="true"
              :model="sizeForm"
              label-width="150px"
              class="demo-form-inline xqy"
              style="width: auto"
            >
              <el-row class="y h">
                <el-col :span="12" class="k">
                  <el-form-item label="充电枪名称:">
                    <span>{{ sizeForm.devName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="充电设施编号:">
                    <span>{{ sizeForm.id }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="h">
                <el-col :span="12" class="k">
                  <el-form-item label="组织机构:">
                    <span>{{ sizeForm.orgName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="状态:">
                    <span>{{ sizeForm.stateName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="y h">
                <el-col :span="12" class="k">
                  <el-form-item label="行政区域:">
                    <span>{{ sizeForm.regName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="所属充电站:">
                    <span>{{ sizeForm.staName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="h">
                <el-col :span="12" class="k">
                  <el-form-item label="能量补给类型:">
                    <span>{{ sizeForm.engSupType }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="额定功率:" class="b">
                    <span>{{ sizeForm.ratePower }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="y h">
                <el-col :span="12" class="k">
                  <el-form-item label="生产厂家:">
                    <span>{{ sizeForm.factName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="设备型号:">
                    <span>{{ sizeForm.modelName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="h">
                <el-col :span="12" class="k">
                  <el-form-item label="资产编号:">
                    <span>{{ sizeForm.assetNo }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="第三方资产编号:" class="b">
                    <span>{{ sizeForm.sourceId }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="y h">
                <el-col :span="12" class="k">
                  <el-form-item label="出厂日期:">
                    <span>{{ sizeForm.mfdTime }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="投运日期:">
                    <span>{{ sizeForm.optTime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="h">
                <el-col :span="12" class="k">
                  <el-form-item label="是否有序:" class="b">
                    <span v-if="sizeForm.isOrder == 1">是</span>
                    <span v-if="sizeForm.isOrder == 0">否</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- 附属设备表格部分 -->
          <div class="table-top">
            <span class="table-top-a">附属设备</span>
            <span>
              <el-button
                size="mini"
                class="listBTN newButtonColor"
                @click="addFs"
                >新增</el-button
              >
              <el-button
                size="mini"
                class="listBTN BatchDeleteColor"
                @click="batchDelete"
                >批量删除</el-button
              >
            </span>
          </div>
          <el-table
            :data="tableEqData"
            stripe
            style="width: auto"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="设备类型"
              prop="attachType"
              :formatter="spareFormart"
              sortable="custom"
              show-tooltip-when-overflow
            />
            <el-table-column
              label="标识/SIM卡号"
              prop="attachId"
              show-overflow-tooltip
            />
            <el-table-column
              label="生产厂家"
              prop="factName"
              show-overflow-tooltip
            />
            <el-table-column
              label="设备型号"
              prop="modelName"
              show-overflow-tooltip
            />
            <el-table-column
              label="资产编码"
              prop="assertNo"
              show-overflow-tooltip
            />
            <el-table-column
              label="生产日期"
              prop="factCreateTime"
              :formatter="dateFormat"
              show-overflow-tooltip
            />
            <el-table-column
              label="软件版本号"
              prop="version"
              show-overflow-tooltip
            />
            <!-- <el-table-column
              label="电表类型"
              prop="meterType"
              :formatter="ammeteFormart"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="电表封号" prop="meterProid" show-overflow-tooltip />
            <el-table-column
              label="SIM卡状态"
              prop="attachState"
              :formatter="simFormart"
              show-overflow-tooltip
            />-->
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click="detail(scope.row)" type="text" size="small"
                  >详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
      <!-- 修改数据 -->
      <div>
        <el-dialog
          title="修改充电桩"
          :visible.sync="modifyWin"
          width="1000px"
          :close-on-click-modal="false"
          :modal-append-to-body="false"
        >
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="120px"
            size="small"
            class="qw"
          >
            <div class="k">
              <el-form-item label="充电枪名称" prop="devName">
                <el-input size="mini" v-model="form.devName" class="kz" />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="状态" prop="state">
                <el-select size="mini" v-model="form.state" class="kz">
                  <el-option
                    v-for="item in this.$parent.$refs.topform.devicesStatus"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="组织机构" prop="orgId">
                <tree-select
                  ref="treeSelect"
                  v-model="form.orgId"
                  :props="orgDefaultProps"
                  :options="orgsTree"
                  :clearable="isClearable"
                  :accordion="isAccordion"
                  @getValue="getValue($event)"
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="所属充电站" prop="staId">
                <el-select
                  v-model="form.staId"
                  @change="getStaId"
                  filterable
                  clearable
                  placeholder="请选择"
                  class="kz"
                >
                  <el-option
                    v-for="item in restaurants"
                    :key="item.id"
                    :label="item.staName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="行政区域" class="a" prop="regId">
                <el-cascader
                  v-model="form.regId"
                  size="mini"
                  :options="this.$parent.$refs.topform.areas"
                  :props="regProps"
                  clearable
                  @change="handleChange"
                  class="kz"
                />
              </el-form-item>

              <!-- <el-form-item label="行政区域">
                <el-input
                  size="mini"
                  v-model="form.region"
                  readonly
                  class="kz"
                />
              </el-form-item> -->
            </div>

            <!-- <div class="k">
              <el-form-item label="上级设备">
                <el-input
                  readonly
                  placeholder="保留，暂不填"
                  disabled
                  class="kz"
                />
              </el-form-item>
            </div> -->

            <div class="k">
              <el-form-item label="能量补给类型" prop="engSupType">
                <el-select
                  size="mini"
                  class="kz"
                  v-model="form.engSupType"
                  clearable
                >
                  <el-option
                    v-for="item in this.$parent.$refs.erji.energys"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <!-- <el-form-item label="设备类型" prop="devType">
                <el-select
                  size="mini"
                  @change="changeModelClick"
                  v-model="form.devTypeName"
                  value-key="value"
                  class="kz"
                >
                  <el-option
                    v-for="item in this.$parent.$refs.erji.deviceTypes"
                    :label="item.name"
                    :key="item.value"
                    :value="item"
                  />
                </el-select>
              </el-form-item> -->
            </div>

            <div class="k">
              <el-form-item label="生产厂家" prop="factId">
                <el-select
                  size="mini"
                  v-model="form.factId"
                  value-key="id"
                  class="kz"
                  @change="changeFactory"
                >
                  <el-option
                    v-for="item in factorys"
                    :key="item.id"
                    :label="item.factName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="设备型号">
                <el-select
                  size="mini"
                  v-model="form.modelId"
                  value-key="id"
                  class="kz"
                  @change="changeDeviceModel"
                >
                  <el-option
                    v-for="item in modelTypes"
                    :key="item.id"
                    :label="item.modelName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="额定功率(KW)" prop="ratePower">
                <el-input
                  size="mini"
                  v-model="form.ratePower"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="额定功率"
                  class="kz"
                />
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="资产编号" prop="assetNo">
                <el-input
                  size="mini"
                  v-model="form.assetNo"
                  placeholder
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="第三方资产编号" prop="sourceId">
                <el-input
                  size="mini"
                  v-model="form.sourceId"
                  placeholder
                  class="kz"
                />
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="出厂日期" prop="mfdTime">
                <el-date-picker
                  size="mini"
                  v-model="form.mfdTime"
                  type="date"
                  class="kz"
                />
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="投运日期" prop="optTime">
                <el-date-picker
                  size="mini"
                  v-model="form.optTime"
                  type="date"
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="是否有序" prop="isOrder">
                <el-radio v-model="form.isOrder" label="0">否</el-radio>
                <el-radio v-model="form.isOrder" label="1">是</el-radio>
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="图片">
                <el-select
                  size="mini"
                  class="kz"
                  clearable
                  @change="chooseImage"
                  v-model="checkValue"
                >
                  <el-option
                    v-for="item in this.$parent.$refs.erji.picUploadType"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
                <el-image
                  class="kz aniupic"
                  :src="imageUrl"
                  placeholder="暂无图片"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <div slot="tip" class="el-upload__tip1">
                (只能上传jpg/png/gif文件，2MB以内)
              </div>
            </div>
            <!-- <div class="k">
            </div> -->
          </el-form>
          <div class="dialog-footer">
            <el-button
              size="small"
              @click="saveForm"
              class="editorBTN btnSpace bouncedHold"
              >确定
            </el-button>
            <el-button
              size="small"
              @click="modifyWin = false"
              class="editorBTN cancelBTN"
              >取消
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <!-- 图片本地上传 -->

    <div>
      <el-dialog
        title="图片本地上传"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        top="30vh"
        :modal="true"
        :visible.sync="uploadWin"
        width="880px"
        class="dialogClass"
      >
        <singleimageupload ref="singleimageupload" />
      </el-dialog>
    </div>
    <!-- 图片列表选取 -->
    <div>
      <el-dialog
        title="图片列表"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        top="20vh"
        :modal="true"
        :visible.sync="imagesWin"
        width="880px"
        class="dialogClass"
      >
        <picTable ref="picTable" />
      </el-dialog>
    </div>

    <!-- 新增附属设备弹框 -->
    <div>
      <el-dialog
        title="新增附属设备"
        :visible.sync="addFsVisible"
        width="850px"
        class="yw"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :before-close="handleClose"
      >
        <el-form
          ref="eqForm"
          :model="eqForm"
          :rules="eqRules"
          label-width="110px"
          size="small"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备类型" prop="attachType" class="k">
                <el-select
                  size="mini"
                  v-model="eqForm.attachType"
                  @change="searchFactByType"
                  placeholder="全部"
                  clearable
                >
                  <!-- <el-option label="全部"></el-option> -->
                  <el-option
                    v-for="item in searchTypeOption"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- --------------------------------------------------------------------- -->
            <el-col :span="12">
              <el-form-item label="生产厂家" prop="factId" class="k">
                <el-select
                  size="mini"
                  v-model="eqForm.factId"
                  placeholder="全部"
                  @change="searchModel"
                  clearable
                >
                  <el-option
                    v-for="item in searchFactOption"
                    :key="item.id"
                    :label="item.factName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- --------------------------------------------------- -->
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="设备型号" prop="modelId" class="k">
                <el-select
                  size="mini"
                  v-model="eqForm.modelId"
                  placeholder="全部"
                  @change="changeModel"
                  clearable
                >
                  <el-option
                    v-for="item in searchModelOption"
                    :key="item.id"
                    :label="item.modelName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="SIM卡号"
                prop="attachId"
                v-show="eqForm.attachType == 3 ? true : false"
                class="k"
              >
                <el-input size="mini" v-model="eqForm.attachId" class="kz" />
              </el-form-item>
              <el-form-item
                label="设备标识"
                prop="attachId"
                v-show="eqForm.attachType == 3 ? false : true"
                class="k"
              >
                <el-input size="mini" v-model="eqForm.attachId" class="kz" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="资产编号" class="k">
                <el-input size="mini" v-model="eqForm.assertNo" class="kz" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产日期" class="k">
                <el-date-picker
                  size="mini"
                  v-model="eqForm.factCreateTime"
                  type="date"
                  class="kz"
                  picker-options
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-show="eqForm.attachType == 7 ? true : false">
            <el-col :span="12">
              <el-form-item label="电表类型" class="k">
                <el-select size="mini" v-model="eqForm.meterType" class="kz">
                  <el-option
                    v-for="item in ammeteType"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电表封号" class="k">
                <el-input size="mini" v-model="eqForm.meterProid" class="kz" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="软件版本号" class="k">
                <el-input size="mini" v-model="eqForm.version" class="kz" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="SIM卡状态"
                v-show="eqForm.attachType == 3 ? true : false"
                class="k"
              >
                <el-select size="mini" v-model="eqForm.attachState" class="kz">
                  <el-option
                    v-for="item in simStatus"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="dialog-footer">
          <el-button
            size="small"
            @click="save"
            class="editorBTN btnSpace bouncedHold"
            >确定
          </el-button>
          <el-button size="small" @click="cancel" class="editorBTN cancelBTN"
            >取消
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 附属设备详情弹框 -->
    <div>
      <el-dialog
        title="附属设备详情"
        :visible.sync="auxiliaryVisible"
        width="930px"
        class="xqee"
        :modal-append-to-body="false"
      >
        <div class="xqyq">
          <el-form
            :inline="true"
            :model="auxiliaryForm"
            label-width="100px"
            class="demo-form-inline xqy"
          >
            <div class="xq">
              <div class="y h">
                <el-form-item label="设备类型" class="a">
                  <span>{{ auxiliaryForm.attachType }}</span>
                </el-form-item>

                <el-form-item label="生产厂家" class="a">
                  <span>{{ auxiliaryForm.factName }}</span>
                </el-form-item>
              </div>
              <div class="h">
                <el-form-item label="设备型号" class="a">
                  <span>{{ auxiliaryForm.modelName }}</span>
                </el-form-item>
                <el-form-item label="标识/SIM卡号" class="a">
                  <span>{{ auxiliaryForm.attachId }}</span>
                </el-form-item>
              </div>

              <div class="y h">
                <el-form-item label="资产编码" class="a">
                  <span>{{ auxiliaryForm.assertNo }}</span>
                </el-form-item>
                <el-form-item label="生产日期" class="a">
                  <span>{{ formatDate(auxiliaryForm.factCreateTime) }}</span>
                </el-form-item>
              </div>

              <div class="h">
                <el-form-item label="软件版本号" class="a">
                  <span>{{ auxiliaryForm.version }}</span>
                </el-form-item>
                <el-form-item
                  label="SIM卡状态"
                  v-show="auxiliaryForm.attachState ? true : false"
                  class="a"
                >
                  <span>{{ auxiliaryForm.attachState }}</span>
                </el-form-item>
              </div>
              <div class="y h" v-show="auxiliaryForm.meterProid ? true : false">
                <el-form-item label="电表类型" class="a">
                  <span>{{ auxiliaryForm.meterType }}</span>
                </el-form-item>

                <el-form-item label="电表封号" class="a">
                  <span>{{ auxiliaryForm.meterProid }}</span>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.srk {
  width: 200px;
}

.s {
  padding: 20px 0;
}

// 二级
// 详情
.xqye {
  display: flex;
}

.tu {
  margin: 0 40px 0 30px;
}

.a {
  width: 250px;
}

.c {
  width: 500px;
}

.y {
  width: 800px;
  background: #f5f5f5;
}

.kz {
  width: 220px !important;
  margin-right: 120px;
}

.h {
  width: 800px;
  height: 40px;
  display: flex;
}

.xqy {
  margin: 0px 0px 30px 0px;
}

//新增用户

.bz {
  width: 175px;
}

.dw {
  margin-right: 125px;
  display: flex;
}

.dw span {
  margin-top: 8px;
  margin-left: 5px;
}

.dw1 {
  padding-right: 4px;
}

.qw {
  width: 1000px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-left: 80px;
}

.kz {
  width: 200px;
  margin-right: 30px;
}

.yz {
  width: 600px;
}

.sexy {
  display: flex;
  margin-top: 8px;
}

.yx {
  margin-left: 110px;
}

.gsxz {
  display: flex;
}

.gs {
  width: 130px;
}

.danw {
  margin: 0px 0px 20px 5px;
}

.k {
  width: 400px;
}
</style>
<script>
import {
  deleteData,
  getStationList,
  modifyData,
  queryByPage,
  queryByStakeId,
  addEqInfo,
  batchDeleteByIds,
} from "../../../../api/property/charge";
import {
  getRegNameByCode,
  packageDataToMap,
  packageOrgToMap,
  regName,
} from "../../../../utils/area";
import { DICTDATA, getDict, translatorDict } from "../../../../api/dict";
import { queryFactorys } from "../../../../api/system/production";
import { queryModelList } from "../../../../api/system/type";
import { getDetails, queryByConditions } from "../../../../api/property/site";
import singleimageupload from "../../../../components/upload/singleimageupload";
import picTable from "../../../../components/pagetable/picTable";
import {
  searchFactByType,
  searchModel,
} from "@/api/operation/operationSpareStore";
import treeSelect from "../../../../components/treeSelect/treeSelect";

export default {
  data() {
    return {
      restaurants: [], //站点列表
      pageData: {
        total: 0,
        current: 1,
        pageSize: 20,
      },
      regProps: {
        checkStrictly: true,
        label: "name",
        children: "children",
        value: "id",
      },

      auxiliaryForm: {},
      auxiliaryVisible: false,
      rowId: "",
      ammeteType: [],
      simStatus: [],
      searchTypeOption: [],
      searchFactOption: [],
      searchModelOption: [],
      tableEqData: [],
      eqForm: {},
      addFsVisible: false,
      checkModel: [],
      uploadWin: false,
      imagesWin: false,
      update: true,
      imageUrl: "",
      fuzhi: false,
      modifyWin: false,
      form: {
        devName: "",
        devType: "",
        devTypeName: "",
        engSupType: "",
        assetNo: "",
        orgId: "",
        regId: "",
        staId: "",
        parentId: "",
        modelId: "",
        modelName: "",
        factId: "",
        sourceId: "",
        ratePower: "",
        picUrl: "",
        state: "",
        mfdTime: "",
        optTime: "",
        region: "",
        orgName: "",
        staName: "",
        isOrder: "",
      },
      eqRules: {
        attachType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        factId: [
          { required: true, message: "请选择生产厂家", trigger: "blur" },
        ],
        modelId: [
          { required: true, message: "请选择设备型号", trigger: "blur" },
        ],
        attachId: [
          {
            required: true,
            message: "请输入设备标识/SIM卡号",
            trigger: "blur",
          },
        ],
        assertNo: [
          { required: true, message: "请输入资产编号", trigger: "blur" },
        ],
      },
      rules: {
        isOrder: [
          { required: true, message: "请选择有序选项", trigger: "blur" },
        ],

        orgId: [
          { required: true, message: "请选择组织机构", trigger: "change" },
        ],
        devName: [
          { required: true, message: "请输入充电枪名称", trigger: "blur" },
        ],
        devTypeName: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        engSupType: [
          { required: true, message: "请选择能源补给类型", trigger: "change" },
        ],
        assetNo: [
          { required: true, message: "请输入资产编号", trigger: "change" },
        ],
        staId: [
          { required: true, message: "请选择所属站点", trigger: "change" },
        ],
        modelId: [
          { required: true, message: "请选择设备型号", trigger: "change" },
        ],
        factId: [{ required: true, message: "请选择厂家", trigger: "change" }],
        regId: [{ required: true, message: "区域不能为空", trigger: "change" }],
        sourceId: [
          {
            required: true,
            message: "请输入第三方资产编号",
            trigger: "change",
          },
        ],
        ratePower: [
          { required: true, message: "请输入额定功率", trigger: "change" },
        ],
        picUrl: [{ required: true, message: "请选择图片", trigger: "change" }],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        mfdTime: [
          { required: true, message: "请选择出厂日期", trigger: "change" },
        ],
        optTime: [
          { required: true, message: "请选择投运日期", trigger: "change" },
        ],
      },
      sizeForm: {},
      checkValue: "",
      factorys: [],
      modelTypes: [],
      paramsFact: {},
      paramsModel: {},
      uploadWin: false,
      imagesWin: false,
      detailWin: false,
      // input1: "",
      // input2: "",
      tableData: [],
      params: {},
      SelectionArray: [],
      colData: [
        { title: "编号", istrue: true },
        { title: "充电枪名称", istrue: true },
        { title: "所属充电站", istrue: true },
        { title: "所属组织机构", istrue: true },
        { title: "行政区域", istrue: true },
        { title: "状态", istrue: true },
        { title: "生产厂家", istrue: true },
        { title: "设备型号", istrue: true },
        { title: "额定功率", istrue: true },
        { title: "出厂日期", istrue: true },
        { title: "投运日期", istrue: true },
        { title: "资产编号", istrue: true },
        { title: "第三方资产编号", istrue: true },
      ],
      colOptions: [],
      colSelect: [],
      loading: false,
      orgsTree: [],
      orgDefaultProps: {
        value: "id",
        label: "name",
        children: "children",
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
    };
  },
  components: { singleimageupload, picTable, treeSelect },
  created() {
    this.queryList();
    this.queryFactorys(); // 获取厂家
    this.orgsTree = this.$parent.$refs.topform.orgsTree;
    // 备品备件类型下拉框数据 20130
    getDict(DICTDATA.SPARE_SYSTEM).then((res) => {
      this.searchTypeOption = res;
    });
    // SIM卡状态
    getDict(DICTDATA.SIM_STATUS).then((res) => {
      this.simStatus = res;
    });
    // 电表类型
    getDict(DICTDATA.AMMETER_TYPE).then((res) => {
      this.ammeteType = res;
    });
    let _this = this;
    for (let i = 0; i < _this.colData.length; i++) {
      _this.colSelect.push(_this.colData[i].title);
      if (_this.colSelect.length > 6) {
        continue;
      }
      _this.colOptions.push(_this.colData[i].title);
    }
  },
  mounted() {
    let elementResizeDetectorMaker = require("element-resize-detector");
    let tableWidth = document.getElementById("table-wrap");
    let pageWidth = document.getElementById("page-wrap-fixed");
    let erd = elementResizeDetectorMaker();
    erd.listenTo(tableWidth, function (element) {
      pageWidth.style.width = element.offsetWidth + "px";
    });
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
  methods: {
    // 获取组织id
    getValue(value) {
      // console.log(value, "获取组织id");
      this.form.staId = "";
      this.form.regId = "";
      this.form.parentId = "";
      this.form.orgId = value;
      getStationList({ orgId: value }).then((res) => {
        this.restaurants = res.data;
      });
    },
    // 根据站点id获取区域设施信息
    getStaId(id) {
      this.form.staId = id;
      // console.log(id, "站点id");
      getDetails(id).then((res) => {
        this.form.regId = res.data.regId;
        this.$forceUpdate();
      });
    },
    //省市区三联框点击后触发
    handleChange(value) {
      this.form.regId = value[value.length - 1]; //取地区里最后一个值发给后端
    },

    save() {
      // 校验
      this.$refs["eqForm"].validate((valid) => {
        // console.log(valid,"valid");
        console.log(this.eqForm, "eqForm");

        if (valid) {
          addEqInfo(this.eqForm).then((res) => {
            if (res.code !== "000000") {
              this.$message({
                message: res.mesg,
                type: "warning",
              });
            } else {
              this.$message({
                message: "保存成功！",
                type: "success",
              });
              // 重新查询列表
              this.queryByStakeId({ devIds: this.rowId });
              this.addFsVisible = false;
            }
          });
        }
      });
    },
    // 新增
    addFs() {
      this.addFsVisible = true;
    },
    handleClose() {
      this.addFsVisible = false;
      this.eqForm = {};
      this.$refs["eqForm"].resetFields();
    },
    cancel() {
      this.addFsVisible = false;
      this.eqForm = {};
      this.$refs["eqForm"].resetFields();
    },
    /**
     * 根据类型查厂家
     */
    searchFactByType(value) {
      console.log(value, "设备型号");
      this.searchFactOption = [];
      this.searchModelOption = [];
      this.eqForm.factId = "";
      this.eqForm.modelId = "";
      if (this.eqForm.type !== "") {
        searchFactByType({
          factType: value,
          kind: DICTDATA.SPARE_SYSTEM, // 类型
        }).then((res) => {
          this.searchFactOption = res.data;
        });
      }
    },
    /**
     * 根据类型、厂家，查型号
     */
    searchModel() {
      this.searchModelOption = [];
      this.eqForm.modelId = "";

      if (this.eqForm.factId !== "") {
        searchModel({
          devClass: DICTDATA.SPARE_SYSTEM, // 类别
          devMainType: this.eqForm.type, // 类型
          factId: this.eqForm.factId, // 厂家
        }).then((res) => {
          this.searchModelOption = res.data;
        });
      }
    },
    changeModel(e) {
      this.$forceUpdate();
    },
    // 获取表格数据
    queryList(params) {
      this.loading = true;
      queryByPage(params).then((res) => {
        this.loading = false;
        this.tableData = res.data.records;
        this.pageData = {
          total: res.data.total,
          current: res.data.current,
          pageSize: res.data.size,
        };
      });
    },
    // 复选获取值
    handleSelectionChange(val) {
      this.SelectionArray = val;
    },
    // 批量删除
    batchDelete() {
      let SelectionArray = this.SelectionArray;
      if (SelectionArray.length === 0) {
        this.$message({
          message: "请选择要删除的数据！",
          type: "warning",
        });
      } else {
        this.$confirm("确定删除吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let ids = [];
          for (let i in SelectionArray) {
            ids.push(SelectionArray[i].id);
          }

          batchDeleteByIds(ids).then((res) => {
            if (res.code === "000000" && res.data) {
              this.$message({
                showClose: true,
                message: "删除成功！",
                type: "success",
              });
              this.queryByStakeId({ devIds: this.rowId });
            }
          });
        });
      }
    },
    // 附属设备详情
    detail(row) {
      this.auxiliaryVisible = true;
      console.log(row);
      this.auxiliaryForm = JSON.parse(JSON.stringify(row));

      this.auxiliaryForm.attachType = translatorDict(
        DICTDATA.SPARE_SYSTEM,
        Number(row.attachType)
      );

      this.auxiliaryForm.meterType = translatorDict(
        DICTDATA.AMMETER_TYPE,
        Number(row.meterType)
      );
      this.auxiliaryForm.attachState = translatorDict(
        DICTDATA.SIM_STATUS,
        Number(row.attachState)
      );
    },
    // 区域格式化
    regFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        const code = cellValue;
        return getRegNameByCode(code);
      } else {
        return "";
      }
    },
    // 设备类型格式化
    deviceFormart(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.CHARGE_TYPE, cellValue);
      } else {
        return "";
      }
    },
    statusFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, cellValue);
      } else {
        return "";
      }
    },
    // 备品类型格式化
    spareFormart(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_SYSTEM, cellValue);
      } else {
        return "";
      }
    },
    // 电表类型格式化
    ammeteFormart(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.AMMETER_TYPE, cellValue);
      } else {
        return "";
      }
    },
    // 电表类型格式化
    simFormart(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SIM_STATUS, cellValue);
      } else {
        return "";
      }
    },
    // 格式化日期
    dateFormat(row, column) {
      let time = row[column.property];
      let date = new Date(time);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      // let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      // let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return year + "-" + month + "-" + day;
    },

    // 分页点击事件
    handleSizeChange(val) {
      let formInline = this.$parent.$refs.topform.form;
      this.pageData.pageSize = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.queryList(formInline);
    },
    handleCurrentChange(val) {
      let formInline = this.$parent.$refs.topform.form;
      this.pageData.current = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.queryList(formInline);
    },
    refresh() {
      let formInline = this.$parent.$refs.topform.form;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.queryList(formInline);
    },
    // 详情页
    openDetail(row) {
      console.log(row);
      this.rowId = row.id;
      this.eqForm.stakeId = row.id;
      this.queryByStakeId(this.rowId);
      this.detailWin = true;
      this.sizeForm = JSON.parse(JSON.stringify(row));
      this.imageUrl = row.picUrl;
      const code = row.regId;
      packageDataToMap(code);
      this.sizeForm.regId = regName;
      this.sizeForm.devType = translatorDict(
        DICTDATA.CHARGE_TYPE,
        Number(row.devType)
      );
      this.sizeForm.engSupType = translatorDict(
        DICTDATA.ENERGY_SUPPLY_TYPE,
        Number(row.engSupType)
      );

      this.sizeForm.state = translatorDict(
        DICTDATA.INFRASTRUCTURE_STATUS,
        Number(row.state)
      );
      if (row.optTime !== null) {
        this.sizeForm.optTime = row.optTime.substring(0, 10);
      }
      if (row.mfdTime !== null) {
        this.sizeForm.mfdTime = row.mfdTime.substring(0, 10);
      }
    },
    // 修改弹框
    openModifyWin(row) {
      this.modifyWin = true;
      console.log(row.isOrder, "row.isOrder");
      this.form = JSON.parse(JSON.stringify(row));
      this.form.isOrder = row.isOrder.toString();

      if (row.orgId !== null && row.orgId !== undefined) {
        let object = {};
        object.orgId = row.orgId;
        queryByConditions(object).then((res) => {
          this.restaurants = res.data;
        });
      }
      this.form.devTypeName = translatorDict(
        DICTDATA.CHARGE_TYPE,
        this.form.devType
      );
      getDetails(row.staId).then((res) => {
        this.form.staId = res.data.staName;
      });
      if (row.devType !== null) {
        this.paramsFact.kind = 2015;
        this.paramsFact.factType = row.devType;
        queryFactorys(this.paramsFact).then((res) => {
          this.factorys = res.data;
        });
      }
      this.paramsModel.factId = row.factId;
      queryModelList(this.paramsModel).then((res) => {
        this.modelTypes = res.data;
      });
      const code = row.regId;
      packageDataToMap(code);
      this.form.region = regName;
      const orgCode = row.orgId;
      if (orgCode != null) {
        this.form.orgName = packageOrgToMap(orgCode);
      } else {
        this.form.orgName = "";
      }
    },
    // 获取设备类型数据
    getModelTypes() {
      getDict(DICTDATA.CHARGE_TYPE).then((res) => {
        this.deviceTypes = res;
      });
    },
    // 获取厂家
    queryFactorys() {
      queryFactorys({
        kind: 2015,
        factType: 2,
      }).then((res) => {
        this.factorys = res.data;
      });
    },
    changeFactory(value) {
      this.paramsModel.factId = value;
      queryModelList(this.paramsModel).then((res) => {
        this.modelTypes = res.data;
      });
    },
    changeDeviceModel(value) {
      this.form.modelName = value.modelName;
    },
    // 图片选择方式
    chooseImage(value) {
      if (value == "") {
        this.imageUrl = "";
      }
      if (this.checkModel.length !== 0) {
        this.checkModel = [];
      }
      if (this.checkValue === 1) {
        this.uploadWin = true;
      } else {
        this.uploadWin = false;
      }
      if (this.checkValue === 2) {
        this.imagesWin = true;
      } else {
        this.imagesWin = false;
      }
    },
    // 修改确认按钮
    saveForm() {
      // console.log(form)
      this.form.picUrl = this.imageUrl;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.modifyWin = false;
          modifyData(this.form)
            .then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.queryList();
              this.modifyWin = false;
            })
            .catch((res) => {
              this.$message({
                message: "修改失败",
                type: "error",
              });
            });
        }
      });
    },
    // 表格中的删除按钮
    handleDelete(row) {
      const id = row.id;
      this.queryByStakeId(id);
      this.$confirm("确定删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      }).then(() => {
        deleteData(id)
          .then((res) => {
            if (res.code === "000000") {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.queryList();
              // this.$refs.crudForm.getDataInit();
            } else {
              this.$message.error(res.data);
            }
          })
          .catch((err) => {
            this.$message.error("删除失败");
          });
      });

    },
    // 根据id获取附属设备详情
    queryByStakeId(rowId) {
      queryByStakeId(rowId).then((res) => {
        // console.log(res, "附属设备列表");
        this.tableEqData = res.data;
      });
    },

    // 导出数据
    exportAssetStake() {
      // this.queryList(this.$parent.$refs.topform.form);
      this.$parent.$refs.topform.exportAssetStake();
    },

    // 后台排序
    sortChange(column) {
      this.$parent.$refs.topform.form.headers = [];
      this.$parent.$refs.topform.form.values = [];
      let formInline = this.$parent.$refs.topform.form;
      formInline.sortColumn = column.prop;
      if (column.order === "ascending") {
        formInline.order = "asc";
      } else {
        formInline.order = "desc";
      }
      this.queryList(formInline);
    },

    // 格式化日期
    formatDate(data) {
      if (data == null) {
        return "";
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-form--inline .el-form-item {
  white-space: nowrap;
}

#table-wrap {
  margin-bottom: 23px;
  padding: 0 15px 23px;
}

.table-top {
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
}

.table-top-a {
  display: inline-block;
  background-color: #006080;
  text-align: center;
  color: white;
  height: 26px;
  line-height: 26px;
  width: 80px;
  border-radius: 2px;
  margin-top: 5px;
}

// 按钮

.xqyq {
  display: flex;
  margin: 0px 0px 20px 50px;

  .a {
    width: 360px;
  }

  >>> .el-form-item__label {
    color: #909090 !important;
  }

  >>> .el-form-item__content {
    color: #232323;
  }
}

/deep/ #app {
  font-family: "Microsoft YaHei";
}

/deep/ .has-gutter {
  background: #f0f0f0 !important;
}

/deep/ .el-table tr {
  background-color: transparent;
}

img {
  display: inline-block;
  vertical-align: middle;
}

.aniupic {
  width: 140px !important;
  height: 120px !important;
}

.el-upload__tip1 {
  margin-left: 260px;
  margin-top: -47px;
  margin-bottom: 20px;
  color: red;
  font-size: 12px;
  white-space: nowrap;
}
</style>

/* .el-table td, .el-table th.is-leaf */
