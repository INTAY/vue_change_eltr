<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar ref="sideba"></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
        
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="keepData">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
        <per-cenent ref="per" />
        <upd-pass ref="updPass" />
        <el-backtop target=".content">
            <div class="backtop">UP</div>
        </el-backtop>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
import { mapState,mapMutations } from "vuex";
import { user_ } from '@/api/power/user';
import PerCenent from "./perCenent";
import updPass from "./updPass";
import mixin from '@/mixin'
export default {
    data() {
        return {
            tagsList: [],
            collapse: true,
            keepData:[],
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags,
        PerCenent,
        updPass,
    },
    mixins:[mixin],
    watch:{
  	v_showData(a){
  		this.keepData = [];
		a.forEach(item => {
			this.keepData.push(this.keepNames(item.path))
		})
  	  }
    },
    computed:{
  	  ...mapState(['v_showData']),
    },
    methods:{
    	keepNames(paths){
			return paths.split('/')[paths.split('/').length-1]
//			return paths.substring(paths.indexOf('/'))
	    },
    },
    created() {
        bus.$on('collapse-content', (msg) => {
            this.collapse = msg;
        });
        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', (msg) => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
    mounted(){
    	if(JSON.parse(sessionStorage.getItem('user')).state == "4"){
    		this.$refs.updPass.visible = true
    	}
    }
};
</script>

<style scoped>
.backtop {
    height: 100%;
    width: 100%;
    background-color: #f2f5f6;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    line-height: 40px;
    color: #1989fa;
}
</style>
