<template>
  <div class="special_tour">
  	<router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
    	
    };
  },
  methods: {
  	
  },
};
</script>

<style lang="scss">
	.special_tour{
		padding: 8px;
		.el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
			 background: #1396C2;color: white;
		}
		.el-tabs__nav{
			height: 32px;
		}
		.el-tabs__item{
			/*background: #F9F9F9;*/
			line-height: 32px;width: 150px;text-align: center;
			/*background-image: url(../../../static/img/13.png);
   			background-repeat: no-repeat;
   	 		background-size: 100%;*/
    		/*background-position: 0px 2px;*/
		}
	}
</style>
