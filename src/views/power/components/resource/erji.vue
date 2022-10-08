<template>
  <div class="table-top-button">
    <el-button @click="handleAddButClick" class="newButtonColor btnSpace listBTN">新增资源</el-button>
    <el-button @click="removeRes" class="BatchDeleteColor listBTN">批量删除</el-button>
  </div>
</template>
<script>
  import {piliangDelete } from "@/api/power/resource";

  export default {
    data() {
      return {
        removeButDisabled: true,
        delResIds: []
      };
    },
    components: {  },
    created() {},
    methods: {
      handleAddButClick(){
        this.$parent.$parent.$parent.handleAddButClick(null,null);
      },
      removeRes() {
      	if(this.$parent.$parent.$parent.$refs.biaoge.SelectionArray.length==0){
	        this.$message.info("请先选中删除的资源")
	        return
	      }
      	this.$confirm('确定要删除吗?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "messagebox-button",
          cancelButtonClass: "messagebox-button"
        }).then(() => {
          piliangDelete(this.delResIds).then(res => {
	          if("000000"==res.code){
	            this.$message('删除成功');
				this.$parent.$parent.$parent.$refs.tree.rest();
	            this.$parent.$parent.$parent.queryTableData(this.$parent.$parent.$parent.searchName,null);
	          }else{
	            this.$message.error(res.mesg);
	          }
	        });
        });
      }
    }
  };
</script>
