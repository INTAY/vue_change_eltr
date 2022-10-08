<template>
  <div class="default-class">
    <div class="tree-wrap" ref="treeScr">
      <tree ref="tree"/>
    </div>
    <div class="list">
      <tf ref="tf"/>
      <erji ref="erji"/>
      <biaoge ref="biaoge"/>
    </div>
  </div>
</template>

<script>
  import tf from "./components/dict/topform";
  import tree from "./components/dict/tree";
  import erji from "./components/dict/erji";
  import biaoge from "./components/dict/biaoge";

  export default {
  	name:'dict',
    data() {
      return {
        currentWidth: 440,
        leftWidth: 220
      };
    },
    components: {tree, biaoge, erji, tf},
    mounted() {
    },
    destroyed() {
      // this.$router.push('/power')
    },
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
        console.log(data);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .default-class {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    box-sizing: border-box;

    .tree-wrap {
      width: 200px;
      overflow-y: auto;
      float: left;
      height: 100%;
      background-color: #fafafa;
      padding-bottom: 50px;
    }

    .list {
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
    }

    /*修改滚动条样式*/
    .list::-webkit-scrollbar {
      width: 6px;
      height: 10px;
    }

    .list::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 2px;
    }

    .list::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }

    .list::-webkit-scrollbar-thumb:hover {
      background: #333;
    }

    .list::-webkit-scrollbar-corner {
      background: #179a16;
    }
  }
</style>

