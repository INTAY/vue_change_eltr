<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    @open="submitButtonDisabled = false"
    :close-on-click-modal="false" :modal-append-to-body='false'
    width="560px">
    <el-form
      ref="dataForm"
      :inline="false"
      label-width="90px"
      size="mini">

      <el-form-item label="角色：" prop="roleId">
        <el-select v-model="value" placeholder="请选择角色" style="width: 378px;">
          <el-option
            v-for="item in roleData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer" style="position: relative;top: -18px;">
      <el-button size="mini" :disabled="submitButtonDisabled" style="margin-left: 25px;margin-right: 8px;" class="bouncedHold" @click="dataFormSubmit()">确定</el-button>
      <el-button size="mini" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { roleAssign } from "@/api/power/user"

  export default {
    data () {
      return {
      	title:"角色分配",
        visible: false,
        submitButtonDisabled:false,
        value:'',
        dataForm:[],
        roleData: []
      }
    },
    created(){
    },
    mounted() {

    },
    methods: {
      init (data=null,roleData=null) {
      	this.value = ""
        this.visible = true;
        this.dataForm = data;
        this.roleData = roleData;
      },
      dataFormSubmit(){
      	if(!this.value){
      		this.$message({
		          message: '未选择角色',
		          type: 'warning'
		        })
      		return false;
      	}
      	this.dataForm.forEach(item=>{
		    roleAssign(item,this.value).then(res => {
	          if("000000"==res.code){
	          	this.$message({
		          message: '操作成功',
		          type: 'success'
		        })
	          	this.submitButtonDisabled = true;
	          	this.$parent.$parent.getTableData()
	            this.visible = false;
	          }else{
	          	this.submitButtonDisabled = false;
	            this.$message.error(res.mesg);
	          }
	        })
	    })
        
        
      }
    }
  }
</script>

<style type="text/css">
	
</style>