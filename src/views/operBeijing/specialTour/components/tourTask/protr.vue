<template>       
   <div class="protr_">
   		<update ref="update"/>
        <el-dialog
          title="特巡任务详情"
          :visible.sync="dialogFormVisible"
          top="8%"
          width="1000px"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
        >
        <div style="padding: 0 20px;">
	    	<tasksCom ref="tasksCom"/>
        </div>
        
        <span slot="footer">
	      <!--<el-button type="primary" :disabled="submitButtonDisabled" @click="dataFormSubmit()">确定</el-button>-->
	      <el-button v-if="sign==1" size="mini" class="bouncedHold editorBTN btnSpace" @click="back_">撤回</el-button>
	      <el-button v-if="sign==2 || sign == 3" size="mini" class="bouncedHold editorBTN btnSpace" @click="save">派发</el-button>
	      <el-button v-if="sign==2" size="mini" class="bouncedHold editorBTN btnSpace" @click="update">修改</el-button>
	      <el-button v-if="sign==2" @click="del">删除</el-button>
	      <el-button @click="dialogFormVisible = false">取消</el-button>
	    </span>
	    
        </el-dialog>
  </div>
</template>

<script>
	import tasksCom from "./tasksCom.vue";
	import update from "./update.vue";
	import { cancel,reDispatch,revert,directDispatch } from '@/api/operation/flawAfault';
export default {
  data() {
    return {
    	dialogFormVisible:false,
    	states:'',
    	ids:'',
    	sign:'1',
    	checks:[],
    	datas:{},
    };
  },
  components: {
    tasksCom,update
  },
  created() {
    
  },
  methods: {
  	//重新派发
  	save(){
  		directDispatch(this.ids).then(res=>{
  			if (res.code=="000000") {
  				this.$message.success(`成功派发`);
  				this.$parent.$refs.crudForm.getDataInit()
  			}else{
  				this.$message.error(`${res.data}`);
  			}
  		})
  		this.dialogFormVisible = false;
  	},
  	//撤回
	  back_(){
	  	revert(this.ids).then(res=>{
			if (res.code=="000000") {
				this.$message.success(`撤回成功`);
				this.$parent.$refs.crudForm.getDataInit()
  				this.sign = 2;
			}else{
				this.$message.error(`${res.data}`);
			}
		})
//		this.dialogFormVisible = false;
	  },
	  //修改
	  update(){
	  	this.$refs.update.addDialogFormVisible(this.ids);
	  	this.$refs.update.checkList = this.checks;
	  	
	  },
	  //删除
	  del(){
	  	this.$confirm('确定要删除吗?', '', {
	      	cancelButtonText: '取消',
	        confirmButtonText: '确定',
	        type: 'warning', 
	        confirmButtonClass: "messagebox-button",
	        cancelButtonClass: "messagebox-button"
	      }).then(() => {
	        cancel(this.ids).then(res=>{
	  			if (res.code=="000000") {
	  				this.$message.success(`作废成功`);
	  				this.$parent.$refs.crudForm.getDataInit()
	  			}else{
	  				this.$message.error(`${res.data}`);
	  			}
	  		})
	      }).catch(() => {
	
	      });
	  	this.dialogFormVisible = false;
	  	
	  },
	  
  },
};
</script>