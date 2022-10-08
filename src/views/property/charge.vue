<template>
  <div class="default-class">
    <div class="list">
      <topform ref="topform"/>
      <erji ref="erji"/>
      <biaoge ref="biaoge"/>
    </div>
  </div>
</template>

<script>
  import erji from './components/charge/erji';
  import biaoge from "./components/charge/biaoge";
  import topform from "./components/charge/topform";
  export default {
    data() {
      return {
        currentWidth: 220,
        leftWidth: 220,
      };
    },
    components: { biaoge, topform,  erji},
    methods: {


      changeWidow(bool) {
        if (bool) {
          this.currentWidth = 440;
          this.leftWidth = 220;
        } else {
          this.currentWidth = 220;
          this.leftWidth = 219;
        }
      },
      handleNodeClick(data) {
      },
    }
  };

</script>

<style lang="scss" scoped>
  .default-class {
    width: 100%;
    height: 100%;
    .list {
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
    }
  }
</style>
