 <template>
 	<div class="panel_info">
 		<h3>{{entity.name}}</h3>
 		<ul>
 			<li><span class="a_label">组织机构简称 ：</span><span class='a'>{{entity.simpleName}}</span></li>
 			<li><span class="a_label">业务分类 ：</span><span class='a'>{{entity.serviceTypeName}}</span></li>
 			<li><span class="a_label">联系人 ：</span><span class='a'>{{entity.linkName}}</span></li>
 			<li><span class="a_label">联系电话 ：</span><span class='a'>{{entity.linkPhone}}</span></li>
 			<li><span class="a_label">详细地址 ：</span><span class='a'>{{entity.addresDesc}}</span></li>
 			<li><span class="a_label">描述 ：</span><span class='a'>{{entity.description}}</span></li>
 		</ul>
 		
 	</div>
</template>

<script>
export default {
  data() {
    return {
      entity: {}
    };
  },
  created(){
  	this.entity = JSON.parse(localStorage.getItem("insData"))[0]
  },
  methods: {
    update(data){
      this.entity = data;
    }
  }
};
</script>
<style lang="scss" scoped>
  .panel_info{
  	padding: 7px 22px;
  	ul{
  		padding: 0;
  		margin: 0;
  		display: flex;
  		line-height: 25px;font-size: 14px;color: darkgrey;
  		flex-flow: wrap;
  		li{
  			list-style: none;
  			flex: 33.3%;
  			white-space: nowrap;
			overflow: hidden; 
			text-overflow:ellipsis;
  			
  		}
  		.a_label{
  			display: inline-block;width: 120px;text-align: right;
  		}
  		.a{
  			color: black;
  		}
  	}
  }
  h3{
  	margin: 0;
  	line-height: 38px;
  	font-size: 20px;
  }
</style>





 