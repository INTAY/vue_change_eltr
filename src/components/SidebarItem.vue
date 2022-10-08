<template>
    <div v-if="!item.hidden">
        <template
            v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow"
        >
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template slot="title">
                <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.id"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-submenu>
    </div>
</template>

<script>
import path from 'path';
import { isExternal } from '@/utils/validate';
import Item from './Item';
import AppLink from './Link';

export default {
    name: 'SidebarItem',
    components: { Item, AppLink },
    props: {
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data() {
        this.onlyOneChild = null;
        return {};
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            const showingChildren = children.filter((item) => {
                if (item.hidden) {
                    return false;
                } else {
                    this.onlyOneChild = item;
                    return true;
                }
            });

            if (showingChildren.length === 1) {
                return true;
            }
            if (showingChildren.length === 0) {
                this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
                return true;
            }

            return false;
        },
        resolvePath(routePath) {
            if (isExternal(routePath)) {
                return routePath;
            }
            if (isExternal(this.basePath)) {
                return this.basePath;
            }
            return path.resolve(this.basePath, routePath);
        }
    }
};
</script>

<style lang="less" scoped>
//一级侧边栏状态
/deep/.el-submenu__title {
    font-size: 16px;
}

//动态侧边栏状态
/deep/.el-menu-item.is-active {
    background-image: url(../assets/image/bg_active.png);
    background-repeat: no-repeat;
    background-position: 15px 4px;
    color: white;
    b {
        background: white !important;
    }
}
//二级导航栏背景颜色
/deep/.el-menu--inline {
    background-color: #f9f9f9 !important;
}
/deep/.el-submenu__title:hover {
    background: none;
    background-image: url(../assets/image/bg_hover.png);
    background-repeat: no-repeat;
    background-position: 10px 10px;
    color: #303133;
}

/deep/.el-submenu .el-menu-item:hover {
    background: none;
    background-image: url(../assets/image/bg_hover.png);
    background-repeat: no-repeat;
    background-position: 20px 5px;
    color: #303133;
    b {
        background: #acb8b8 !important;
    }
}
/deep/.el-submenu .el-menu-item {
    width: 100%;
    font-size: 16px;
    height: 45px;
    line-height: 45px;
}

/deep/.submenu-title-noDropdown {
    font-size: 16px;
    color: #303133;
}

/deep/.submenu-title-noDropdown:hover {
    background: none;
    background-image: url(../assets/image/bg_hover.png);
    background-repeat: no-repeat;
    background-position: 10px 8px;
    color: #303133;
}
/deep/.el-submenu {
    width: 219px;
}
</style>
