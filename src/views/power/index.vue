<template>
  <div class="child-content">
    <router-view />
  </div>
</template>

<script>

export default {
};
</script>
<style lang="scss" scoped>
  .child-content{
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-left: 20px;
  }
</style>
