<template>
  <div>
    <div>数据处理接口</div>
    <div>{{ this.user.pathData.resPath }}</div>
    <div>{{ this.user.pathData.id }}</div>
    <div>{{ this.user.pathData.applyTime }}</div>

  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
        ...mapState(["user"]),
  },

};
</script>

<style lang="sass" scoped>

</style>