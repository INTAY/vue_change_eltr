<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">
            <img src="../../static/img/titleLogo.png" alt srcset />
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell" v-if="this.count == '0'">
                    <el-tooltip effect="dark" content="消息中心" placement="bottom">
                        <i class="el-icon-bell"></i>
                    </el-tooltip>
                </div>
                <el-popover placement="top-start" width="350" trigger="hover" v-if="this.count != '0'" class="bellStyle">
                    <!-- 头部 -->
                    <el-row>
                        <!-- 待办事项数量 -->
                        <el-col :span="12">
                            <el-button type="text" class="btnFontsize">
                                待办<span class="LStyle"
                                    >(<span class="btnColor">{{ count }}</span
                                    >)</span
                                >
                            </el-button>
                        </el-col>
                        <!-- 更多 -->
                        <el-col :span="12" class="moreMessage">
                            <router-link to="/system/announcements">
                                <el-button type="text" class="btnBellMessage">更多<i class="el-icon-d-arrow-right"></i></el-button>
                            </router-link>
                        </el-col>
                    </el-row>
                    <el-row v-for="(item, index) in messageAll" :key="index" class="signMessage">
                        <div @click="signleMessageCheck(item)">
                            <el-col :span="2"
                                ><el-button type="text"><i class="el-icon-arrow-right"></i></el-button
                            ></el-col>
                            <el-col :span="11">
                                <el-button type="text" class="signleMessage">{{ item.name }}</el-button>
                            </el-col>
                            <el-col :span="11" class="timeCreated"
                                ><el-button type="text" class="signleMessage creaTime">{{ item.createTime }}</el-button></el-col
                            >
                        </div>
                    </el-row>
                        <!-- 闹铃 -->
                        <i slot="reference" class="el-icon-bell"></i>
                        <!-- 小圆点 -->
                        <div slot="reference" class="circleStyle"></div>
                </el-popover>

                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../static/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-s-custom" command="person">个人中心</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-edit-outline" command="resetpass">修改密码</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-circle-close" command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from './bus';
import { mapState, mapMutations } from 'vuex';
import { getEcommission } from '@/api/system/announcements';

export default {
    data() {
        return {
            collapse: true,
            fullscreen: false,
            name: '',
            count: 0,
            current: 0,
            messageAll: []
        };
    },
    computed: {
        username() {
            let username = sessionStorage.getItem('Username');
            return username ? username : this.name;
        }
    },
    methods: {
        //vuex,用于监听tag函数
        ...mapMutations(['SET_COLLAGETAG', 'set_v_showData', 'set_onBussin', 'set_isChange', 'set_isRun']),
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                sessionStorage.removeItem('Username');
                this.$router.push('/login');
                this.set_v_showData([]);
            } else if (command === 'person') {
                this.perCon();
            } else if (command === 'resetpass') {
                this.changePswd();
            }
        },
        perCon() {
            this.$parent.$refs.per.visible = true;
            this.$parent.$refs.per.sign = 1;
        },
        changePswd() {
            this.$parent.$refs.per.visible = true;
            this.$parent.$refs.per.sign = 2;
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
            this.SET_COLLAGETAG(this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        //获取未处理的待办事项数量
        async handlecommission() {
            const { data: res } = await getEcommission();
            this.count = res.count; // 数量
            //具体信息
            this.messageAll = res.messageAll;
        },
        signleMessageCheck(val) {
            //查询数据传送
            this.set_onBussin(val);
            //监听跳转的
            this.set_isChange(val);
            //页面不改变模糊查询和总体查询失效标识符
            this.set_isRun(true);
            //跳转到代办事项
            this.$router.push('/system/announcements');
        }
    },
    mounted() {
        //获取未处理的待办事项数量
        this.handlecommission();
        if (document.body.clientWidth > 1280) {
            this.collapseChage();
        }
    }
};
</script>

<style lang='less' scoped>
.header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    padding-left: 80px;
    font-size: 22px;
    color: #fff;
    cursor: pointer;
    background-image: url('../assets/image/headerBGP.png');
}
.collapse {
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 100%;
    font-size: 40px;
    text-align: center;
    line-height: 70px;
    background-color: rgba(8, 74, 100, 0.4);
}
.header .logo {
    display: flex;
    align-items: center;
    margin-right: 30px;
    img {
        width: 100%;
        height: 100%;
        margin-right: 20px;
    }
}
.header-right {
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell:hover {
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.btnFontsize {
    width: 50px;
    font-size: 15px;
    font-weight: 500;
    .LStyle {
        margin-left: 9px;
    }
    .btnColor {
        margin: 3px;
        color: #ff3b42;
    }
}
.moreMessage {
    position: relative;
    .btnBellMessage {
        position: absolute;
        right: 0px;
        top: 0px;
        font-size: 15px;
        font-weight: 500;
    }
}
.el-icon-arrow-right {
    font-size: 14px;
    font-weight: 800;
}
.signMessage {
    border-bottom: 1px solid #e5e5e5;
    cursor: pointer;
}
.signleMessage {
    font-size: 14px;
    color: #252525;
}
.timeCreated {
    position: relative;

    .creaTime {
        position: absolute;
        right: 0px;
        top: 0px;
        color: #a5a5a5;
    }
}
//代办事项颜色
.bellStyle {
    position: relative;
    
}
//小圆点
.circleStyle {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 7px;
        height: 7px;
        background-color: red;
        border-radius: 50%;
        
    }
</style>
