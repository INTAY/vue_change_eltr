<template>       
   <div class="protr">
        <el-dialog
          title="特巡任务详情"
          :visible.sync="dialogFormVisible"
          top="8%"
          width="950px"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
        >
        <div style="padding: 0 20px;">
	    	<tasksCom ref="tasksCom"/>
        </div>
        
        <span slot="footer">
	      <!--<el-button type="primary" :disabled="submitButtonDisabled" @click="dataFormSubmit()">确定</el-button>-->
	      <el-button size="mini" class="bouncedHold editorBTN btnSpace" @click="">撤回</el-button>
	      <el-button size="mini" class="bouncedHold editorBTN btnSpace" @click="">派发</el-button>
	      <el-button @click="dialogFormVisible = false">取消</el-button>
	    </span>
	    
        </el-dialog>
  </div>
</template>

<script>
	import tasksCom from "./tasksCom.vue";
export default {
  data() {
    return {
    	activities: [
    	{id:'1',time:'1111111111'},
    	{id:'2',time:'1111111111'},
    	],
    	datas:{name:'1111111111111'},
    	dialogFormVisible:false,
    	activeName: 'first',
    	checkAll: false,
        checkedCities: ['img1',],
        cities: ['img1', 'img2', 'img3',],
        isIndeterminate: true

    };
  },
  components: {
    tasksCom
  },
  created() {
    
  },

  methods: {
	  
  },
};
</script>