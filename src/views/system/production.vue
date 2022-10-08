// 生产厂家页面
<template>
  <div>
    <!-- 生产厂家 -->
    <div class="list">
      <topForm ref="topform"/>
      <erji ref="erji"/>
      <biaoge class="bg" ref="biaoge"/>
    </div>
  </div>
</template>

<script>
  import topForm from "./components/production/topform";
  import erji from "./components/production/erji.vue";
  import biaoge from "./components/production/biaoge";


  export default {
    data() {
      return {
        currentWidth: 1
      };
    },
    components: {biaoge, topForm, erji},
    mounted() {
    },
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
