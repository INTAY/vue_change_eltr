<template>
    <div class="sidebarMain">
        <!-- 用户信息显示 -->
        <div class="user-info">
            <div class="user-info-avator">
                <img src="../../static/img/img.jpg" class="user-avator" alt />
            </div>

            <div class="user-info-cont">
                <div class="user-info-name">{{name}}</div>
            </div>
        </div>
        <!-- 侧边导航栏 -->
        <div class="sidebar" @click="skipWatch"> 
        	
            <el-menu
                class="sidebar-el-menu"
                :default-active="sss"
                :collapse="collapse"
                unique-opened
                router
                @click="skipWatch"
            >
                <sidebar-item
                class="sidebar-item-menu"
                    v-for="route in router"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                    @click="skipWatch"
                />
            </el-menu>
        </div>
    </div>
</template>

<script>
import bus from './bus';
import { user_ } from '@/api/menu';
import { mapState,mapMutations } from 'vuex';
import SidebarItem from './SidebarItem';
export default {
    data() {
        return {
            name: sessionStorage.getItem('Username'),
            collapse: true,
            rootData: JSON.parse(sessionStorage.getItem('router')),
            sss:'',
            tapel: false
        };
    },
    components: { SidebarItem },
    computed: {
        ...mapState(['router','user']),
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
//  	let users = JSON.parse((sessionStorage.getItem('user')));
//  	user_(users.id).then(res=>{
//  		console.log(res.data.name)
//  		this.name = res.data.name
//  		sessionStorage.setItem('ms_username',this.name)
//  	})
    	
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    },
    mounted() {
    	this.activeMenu()
    },
    methods: {
        ...mapMutations(['SET_CHANGETAG']),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
			this.sss = path
        },
        skipWatch() {
            this.tapel = !this.tapel
            this.SET_CHANGETAG(this.tapel)
        }
    }
};
</script>

<style scoped>
.sidebarMain {
    position: relative;
    height: 100%;
    width: 100%;
}
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 94px;
    bottom: 70px;
    border-right: 1px solid #dbdbdb;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
    height: 110%;
    
}
.sidebar-el-menu:not(.el-menu--collapse
) {
    width: 219px;
    border: none;
}
.sidebar > ul {
    height: 100%;
}

.user-info {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 220px;
    height: 93px;
    border-bottom: 1px solid #dbdbdb;
    border-right: 1px solid #dbdbdb;
}

.user-info-avator {
    display: flex;
    align-items: center;
    padding-left: 5px;
    flex: 4;
}

.user-avator {
    margin-left: 15px;
    width: 55px;
    height: 55px;   
    border-radius: 50%;
}

.user-info-cont {
    flex: 7;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 16px;
    color: #232323;
}
</style>