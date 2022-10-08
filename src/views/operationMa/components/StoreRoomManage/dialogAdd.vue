<template>
  <div>
    <el-dialog
      title="编辑库房信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="960px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="库房名称" prop="houseName">
              <el-input
                class="txtbox-long"
                clearable
                v-model="form.houseName"
                placeholder="请输入库房名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织机构" prop="orgName">
              <el-input
                id="orgNameTxtbox"
                class="txtbox-long"
                v-model="form.orgName"
                @focus="showOrgTree"
                @clear="clearOrg"
                clearable
              ></el-input>

              <!-- 组织机构树 -->
              <div class="org-tree-wrap" ref="orgUserTree" v-show="visibleOrgTree">
                <el-tree
                  ref="tree"
                  :data="orgTreeData"
                  default-expand-all
                  node-key="id"
                  :expand-on-click-node="false"
                  :props="orgDefaultProps"
                  @node-click="handleNodeClick"
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
          <el-col :span="12">
            <el-form-item label="行政区域" prop="regId">
              <el-cascader
                class="txtbox-long"
                v-model="form.regId"
                size="mini"
                :options="areaTreeData"
                :props="defaultProps"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="地址" prop="addr">
              <el-input class="txtbox-long" clearable v-model="form.addr" placeholder="请输入详细地址">
                <el-button
                  slot="append"
                  @click="showAddGardenMap"
                  icon="el-icon-map-location"
                  placeholder="请输入详细地址"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="link">
              <el-input class="txtbox-long" clearable v-model="form.link" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input class="txtbox-long" clearable v-model="form.tel" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="占地面积(平方米)" prop="area">
              <el-input class="txtbox-long" clearable v-model="form.area" placeholder="请输入占地面积"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-select class="txtbox-long" clearable v-model="form.state" placeholder="请选择状态">
                <el-option value>全部</el-option>
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer">
        <el-button class="btn-long" type="primary" @click="save">确定</el-button>
        <el-button class="btn-long" @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <addGardenMap v-if="sign" @map-confirm="handleMapConfirm" ref="addGardenMap" />
  </div>
</template>

<script>
import { getDict, DICTDATA } from "@/api/dict";
import { getAreaSelectData } from "@/utils/area";
import { add, modify } from "@/api/operation/storeRoomManage";
import { getOrgTree } from "@/api/commonApi";
import addGardenMap from "@/views/property/components/map/addGardenMap";
export default {
  components: { addGardenMap },
  data() {
    return {
      form: {},
      dialogFormVisible: false,
      visibleOrgTree: false,
      status: [],
      areaTreeData: [],
      orgTreeData: [],
      orgDefaultProps: {
        children: "children",
        label: "name"
      },
      defaultProps: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name"
      },
      rules: {
        houseName: [
          { required: true, message: "请输入库房名称", trigger: "change, blur" }
        ],
        orgName: [
          { required: true, message: "请选择组织机构", trigger: "change, blur" }
        ],
        regId: [
          { required: true, message: "请选择行政区域", trigger: "change, blur" }
        ],
        state: [
          { required: true, message: "请选择状态", trigger: "change, blur" }
        ]
      },
      sign: false
    };
  },
  created() {
    // 查询状态下拉框数据
    getDict(DICTDATA.INFRASTRUCTURE_STATUS).then(res => {
      this.status = res;
    });

    // 区域下拉级联选择器所需要的区域数据
    getAreaSelectData().then(res => {
      this.areaTreeData = res;
    });

    var self = this;
    // 点击其他地方隐藏组织机构用户树
    document.addEventListener("click", e => {
      if (
        self.$refs.orgUserTree &&
        !self.$refs.orgUserTree.contains(e.target) &&
        e.target.id != "orgNameTxtbox"
      ) {
        self.visibleOrgTree = false;
      }
    });
  },
  methods: {
    /**
     * 保存
     */
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id && this.form.id !== "") {
            modify(this.form).then(res => {
              if (res.code !== "000000") {
                this.$message({
                  message: res.mesg,
                  type: "warning"
                });
              } else {
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
                this.dialogFormVisible = false;

                // 重新查询列表
                this.$parent.$refs.crudForm.getDataInit();
              }
            });
          } else {
            add(this.form).then(res => {
              if (res.code !== "000000") {
                this.$message({
                  message: res.mesg,
                  type: "warning"
                });
              } else {
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
                this.dialogFormVisible = false;

                // 重新查询列表
                this.$parent.$refs.crudForm.getDataInit();
              }
            });
          }
        }
      });
    },
    /**
     * 取消
     */
    cancel() {},
    // 地址地图
    showAddGardenMap() {
      this.sign = true;
      this.$refs.addGardenMap.open({
        lng: 118.77807441,
        lat: 32.0572355
      });
    },
    //地图选点确定处理
    handleMapConfirm(addres) {
      this.form.addr = addres.Pkeyword;
      this.form.lng = addres.lng;
      this.form.lat = addres.lat;
    },
    /**
     * 区域选择后
     */
    handleChange(value) {
      this.form.regId = value[value.length - 1];
    },
    /**
     * 获取组织机构树接口调用
     * 该接口的参数未确定，目前无参，获取所有组织机构，后面考虑数据权限时再确定参数
     */
    getOrgTree() {
      if (this.orgTreeData && this.orgTreeData.length < 1) {
        getOrgTree().then(res => {
          this.orgTreeData = res.data;
        });
      }
    },
    /**
     * 选择组织机构文本框聚焦
     */
    showOrgTree() {
      this.visibleOrgTree = true;
      // 获取组织机构树接口调用
      this.getOrgTree();
    },
    /**
     * 组织机构树选中
     */
    handleNodeClick(item) {
      this.form.orgName = item.name;
      this.form.orgId = item.id;
      this.visibleOrgTree = false;
    },
    /**
     * 清空组织机构信息
     */
    clearOrg() {
      this.form.orgName = "";
      this.form.orgId = "";
    },
    //地图选点确定处理
    handleMapConfirm(addres) {
      this.form.addr = addres.Pkeyword;
      this.form.lng = addres.lng;
      this.form.lat = addres.lat;
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

.push {
  color: #fff;
  background: #006080;
  width: 120px;
}


.m-b-10 {
  margin-bottom: 10px;
}

.input-width {
  width: 180px;
}
</style>
