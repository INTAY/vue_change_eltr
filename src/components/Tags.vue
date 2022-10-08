<template>
    <div class="tags" v-if="showTags" ref="tags">
        <ul>
            <li
                ref="tagsli"
                class="tags-li"
                v-for="(item, index) in this.v_showData.slice(0, 10)"
                :class="{ active: isActive(item.path) }"
                :key="index"
            >
                <router-link :to="item.path" class="tags-li-title">
                    {{ item.title }}
                </router-link>
                <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
            <el-dropdown v-if="this.v_showData.slice(10).length != 0" class="dropdownPosition">
                <el-button type="primary"> 更多主页<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item, index) in this.v_showData.slice(10)" :key="index">
                        <router-link :to="item.path" class="tags-li-title">
                            {{ item.title }}
                        </router-link>
                        <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </ul>

        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="text" class="buttonTags">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import bus from './bus';
export default {
    data() {
        return {
            tagsList: [],
            showLess: 1,
            moreTagList: [], //总长度没有超过tag的长度时，多余部分接收的;
            lessTagList: [], //总长度没有超过tag的长度
            BtnNumber: null //最终能够容纳多少个
        };
    },
    watch: {
        $route(newValue, oldValue) {
            this.setTags(newValue);
            this.$parent.$refs.sideba.activeMenu();
        },
        //深度监听
        tagsList: {
            handler(val, oldVal) {
                this.set_v_showData(val);
                bus.$emit('tags', val);
            },
            deep: true
        }
    },
    methods: {
        ...mapMutations(['set_v_showData']),
        isActive(path) {
            return path === this.$route.fullPath;
        },
        // 关闭单个标签
        closeTags(index) {
            //当数据大于1的时候能进行此曹志勇
            if (this.v_showData.length > 1) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                } else {
                    this.$router.push('/');
                }
            } else {
                this.$message.warning("只有一个标签的时候,单个删除标签无法生效")
            }
        },
        // 关闭全部标签
        closeAll() {
            //过首页数据
            var r = this.v_showData.filter(function (obj, index, array) {
                if (index == 0) return obj;
            });
            //把只剩下首页数据赋值到this.tagList里
            this.tagsList = r;
            //跳转
            this.$router.push(this.tagsList[0].path);
        },
        // 关闭其他标签
        closeOther() {
            const curItem = this.tagsList.filter((item) => {
                return item.path === this.$route.fullPath;
            });
            //刷新签页
            this.tagsList = curItem;
        },
        // 设置标签
        setTags(route) {
            const isExist = this.tagsList.some((item) => {
                return item.path === route.fullPath;
            });
            if (!isExist) {
                if (this.tagsList.length >= 25) {
                    this.tagsList.shift();
                    this.$message.warning('缓存的界面已经达到25个,超出上限,继续打开界面的界面将挤掉第一个界面');
                }
                this.tagsList.push({
                    title: route.meta.title,
                    path: route.fullPath
                });
            }
        },
        handleTags(command) {
            command === 'other' ? this.closeOther() : this.closeAll();
        }
    },
    computed: {
        ...mapState(['v_showData', 'user']),
        showTags() {
            return this.tagsList.length > 0;
        },
        //vuex里的数据在此获得数据并监听
        changeTag() {
            return this.$store.state.user.changeTag;
        },
        collageTag() {
            return this.$store.state.user.collageTag;
        }
    },
    mounted() {
        if (this.tagsList && this.tagsList.length) {
            //刷新后vuex把数据取下
        } else {
            this.tagsList = this.v_showData;
        }
        this.setTags(this.$route);
        // 监听关闭当前页面的标签页
        bus.$on('close_current_tags', () => {
            for (let i = 0, len = this.tagsList.length; i < len; i++) {
                const item = this.tagsList[i];
                if (item.path === this.$route.fullPath) {
                    if (i < len - 1) {
                        this.$router.push(this.tagsList[i + 1].path);
                    } else if (i > 0) {
                        this.$router.push(this.tagsList[i - 1].path);
                    } else {
                        this.$router.push('/');
                    }
                    this.tagsList.splice(i, 1);
                    break;
                }
            }
        });
        //加上异步事件，防止数据在DOM还未渲染完的时候就去获取DOM
    }
};
</script>


<style scoped>
.tags {
    /* position: relative; */
    height: 32px;
    overflow: hidden;
    background: #f1f1f1;
    padding-right: 220px;
}

.tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.tags-li {
    float: left;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    height: 23px;
    line-height: 23px;
    margin: 4px 5px;
    border-right: 1px solid #ccc;
    border-radius: 2px;
    padding: 0 15px 0 12px;
    vertical-align: middle;
    color: #666;
    -webkit-transition: all 0.3s ease-in;
    -moz-transition: all 0.3s ease-in;
    transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
    background: #f8f8f8;
}

.tags-li.active {
    color: #fff;
    background-color: #1396c2;
    border: none;
}

.tags-li-title {
    float: left;
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    color: #666;
}

.tags-li.active .tags-li-title {
    color: #fff;
}

.tags-close-box {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    text-align: center;
    width: 110px;
    height: 30px;
    z-index: 10;
}
.buttonTags {
    border: none;
    font-size: 14px;
    color: #5a5a5a;
}
.dropdownPosition {
    position: absolute;
    top: 0px;
    right: 100px;
}
</style>
