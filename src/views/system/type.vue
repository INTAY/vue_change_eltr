<template>
  <div>
    <div class="div">
        <!-- 设备型号 -->
        <div class="list" :style="{width: 'calc(100% - ' + currentWidth + 'px)'}">
          <yy ref="topform"/>
          <erji />
          <zz class="bg" ref="biaoge"/>
      </div>
    </div>
  </div>
</template>

<script>
import yy from "./components/type/topform";
import erji from "./components/type/erji";
import zz from "./components/type/biaoge";


export default {
  data() {
    return {
      currentWidth: 1,
    };
  },
  components: { yy, zz, erji },
  mounted() {},
  methods: {
    changeWidow(bool) {
      if (bool) {
        this.currentWidth = 1;
      } else {
        this.currentWidth = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.div {
  width: 100%;
  height: 100%;
}
</style>
