<template>
  <div class="box">
    <el-dialog title="订单信息" :visible.sync="dialogVisible" width="70%" :before-close="handleClose" :modal-append-to-body="false">
        <el-form ref="form" :model="formInline"  label-width="150px" size="small" class="xy">
        <el-row class="mar-btn10">
          <el-col :span="12">
            <el-form-item label="区县" prop="name">
              <el-select v-model="formInline.regionName" disabled="disabled" class="width-240" style="width: 300px;">
                <el-option label="全部" value></el-option>
                <el-option  v-for="item in searchTypeOption"  :key="item.value"  :label="item.name"  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充电站点">
              <el-select v-model="formInline.stationName" disabled="disabled" class="width-240" style="width: 300px;" >                
                <el-option label="全部" value></el-option>
                <el-option  v-for="item in searchTypeOption"  :key="item.value"  :label="item.name"  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-btn10">
          <el-col :span="12">
            <el-form-item label="充电桩编号">
              <el-input v-model="formInline.stakeNo" disabled="disabled" class="width-240" style="width: 300px;" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充电枪编号">
              <el-input v-model="formInline.gunNo" disabled="disabled" class="width-240" style="width: 300px;" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-btn10">
          <el-col :span="12">
            <el-form-item label="车联网ID">
              <el-input class="width-240" disabled="disabled" v-model="formInline.orderId" style="width: 300px;" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充电类型">
              <el-select v-model="formInline.orderConsumeTypeName" disabled="disabled" class="width-240" style="width: 300px;" >
                <el-option  v-for="item in searchStatusOption"  :key="item.value"  :label="item.name"  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-btn10">
          <el-col :span="12">
            <el-form-item label="充电开始时间">
              <el-date-picker  type="datetime" :picker-options="pickerOptions0"  v-model="formInline.startTime" class="width-240"  placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充电结束时间">
              <el-date-picker  type="datetime" :picker-options="pickerOptions0"  v-model="formInline.endTime" class="width-240" style="width: 300px;" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-btn10 mar-btn100">
          <el-col :span="12">
            <el-form-item label="充电开始一致">
              <el-input class="width-240" disabled="disabled" v-model="formInline.isStatusStartTimeSame" style="width: 300px;" ></el-input>

              <!-- <el-select size="mini" class="inputWidth" style="width: 300px;" disabled="disabled" v-model="formInline.isStatusStartTimeSame" clearable>
                <el-option v-for="item in isYes"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label">
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充电结束一致">
              <el-input class="width-240" disabled="disabled" v-model="formInline.isStatusEndTimeSame" style="width: 300px;" ></el-input>

              <!-- <el-select size="mini" class="inputWidth" style="width: 300px;" disabled="disabled" v-model="formInline.isStatusEndTimeSame" clearable>
                <el-option v-for="item in isYes"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label">
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-btn10">
          <el-col :span="12">
            <el-form-item label="交易电量（度）">
              <el-input  class="width-620"  type="text" style="width: 300px;"  v-model="formInline.totalElecty"  :rows="2" placeholder="请输入内容" @change="minOrMax(formInline.totalElecty)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交易服务费（元）">
              <el-input  class="width-620"  type="text" style="width: 300px;"  v-model="formInline.serviceAmount"  :rows="2"  placeholder="请输入内容" @change="minOrMax(formInline.serviceAmount)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-btn10">
          <el-col :span="12">
            <el-form-item label="交易金额（元）">
              <el-input  class="width-620"  type="text" style="width: 300px;"  v-model="formInline.amount"  :rows="2" placeholder="请输入内容" @change="minOrMax(formInline.amount)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="（前置模块）采集时间">
              <el-date-picker  class="width-240"  type="date" style="width: 300px;" disabled="disabled" value-format="yyyy-MM-dd"  v-model="formInline.acceptTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-btn10">
          <el-col :span="24">
            <el-form-item label="（省级应用）接收时间" label-width="150px">
              <el-date-picker  class="width-240"  type="date" style="width: 300px;" disabled="disabled" value-format="yyyy-MM-dd"  v-model="formInline.receiveTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="nn">
        <el-button class="bouncedHold btnSpace editorBTN"  @click="submit" size="small">推送</el-button>
        <el-button class="cancelBTN editorBTN" size="small"  @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import {isYes,editRecAdd } from "@/api/platform/generalOverview";
    import moment from "moment";

    export default {
        data() {
            return {
              pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
                    }
                }, 
              dialogVisible: false,
              formInline: {},
              rules: [],
              isYes: isYes,
              searchTypeOption: [],
              searchStatusOption: []
            }
        },
        methods: {
          minOrMax(params){
            if(params<0) {
              params = ''
            }
          },
          checktime(beginTime,endTime){ 
            if(beginTime==""){
              alert("请输入申请挂起开始时间");   
			        return false;  
            }
            if(endTime==""){
               alert("请输入申请解挂时间");   
			          return false; 
            }
            var beginTimes=beginTime.substring(0,10).split('-'); 
            var endTimes=endTime.substring(0,10).split('-'); 

            beginTime=beginTimes[1]+'-'+beginTimes[2]+'-'+beginTimes[0]+' '+beginTime.substring(10,19); 
            endTime=endTimes[1]+'-'+endTimes[2]+'-'+endTimes[0]+' '+endTime.substring(10,19); 

			      var a =(Date.parse(endTime)-Date.parse(beginTime))/3600/1000; 

            if(a<0){ 
            return false; 
            }else if (a>0){ 
            return true; 
            }else if (a==0){ 
            return true; 
            }else{ 
            return false; 
            } 

			    },
          submit() {
            let params = {
              orderId: this.formInline.orderId,
              startTime: moment(this.formInline.startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment(this.formInline.endTime).format('YYYY-MM-DD HH:mm:ss'),
              totalElecty: this.formInline.totalElecty,
              serviceAmount: this.formInline.serviceAmount,
              amount: this.formInline.amount,
            }
            if(!this.checktime(params.startTime,params.endTime)) {
              this.$message.warning('充电开始时间不能大于结束时间！')
              return
            }
            if(params.totalElecty < 0 || params.serviceAmount < 0 || params.amount < 0) {
              this.$message.warning('交易电量、交易服务费和交易金额不能小于0 ！')
              return
            }
            editRecAdd(params).then(res=>{
              if(res.code === '000000') {
                this.$message({
                  message: '订单修改成功',
                  type: 'success'
                });
                this.dialogVisible = false
                //  修改后更新列表
                this.$parent.getData(this.$parent.formInline,false)
              }
            }).catch(err=>{
              this.$message.error('订单修改失败'+err);
            })
          },
          cancel() {
                this.dialogVisible = false
          },
          handleClose(){
            this.dialogVisible = false
          }
        }
    };
</script>
<style lang="scss" scope>
  .box {
    .xy{
      padding: 0 20px;
    }
    .bg1 {
      background-color: rgb(247, 247, 247);
      padding: 10px;
    }
    .bg2 {
      background-color: rgb(235, 235, 235);
      padding: 10px;
    }
    .nn {
      display: flex;
      justify-content: center;
      margin: 30px 0 10px 0;
      .btn-long {
        width: 120px;
      }
    }
    .mar-btn10 {
      margin-bottom: 10px;
    }
  }
 .mar-btn100 .el-form-item__label{
   line-height: 18px;
 }
</style>
