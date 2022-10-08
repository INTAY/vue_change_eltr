<template>
	<div class="table_wrap">
  <pagetable
    :data="zytab"
    stripe
    :current-page="currentPage"
    :pageSize="pageSize"
    :total="total"
    @refresh-data="handleRefresh"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    @selection-change="handleSelectionChange">

    <el-table-column type="index" width="40"></el-table-column>

    <el-table-column type="selection" width="50"  align="center"></el-table-column>

    <el-table-column label="资源名称" show-overflow-tooltip prop="name"></el-table-column>
    
    <el-table-column width="180" label="父级路径" show-overflow-tooltip prop="parentUrl"></el-table-column>

    <el-table-column label="资源类型" show-overflow-tooltip prop="type" :formatter = "typeFormat"></el-table-column>

    <el-table-column label="资源CODE" show-overflow-tooltip prop="code" width="200"></el-table-column>

    <el-table-column label="资源路径" show-overflow-tooltip prop="url" width="220"></el-table-column>

    <el-table-column label="方法" prop="method" width="60"></el-table-column>

    <el-table-column label="是否公有" prop="pub" width="80">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.pub" size="small">是</el-tag>
        <el-tag v-else size="small" type="success">否</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="是否有效" prop="valid" width="80">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.valid" size="small">是</el-tag>
        <el-tag v-else size="small" type="success">否</el-tag>
      </template>
    </el-table-column>
    
    <el-table-column label="是否App资源" prop="isApp" width="80">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.isApp" size="small">是</el-tag>
        <el-tag v-else size="small" type="success">否</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="描述" prop="description" show-overflow-tooltip></el-table-column>

    <el-table-column label="序号" prop="orderNum" width="50"></el-table-column>

    <el-table-column fixed="right" label="操作" width="140">
      <template slot-scope="scope">
        <el-button class="common-btn buleBTN" size="mini" @click="openEdit(scope.$index, scope.row)">修改</el-button>
        <el-button class="delete-btn redBTN" size="mini" @click="Delete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </pagetable>
  </div>
</template>

<script>
  import { queryPage, resDel, xiuGai,getChildren } from "@/api/power/resource";
  import {find,isNil} from 'lodash';
  import pagetable from "@/components/pagetable"

  export default {
    data() {
      return {
        zytab: [],
        delButDisabled: true,
        xgzy: false,
        xgzyfrom: {},
        jieshouURL: {},
        SelectionArray:[],//批量删除
        parentId: null,
        selTreeNodeType: 0,
        pageSize: 20,
        currentPage: 1,
        total: 0,
        url:'',
        name:''
      };
    },
    components: {pagetable},
    created() {
    },
    mounted () {
    },
    watch: {
      SelectionArray(value) {
        if(value.length==0){
          this.delButDisabled = true;
        }else{
          this.delButDisabled = false;
        }
      }
    },
    methods: {
      changeleColum(type){
        this.selTreeNodeType = type;
      },
      typeFormat(row, column, cellValue, index){
        var dict = find(this.$parent.$parent.$parent.resTypes,{"value":cellValue});
        if(dict==null){
          return "";
        }else{
          return dict.name;
        }
      },
      //查询
      query() {
        let data = {};
        data.parentId = this.parentId;
        data.url = this.url;
        data.name = this.name;
        data.page = {orders: [{"asc": true,"column": "orderNum"}]};
        data.current = this.currentPage;
        data.size = this.pageSize;
        queryPage(data).then(res => {
          if("000000"==res.code){
            this.zytab = res.data.records;
            this.pageSize = res.data.size
            this.currentPage = res.data.current
            this.total = res.data.total
          }else{
            this.$message.error(res.mesg);
          }
        });
      },

      //表格选选择框事件
      handleSelectionChange(val){
        this.SelectionArray = val;
        if(val.length>0){
          this.$parent.$parent.$parent.$refs.erji.removeButDisabled = false;
        }else{
          this.$parent.$parent.$parent.$refs.erji.removeButDisabled = true;
        }
        var ids = [];
        for(var i=0;i<val.length;i++){
          ids[i] = val[i].id;
        }
        this.$parent.$parent.$parent.$refs.erji.delResIds = ids;
      },
      // 删除
      Delete(index, row) {
        this.$confirm('确定要删除吗?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "messagebox-button",
          cancelButtonClass: "messagebox-button"
        }).then(() => {
          let id = row.id;
        resDel(id)
          .then(res => {
            if("000000"==res.code){
//          	 this.$parent.$parent.$parent.$refs.tree.treeKey = + new Date();
              this.$parent.$parent.$parent.$refs.tree.rest()
              this.$parent.$parent.$parent.queryTableData(this.$parent.$parent.$parent.searchName,null);
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            }else{
              this.$message.error(res.mesg);
            }
          });
        });
      },
      openEdit(index,rowdata){
        this.$parent.$parent.$parent.handleUpdateButClick(rowdata);
      },
      getChildrenByParnentId(parentId){
        getChildren(parentId)
          .then(res => {
            this.zytab = res.data;
          });
      },
      openButDetail(rowdata){
        this.$parent.$parent.$parent.handleButDetailClick(rowdata);
      },
      // 分页点击事件
      handleSizeChange(val) {
        this.pageSize = val;
        this.query();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.query();
      },
      handleRefresh(){
        this.query2();
      }
    }
  };
</script>
<style lang="scss">
.table_wrap{
	.el-tag.el-tag--success {
    background-color: #ffeeee;
    border-color: #e9cccc;
    color: #b45252;
}
		.table-action-button{
			padding: 4px 8px 3px 8px;
			margin: 5px 1px;
		}
		.red{
			color: #ff4949;
		}
  }
</style>

