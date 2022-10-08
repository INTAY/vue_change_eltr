<template>
    <div class="home">
        <img class="logo" src="../../assets/image/login_logo.png" alt="公司logo" />
        <div class="login">
            <div class="login_in">用户登录</div>
            <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="80px"
                class="demo-ruleForm"
                label-position="top"
            >
                <el-form-item label="用户名" prop="userName">
                    <el-input type="text" v-model="ruleForm.userName" autocomplete="off" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="captcha">
                    <el-row>
                        <el-col :span="14">
                            <el-input v-model="ruleForm.captcha" autocomplete="off" placeholder="验证码"></el-input>
                        </el-col>
                        <el-col :span="9" :offset="1">
                            <img :src="captchaPath" @click="getCaptcha()" alt style="width: 100%; height: 35px; cursor: pointer" />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button class="logins" @click="submit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import request from '@/api/request';
import { userInfo } from '@/api/power/user';
import JSEncrypt from "jsencrypt";
// import JSEncrypt from "@/utils/jsencrypt.min.js";
import { isNil } from 'lodash';
import { mapMutations } from 'vuex';
import { getOrgTree } from '../../api/operation/pushButton';
import { getAllNode } from '../../utils/area';
import { getDictData } from '../../api/dict';
import { getRouters } from '@/api/menu';
import { user_, getOrgById } from '@/api/power/user';
export default {
    data() {
        var yzm = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码'));
            } else {
                callback();
            }
        };
        var password = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        var userName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                callback();
            }
        };
        return {
            uuid: null,
            ruleForm: {
                userName: '',
                password: '',
                captcha: ''
            },
            captchaPath: '',
            rules: {
                userName: [{ validator: userName, trigger: 'blur' }],
                password: [{ validator: password, trigger: 'blur' }],
                captcha: [{ validator: yzm, trigger: 'blur' }]
            }
        };
    },
    created() {
        // 绑定enter事件
        this.enterKeyup();
        localStorage.clear();
        sessionStorage.clear();
    },
    destroyed() {
        // 销毁enter事件
        this.enterKeyupDestroyed();
    },
    mounted() {
        this.getCaptcha();
    },
    methods: {
        ...mapMutations(['stateColseAll', 'setPath', 'addRoutes']),
        getPublicKey() {
            return axios({
                url: request.adornUrl(`/authentication/auth/publickey`),
                method: 'GET'
            });
        },
        submit() {
            var that = this;
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    that.getPublicKey().then((res) => {
                        if ('000000' === res.data.code) {
                            var publickey = res.data.data;

                            var formData = new FormData();
                            formData.append('username', that.ruleForm.userName);

                            const encrypt = new JSEncrypt();
                            encrypt.setPublicKey(publickey);
                            var enpassword = encrypt.encrypt(that.ruleForm.password); // 加密后的字符串

                            formData.append('password', enpassword);

                            axios({
                                url: request.adornUrl(
                                    `/authorization/oauth/token?scope=read&grant_type=password&userType=1&verifiCode=` +
                                        that.ruleForm.captcha +
                                        '&uuid=' +
                                        that.uuid
                                ),
                                method: 'POST',
                                data: formData,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    Authorization: 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='
                                }
                            })
                                .then(async (res2) => {
                                    if (res2.data.status && res2.data.status == '4445') {
                                        that.$message.error('已达最大连接数,无法登陆');
                                        return true;
                                    } else if ('200' == res2.status) {
                                        if (isNil(res2.data.code)) {
                                            sessionStorage.setItem('isLogin', 1);
                                            that.stateColseAll([]);
                                            that.setPath({});
                                            //登录成功，保存token等信息，跳转到主页
                                            that.$cookie.set('token', res2.data.access_token);
                                            that.$cookie.set('refresh_token', res2.data.refresh_token);
                                            that.$cookie.set('expires_in', res2.data.expires_in);
                                            that.$cookie.set('username', res2.data.username);
                                            sessionStorage.setItem('user', JSON.stringify(res2.data));
                                            sessionStorage.setItem('roleId', JSON.stringify(res2.data.roleId));
                                            sessionStorage.setItem('id', res2.data.id);
                                            sessionStorage.setItem('orgId', JSON.stringify(res2.data.orgId));
                                            sessionStorage.setItem('ms_username', res2.data.username);
                                            //获取username
                                            let id = res2.data.id;
                                            const res = await user_(id);
                                            sessionStorage.setItem('Username', res.data.name);
                                            //获取组织机构的名称
                                            let orgIdData = res2.data.orgId;
                                            const { data: resData } = await getOrgById(orgIdData);

                                            sessionStorage.setItem('orgName', resData.name);
                                            //  设置区域id
                                            sessionStorage.setItem('regId', resData.regionId);

                                            //跳转到主页面
                                            that.$router.push('/');
                                            console.log("1111");
                                        } else {
                                            that.$message.error(res2.data.msg);
                                            that.getCaptcha();
                                        }
                                    } else {
                                        that.getCaptcha();
                                        that.$message.error(res2.data.msg);
                                    }
                                })
                                .catch(function (error) {
                                    that.getCaptcha();
                                    that.$message.error(error.response.data.data.error_description);
                                });
                        } else {
                            that.getCaptcha();
                        }
                    });
                }
            });
        },
        // 获取验证码
        getCaptcha() {
            this.uuid = this.getUUID();
            this.captchaPath = request.captchaPath(this.uuid);
        },
        getUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16);
            });
        },
        enterKey(event) {
            if (event.keyCode == '13') {
                this.submit();
            }
        },
        enterKeyupDestroyed() {
            document.removeEventListener('keyup', this.enterKey);
        },
        enterKeyup() {
            document.addEventListener('keyup', this.enterKey);
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    min-height: 600px;
    background: url(../../assets/image/bg.jpg);
    background-size: 100% 100%;
    text-align: center;
    .logo {
        position: absolute;
        top: 5%;
        left: 3%;
        width: 863px;
        height: 60px;
        object-fit: cover;
    }
    //登录框
    .login {
        position: absolute;
        top: 20%;
        right: 10%;
        width: 480px;
        height: 520px;
        background: #fff;
        border: 1px solid #74b8c0;
        border-radius: 6px;
        padding: 60px 60px 0px;
        box-sizing: border-box;
        text-align: left;
        .login_in {
            font-size: 25px;
            letter-spacing: 3px;
            margin-bottom: 20px;
        }
    }
    //登录按钮
    .logins {
        width: 100%;
        height: 40px;
        text-align: center;
        background-color: #1394be;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        letter-spacing: 5px;
        border-radius: 3px;
    }
}

/deep/ .el-form-item__label {
    color: #0d0e0e;
}
/deep/.el-input__inner {
    border: none;
    border-bottom: 1px solid #dcdfe6;
}
</style>