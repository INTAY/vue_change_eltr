<template>
  <div class="default-class">
    <div class="list">
      <topform ref="topform"/>
      <operateTable ref="operateTable"/>
      <biaoge ref="biaoge"/>
    </div>
  </div>
</template>

<script>
  import operateTable from './components/chargeGun/operateTable';
  import biaoge from "./components/chargeGun/biaoge"
  import topform from "./components/chargeGun/topform";

  export default {
    data() {
      return {
      };
    },
    components: {biaoge, topform,  operateTable},
    destroyed() {
    },
    methods: {
    }
  };

</script>

<style lang="scss" scoped>
  .default-class {
    width: 100%;
    height: 100%;

    .tree {
      float: left;
      width: 220px;
      height: 100%;
    }

    .list {
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
    }
  }
</style>
