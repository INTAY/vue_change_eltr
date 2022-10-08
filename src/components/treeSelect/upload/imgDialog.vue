<template>
  <div>
    <div>
      <el-select size="mini" class="kz" clearable @change="chooseImage" v-model="checkValue">
        <el-option v-for="item in picUploadType"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value"/>
      </el-select>
      <el-image class="kz aniupic" :src="imageUrl"
                style="margin-top:2%;width: 200px; height: 180px;  border-radius:5px 5px 5px;">
      </el-image>
    </div>
    <!-- 图片本地上传 -->
    <div>
      <el-dialog title="图片本地上传" append-to-body top="30vh" :modal="true"
                 :visible.sync="uploadWin"
                 width="880px"
                 class="dialogClass">
        <singleimageupload ref="singleimageupload"/>
      </el-dialog>
    </div>
    <!-- 图片列表选取 -->
    <div>
      <el-dialog title="图片列表" append-to-body top="10vh" :modal="true"
                 :visible.sync="imagesWin"
                 width="880px"
                 class="dialogClass">
        <picTable ref="picTable"/>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import imgUrl from "../../assets/image/from图片.png"
  import picTable from "../../components/pagetable/picTable";
  import singleimageupload from "../../components/upload/singleimageupload";

  export default {
    name: "imgDialog",
    data() {
      return {
        imageUrl: imgUrl,
        checkValue: "",
        picUploadType: [
          {
            value: 1,
            name: "图片本地上传"
          },
          {
            value: 2,
            name: "图片库选择"
          }
        ],
        checkModel: [],
        uploadWin: false,
        imagesWin: false,
        changeV: null,
      }
    },
    components: {
      picTable, singleimageupload
    },
    mounted() {
    },
    methods: {
      // 图片选择方式
      chooseImage() {
        this.fileList = [];
        if (this.checkModel.length != 0) {
          this.checkModel = [];
        }
        if (this.checkValue == 1) {
          this.uploadWin = true;
        } else {
          this.uploadWin = false;
        }
        if (this.checkValue == 2) {
          this.imagesWin = true;
        } else {
          this.imagesWin = false;
        }
      },
    }
  }
</script>

<style scoped>
  .kz {
    width: 260px;
  }
  .aniupic {
  width: 140px !important;
  height: 120px !important;
}

</style>
