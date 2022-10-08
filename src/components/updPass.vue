<template>
	<div id="_user_pass_">
		<el-dialog id="content_dialog_" width="550px" :close-on-click-modal="false" 
			:before-close="handleClose"
			:modal-append-to-body='false' :visible.sync="visible" center="center">
			<h2 style="margin-bottom: 18px; font-size: 14px; color: darksalmon;text-align: center;">
				您已长时间未修改密码或密码为初始密码，为了您的账号安全，请务必修改密码
			</h2>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class ="demo-ruleForm">
				<el-form-item label="原密码" prop="oldPass" class="form_item">
					<el-input style="width: 300px;" clearable type="password" v-model="ruleForm.oldPass" show-password>
					</el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="pass" class="form_item">
					<el-input style="width: 300px;" clearable :type="!passWordArr[1]?'password':'text'" v-model="ruleForm.pass" show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass" class="form_item">
					<el-input style="width: 300px;" clearable :type="!passWordArr[2]?'password':'text'" v-model="ruleForm.checkPass" show-password></el-input>
				</el-form-item>
				<el-form-item style="position: relative;left: -50px;" class="form_item">
					<el-button size="mini" style="width: 160px;" type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<!--<el-button size="mini" style="width: 160px;margin-left: 10px;" @click="resetForm('ruleForm')">重置</el-button>-->
					<el-button size="mini" style="width: 160px;margin-left: 10px;" @click="cancel()">退出登录</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

	</div>
</template>

<script>
	import axios from "axios";
	import JSEncrypt from "jsencrypt";
	// import JSEncrypt from "@/utils/jsencrypt.min.js";
	import request from "@/api/request";
import { updatePassword } from "@/api/menu.js";
	export default {
		data() {
			var validatePass0 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入原密码'));
				}
//				else if(value != ''){
//					callback(new Error('原密码输入错误'));
//				}
				else {
					callback();
				}
			};
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} 
				else {
					const reg = /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/;
			          if (reg.test(value)) {
			            callback()
			          } else {
			            return callback(new Error('至少8个字符，大小写字母、数字和特殊符号至少存在三种'))
			          }
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				visible:false,
				admin: JSON.parse(sessionStorage.getItem('user')),
				passWordArr:[],
				ruleForm: {
					pass: '',
					checkPass: '',
					oldPass: ''
				},
				rules: {
					oldPass: [{
						required: true,
						validator: validatePass0,
						trigger: 'blur'
					}],
					pass: [{
						 required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						 required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
					
				}
			}
		},
		created(){
//			this.admin = this.$parent.user;
		},
		methods: {
			handleClose(done) {
				return false;
//		        this.$confirm('确认退出修改密码？')
//		          .then(_ => {
//		            this.$router.push('/login')
//		          })
//		          .catch(_ => {});
		     },
			getPublicKey() {
		      return axios({
		        url: request.adornUrl(`/authentication/auth/publickey`),
		        method: "GET",
		      });
		    },
			submitForm(formName) {
				
				this.$refs[formName].validate( async(valid) => {
					if(valid) {
						const { data: res } = await this.getPublicKey();
						if (res.code === "000000") {
							var publickey = res.data;
							var encrypt = new JSEncrypt()
							encrypt.setPublicKey(publickey);
							let forms = {}
							forms.userId = this.admin.id;
							forms.password = encrypt.encrypt(this.ruleForm.oldPass)
							forms.newPassword = encrypt.encrypt(this.ruleForm.pass)
							updatePassword(forms).then(res=>{
								if(res.code == "000000"){
									this.$message({
						            	type: "success",
						            	message: "修改密码成功,请重新登录",
						            });
						            let this_ = this;
						            setTimeout(function(){
						            	this_.visible = false;
							            this_.$router.push('/login');
							            window.location.reload(true);
						            },500)
								}else{
									this.$message({
						              type: "error",
						              message: `${res.data}`,
						            });
						            this.$refs[formName].resetFields();
//						            window.location.reload(true);
								}
							})
						}
					} else {
						this.$message({
			            type: "error",
			            message: "操作存在错误",
			          });
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			cancel(){
				this.$router.push('/login')
				window.location.reload(true);
			}
		}

	}
</script>

<style lang="scss">
	#_user_pass_{
		/*淦*/
		.el-dialog__title {
			background: none;
		}
		
		#content_dialog_ {
			padding-top: 20px;
			.el-dialog__header {
				padding: 0;
				display: none;
			}
			.el-dialog__body {
				padding: 20px 30px 5px 30px;
			}
			.form_item{
				padding-bottom: 18px;
			}
		}
		
	}
	
</style>