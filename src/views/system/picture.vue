<template>
  <div>
    <div class="div">
      <div class="nr">
        <div class="list" :style="{width: 'calc(100% - ' + currentWidth + 'px)'}">
          <topform ref="topform"/>
          <erji ref="erji"/>
          <zz class="bg" ref="biaoge"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topform from "./components/picture/topform";
import erji from "./components/picture/erji";
import zz from "./components/picture/biaoge";

export default {
  data() {
    return {
      currentWidth: 1,
    };
  },
  components: { topform, zz, erji },
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
