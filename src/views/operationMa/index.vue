<template>
    <div class="child-content">
      <div class="content">
        <router-view />
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  mounted() {},
  methods:{
  },
};
</script>

<style lang="scss" scoped>
  .child-content{
    position: relative;
    width: 100%;
    height: 100%;
    .left_menu{
      float: left;
      width: 220px;
      height: 100%;
    }
    .content{
      height: 100%;
      overflow-y: auto;
    }
    /*修改滚动条样式*/
    .content::-webkit-scrollbar{
      width:6px;
      height:10px;
    }
    .content::-webkit-scrollbar-track{
      background: rgb(239, 239, 239);
      border-radius:2px;
    }
    .content::-webkit-scrollbar-thumb{
      background: #bfbfbf;
      border-radius:10px;
    }
    .content::-webkit-scrollbar-thumb:hover{
      background: #333;
    }
    .content::-webkit-scrollbar-corner{
      background: #179a16;
    }
  }
</style>
