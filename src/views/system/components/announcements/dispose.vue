<template>
  <el-dialog
    title="处理"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :modal-append-to-body="false"
  >
    <div v-for="(content, index) in openListValue" :key="index">
      <!-- component标签创建动态组件，is属性指向谁，就显示哪个组件 -->
      <component
        :key="content.index"
        :is="content.component"
        :ref="content.refName"
        :refName="content.refName"
        v-if="content.relPath == 'system/about.vue'"
      ></component>
    </div>
  </el-dialog>
</template>

<script>
import { openModules } from "@/config/index";
import {mapState,mapMutations} from "vuex"

export default {
  data() {
    return {
      visible: false,
      openList: [],
      openListValue: [],
    };
  },
  mounted() {
    this.getList();
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    getList() {
      this.openList = openModules()[0];
      this.openListValue = this.openList.modules;
    },
  },
};
</script>