<template>
	<div id="user_pass_">
		<el-dialog v-if="sign == 1" id="content_dialog" width="500px" :close-on-click-modal="false" :modal-append-to-body='false' :visible.sync="visible" center="center">
			<div class="per_con">
				<h2>个人中心</h2>
				<p class="img_wrap_">
					<img src="../assets/image/img.png" width="70" height="70" alt="默认头像">
				</p>
				<p class="img_wrap_">
					<span style="margin-right: 5px;color: gainsboro;">账号</span> {{admin.username}}
					<el-button size="mini" style="margin-bottom: 10px;padding: 2px 5px;font-size: 12px;" type="primary" @click="changePswd">修改密码</el-button>
				</p>
				<div class="per_info">
					<dl>
						<dt>{{admin.username}}</dt>
						<dd>姓名</dd>
					</dl>
					<dl>
						<dt>{{admin.mobile}}</dt>
						<dd>手机号码</dd>
					</dl>
					<dl>
						<dt>{{admin.mail}}</dt>
						<dd>邮箱</dd>
					</dl>
				</div>
			</div>
		</el-dialog>

		<el-dialog id="content_dialog2" v-if="sign == 2" width="500px" :close-on-click-modal="false" :modal-append-to-body='false' :visible.sync="visible" center="center">
			<h2>修改密码</h2>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class ="demo-ruleForm">
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
					<el-button size="mini" style="width: 160px;margin-left: 10px;" @click="resetForm('ruleForm')">重置</el-button>
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
				sign:1,
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
			getPublicKey() {
		      return axios({
		        url: request.adornUrl(`/authentication/auth/publickey`),
		        method: "GET",
		      });
		    },
			changePswd() {
				this.sign = 2;
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
					            	message: "修改密码成功",
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
			}
		}

	}
</script>

<style lang="scss">
	#user_pass_{
		/*淦*/
		.el-dialog__title {
			background: none;
		}
		
		#content_dialog2 {
			.el-dialog__header {
				padding: 0;
				background-image: url('../assets/image/bg2.png') !important;
			}
			.el-dialog__body {
				padding: 5px 30px;
			}
			.form_item{
				padding-bottom: 10px;
			}
		}
		
		#content_dialog {
			.el-dialog__header {
				padding: 0;
				background-image: url('../assets/image/bg2.png') !important;
			}
			.el-dialog__body {
				background-image: url('../assets/image/bg2.png') !important;
				background-repeat: no-repeat;
				background-position: top;
				background-size: 100%;
			}
			.per_con {
				h2 {
					margin: 0;
					text-align: center;
					color: white;
					font-weight: 500;
				}
				.img_wrap_ {
					text-align: center;
					img {
						margin-top: 20px;
						border-radius: 50%;
						border: 3px solid white;
					}
				}
				.per_info {
					width: 440px;
					margin-left: 6px;
					background: #F0F2F5;
					height: 80px;
					box-sizing: border-box;
					padding-top: 16px;
					display: flex;
					dl {
						border-right: 2px solid gainsboro;
						flex: auto;
						/*自个分配*/
						dd,
						dt {
							text-align: center;
							margin: 0 auto;
							line-height: 23px;
						}
						dd {
							color: darkgrey;
						}
					}
					dl:last-child {
						border: 0;
					}
				}
			}
		}
	}
	
</style>