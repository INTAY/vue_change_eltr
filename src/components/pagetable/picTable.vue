<template>
  <div>
    <el-form :inline="true" :model="form">
      <el-form-item label="图片分类" class="a">
        <el-select size="mini" v-model="form.fileType" placeholder="全部" class="tpk" height="29px">
          <el-option
            v-for="item in picTypes"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片名称" class="a">
        <el-input v-model="form.name" size="mini" placeholder="请输入图片名称" />
      </el-form-item>
      <el-button size="mini" style="width: 100px;" class="bouncedHold" @click="queryFormData">查 询</el-button>
      <el-button size="mini" style="width: 100px" class="xan1" plain @click="clearForm">清 空</el-button>
      <div class="tup">
        <div class="block" style="position: relative;" v-for="item in picFiles" :key="item.id">
          <div class="demo-image__preview">
            <el-checkbox-group v-model="checkModel">
              <el-checkbox-button :key="item.id" :label="item">
                <el-image
                  style="width: 95px; height: 80px;  border-radius:5px 5px 5px; "
                  :src="item.url"
                  :aria-checked="true"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="pageStyle" style="z-index=999">
          <div class="fenye">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              class="tablePagination"
            />
            <div class="sx">
              <el-button
                size="mini"
                style="width: 50px;height: 25px;margin-top: 6%"
                @click="freshen"
              >刷新</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="nn">
        <el-button size="small" style="width: 150px" @click="confirmCheckValue" class="bouncedHold  editorBTN btnSpace">确 定</el-button>
        <el-button size="small" style="width: 150px" plain @click="cancleWin" class="cancelBTN  editorBTN">取 消</el-button>
      </div>
    </el-form>
  </div>
</template>


<script>
import { queryData } from "../../api/system/picture";
import { DICTDATA, getDict } from "../../api/dict";

export default {
  name: "picTable",
  data() {
    return {
      form: {},
      picTypes: [],
      picFiles: [],
      checkModel: [],
      currentPage: 1,
      pageSize: 20,
      total: 40,
      picId: "",
      imageUrl: ""
    };
  },
  created() {
    this.queryData();
    this.getPicTypes();
  },
  methods: {
    // 获取图片类型
    getPicTypes() {
      getDict(DICTDATA.PICTURE_TYPE).then(res => {
        for (let i = 0; i < res.length; i++) {
          this.picTypes.push(res[i]);
        }
      });
    },
    // 查询按钮调取方法
    queryFormData() {
      this.queryData(this.form);
    },
    // 清空查询
    clearForm() {
      this.form = {};
      this.queryData();
    },
    queryData(data) {
      queryData(data)
        .then(res => {
          this.picFiles = res.data.records;
          this.pageSize = res.data.size;
          this.currentPage = res.data.current;
          this.total = res.data.total;
        })
        .catch(err => {
          this.$message.error("查询失败");
        });
    },
    // 分页点击事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.form.size = this.pageSize;
      this.form.current = 1;
      this.queryData(this.form); //点击选择每页显示多少数据就会发送size，让页面显示多少条，并且默认第一个页面
    },
    handleCurrentChange(val) {
      this.form.size = this.pageSize;
      this.form.current = val;
      this.queryData(this.form); //点击第几页就会发送要显示的页数过去
    },
    freshen() {
      this.queryData();
    },
    confirmCheckValue() {
      if (this.checkModel.length > 1) {
        this.$message.error("每次只能选择一条图片数据!");
        return false;
      }
      if (this.checkModel.length === 0) {
        this.$message.error("请选择一张图片!");
        return false;
      }
      this.imageUrl = this.checkModel[0].url;
      this.$parent.$parent.imageUrl = this.checkModel[0].url;
      this.picId = this.checkModel[0].id;
      this.checkModel = [];
      this.$parent.$parent.imagesWin = false;
    },
    cancleWin() {
      this.checkModel = [];
      this.$parent.$parent.imagesWin = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.a {
  padding-left: 10px;
}

.ntd {
  color: white !important;
  background: #006080 !important;
  width: 150px;
  margin-right: 20px;
}

.dialogClass {
  height: 1000px;
  left: 125px;
}

//分页器
.pageStyle {
  width: 100%;
  background-color: #f7f7f7;
  bottom: 10px;
  margin-bottom: 2%;
}

.fenye {
  margin-left: 10%;
  display: flex;
}

.demo-image__preview {
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 5px 5px 5px;
  margin-left: 3%;
}

.nn {
  margin-left: 30%;
}

.tup {
  display: flex;
  flex-wrap: wrap;
}

.block {
  width: 188px;
  display: flex;
  flex-wrap: wrap;
  /*margin: 20px 20px 20px 20px;*/
}

.xan {
  color: white !important;
  background: #006080 !important;
  width: 65px !important;
  height: 30px;
  margin-top: 3px;
}
.xan1 {
  width: 65px !important;
  height: 30px;
}

.zxan {
  color: #006080 !important;
  height: 30px;
  margin-top: 5px;
}
</style>
