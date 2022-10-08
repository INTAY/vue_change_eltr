<template>
  <el-dialog
    :title="!dataForm.id ? '新增资源' : '修改资源'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :modal-append-to-body="false"
    width="760px"
    @open="submitButtonDisabled = false">
    <el-form
    	style="margin: 0px 27px 0px 25px"
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      :inline="false"
      label-width="100px">

      <el-form-item label="资源名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="资源名称"></el-input>
      </el-form-item>

      <el-form-item label="资源CODE" prop="code">
        <el-input v-model="dataForm.code" placeholder="资源CODE"></el-input>
      </el-form-item>

      <el-row>
        <el-col :span="8">
          <el-form-item label="资源类型" prop="type">
            <el-select v-model="dataForm.type" placeholder="请选择" @change="selcetChange">
              <el-option
                v-for="item in resTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item v-if="dataForm.type==3" label="资源方法" prop="method">
            <el-select v-model="dataForm.method" placeholder="请选择资源方法">
              <el-option
                v-for="item in httpMethod"
                :key="item.id"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
        	<el-form-item label="是否App资源" prop="method">
            <el-select v-model="dataForm.isApp" placeholder="请选择资源方法">
              <el-option
                label="是"
                :value='1'>
                </el-option>
              <el-option
                label="否"
                :value='0'>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="资源路径" prop="url" v-if="dataForm.type!=1 ? true:false">
        <el-input v-model="dataForm.url" placeholder="资源路径"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="" v-else>
        <el-input v-model="dataForm.url" placeholder="资源路径"></el-input>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否有效" prop="valid">
            <el-radio-group v-model="dataForm.valid">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="dataForm.type==3 ? true:false">
          <el-form-item label="是否公有" prop="pub">
            <el-radio-group v-model="dataForm.pub">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="dataForm.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" style="position: relative;top: -17px;">
      <el-button type="primary" :disabled="submitButtonDisabled" @click="dataFormSubmit()">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { add,xiuGai,getResTree } from "@/api/power/resource";
  import { findTreeId } from "@/utils/validate";
  //import bus from "@components/bus"

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          
        },
        resTypes: [],
        submitButtonDisabled:false,
        dataRule: {
          name: [
            { required: true, message: '资源名称不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '资源路径不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: 'code不能为空', trigger: 'blur' }
          ]
        },
        treeData:[],
        httpMethod: [
          {id:1,value:"get"},
          {id:2,value:"post"},
          {id:3,value:"delete"},
          {id:4,value:"put"}
        ]
      }
    },
    props:[],
    components: {
    },
    created () {
    	getResTree().then(res=>{
    		this.treeData = res.data;
    	})
    },
    methods: {
      init (data=null,parentId=null,addtype=null) {
        this.resTypes = this.$parent.$parent.resTypes;
        if(data!=null){
          //修改
          this.dataForm = data;
        }else{
          //新增
          this.dataForm = {
          	method:"",
          	valid:true,
          	pub:""
          }
          //指定了新增资源的parentId
          if(parentId!=null){
            this.dataForm.parentId = parentId;
          }else{
            //没有指定parentId则使用选中的树资源ID
            this.dataForm.parentId = this.$parent.$parent.parentId;
          }
          this.dataForm.orderNum = this.$parent.$parent.$refs.biaoge.total+1;
          //树没有选中，添加类型默认模块，选中默认页面
          if(this.dataForm.parentId == "-1"){
            this.dataForm.type = 1;
          }else{
            if(addtype!=null){
              this.dataForm.type = addtype;
            }else{
              this.dataForm.type = 2;
            }
            if(addtype===3){
              this.dataForm.pub = false;
              this.dataForm.method = "get";
            }
          }
        }

        this.visible = true;
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          	this.submitButtonDisabled = true;
            //表单公共部分，模块
            var entity = {
              name: this.dataForm.name,
              description: this.dataForm.description,
              parentId: this.dataForm.parentId,
              type: this.dataForm.type,
              code: this.dataForm.code,
              orderNum: this.dataForm.orderNum,
              valid: this.dataForm.valid,
              isApp: this.dataForm.isApp,
            };
            //页面
            if(this.dataForm.type==2){
              entity.url = this.dataForm.url;
            }else if(this.dataForm.type==3){//按钮
              entity.pub = this.dataForm.pub;
              entity.method = this.dataForm.method;
              entity.url = this.dataForm.url;
            }

            if(this.dataForm.id){
              entity.id = this.dataForm.id;
              this.updateAction(entity);
            }else{
              this.addAction(entity);
            }
          }
        })
      },
      updateAction(entity){
        xiuGai(entity).then(res => {
          if("000000"==res.code){
            this.$message.success("修改成功");
            this.submitButtonDisabled = true;
            this.visible = false;
//          this.$parent.$parent.$refs.tree.treeKey = + new Date();
            this.$parent.$parent.$refs.tree.rest()
            this.$parent.$parent.queryTableData(null,null);
          }else{
          	this.submitButtonDisabled = false;
            this.$message.error(res.data);
          }
        });
      },
      addAction(entity){
        add(entity).then(res => {
          if("000000"==res.code){
            this.$message.success("添加成功");
            this.submitButtonDisabled = true;
//          this.$parent.$parent.$refs.tree.treeKey = + new Date();
			this.$parent.$parent.$refs.tree.rest()
            this.visible = false;
            this.$emit("addsuccess");
          }else{
          	this.submitButtonDisabled = false;
            this.$message.error(res.data);
          }
        });
      },
      selcetChange(value){
      	this.dataForm.url = ""
        this.$forceUpdate()
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
